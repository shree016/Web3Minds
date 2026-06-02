/**
 * Whitepaper ingestion script — run ONCE after downloading PDFs.
 *
 * Usage:
 *   1. Copy .env.local values to .env  (the script reads from .env via dotenv)
 *   2. npm install pdf-parse ts-node dotenv --save-dev
 *   3. Create a ./pdfs/ directory and add whitepaper PDFs:
 *        pdfs/bitcoin.pdf, pdfs/ethereum.pdf, etc.
 *   4. npx ts-node -r dotenv/config scripts/ingest-whitepapers.ts
 *
 * Required env vars:
 *   VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, VITE_HUGGINGFACE_API_KEY
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// These use process.env because this runs in Node, not the browser
const supabaseUrl = process.env.VITE_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const hfApiKey = process.env.VITE_HUGGINGFACE_API_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey)
const HF_URL = 'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2'

async function getEmbedding(text: string): Promise<number[]> {
  const res = await fetch(HF_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${hfApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: text }),
  })
  if (!res.ok) {
    const body = await res.text()
    if (res.status === 503) {
      // Model loading — wait 20s then retry once
      console.log('  HF model warming up — waiting 20s...')
      await sleep(20000)
      return getEmbedding(text)
    }
    throw new Error(`HuggingFace error ${res.status}: ${body}`)
  }
  const result = (await res.json()) as number[] | number[][]
  return Array.isArray(result[0]) ? (result[0] as number[]) : (result as number[])
}

function chunkText(text: string, chunkSize = 500, overlap = 50): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const chunks: string[] = []
  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(' ')
    if (chunk.length > 100) chunks.push(chunk)
  }
  return chunks
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

async function clearExistingChunks(whitepaperSlug: string) {
  const { data: wp } = await supabase
    .from('whitepapers')
    .select('id')
    .eq('slug', whitepaperSlug)
    .single()
  if (!wp) return
  await supabase.from('whitepaper_chunks').delete().eq('whitepaper_id', wp.id)
  console.log(`  Cleared existing chunks for "${whitepaperSlug}"`)
}

async function ingestPDF(whitepaperSlug: string, pdfPath: string) {
  if (!fs.existsSync(pdfPath)) {
    console.warn(`⚠️  PDF not found at ${pdfPath} — skipping "${whitepaperSlug}"`)
    return
  }

  // Dynamic import for ESM/CJS compat
  const pdfParse = (await import('pdf-parse')).default

  const { data: wp } = await supabase
    .from('whitepapers')
    .select('id')
    .eq('slug', whitepaperSlug)
    .single()

  if (!wp) {
    console.error(`❌ Whitepaper "${whitepaperSlug}" not found in database. Run the SQL schema first.`)
    return
  }

  const buffer = fs.readFileSync(pdfPath)
  const pdfData = await pdfParse(buffer)
  const chunks = chunkText(pdfData.text)

  console.log(`\n📄 Ingesting "${whitepaperSlug}" — ${chunks.length} chunks from ${path.basename(pdfPath)}`)

  let done = 0
  for (let i = 0; i < chunks.length; i++) {
    try {
      const embedding = await getEmbedding(chunks[i])
      const { error } = await supabase.from('whitepaper_chunks').insert({
        whitepaper_id: wp.id,
        chunk_index: i,
        content: chunks[i],
        embedding,
      })
      if (error) throw error
      done++
      if (i % 10 === 0 || i === chunks.length - 1) {
        process.stdout.write(`\r  ${i + 1}/${chunks.length} chunks`)
      }
      // Respect HF free tier rate limit (~600 req/min)
      await sleep(120)
    } catch (err) {
      console.error(`\n  ⚠️  Chunk ${i} failed:`, err)
      await sleep(2000) // back off on error
    }
  }
  console.log(`\n✅ "${whitepaperSlug}" — ${done}/${chunks.length} chunks ingested`)
}

// ============================================================
// Configure which PDFs to ingest below
// Download PDFs and place in ./pdfs/ before running
// ============================================================
async function main() {
  console.log('🚀 Web3Minds whitepaper ingestion starting...\n')

  const pdfsToIngest: [string, string][] = [
    ['bitcoin', './pdfs/bitcoin.pdf'],
    // ['ethereum', './pdfs/ethereum.pdf'],
    // ['uniswap-v2', './pdfs/uniswap-v2.pdf'],
    // ['lightning-network', './pdfs/lightning-network.pdf'],
    // ['zerocash', './pdfs/zerocash.pdf'],
  ]

  for (const [slug, pdfPath] of pdfsToIngest) {
    await clearExistingChunks(slug)
    await ingestPDF(slug, pdfPath)
  }

  console.log('\n🎉 Ingestion complete! Vector search is now available.')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
