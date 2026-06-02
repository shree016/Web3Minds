import { supabase } from './supabase'
import { getEmbedding } from './embeddings'
import { getGeminiModel, safeGenerate } from './gemini-safety'

export type RAGChunk = {
  id: string
  whitepaper_id: string
  content: string
  section_title: string
  similarity: number
}

export type RAGSource = {
  section: string
  preview: string
  similarity: number
}

export type RAGAnswer = {
  answer: string
  sources: RAGSource[]
  usedRAG: boolean
}

// Step 1 — embed the question and find matching chunks via pgvector
export async function retrieveChunks(
  question: string,
  whitepaperIds?: string[]
): Promise<RAGChunk[]> {
  const embedding = await getEmbedding(question)

  const { data, error } = await supabase.rpc('match_whitepaper_chunks', {
    query_embedding: embedding,
    match_threshold: 0.6,
    match_count: 6,
  })

  if (error) throw error
  if (!data || data.length === 0) return []

  if (whitepaperIds && whitepaperIds.length > 0) {
    return (data as RAGChunk[]).filter((c) => whitepaperIds.includes(c.whitepaper_id))
  }

  return data as RAGChunk[]
}

// Step 2 — generate a grounded answer using the retrieved chunks
export async function generateRAGAnswer(
  question: string,
  chunks: RAGChunk[],
  studentBackground = 'general student'
): Promise<string> {
  const model = getGeminiModel()

  const context = chunks
    .map((c, i) => `[Source ${i + 1} — ${c.section_title || 'Whitepaper Section'}]:\n${c.content}`)
    .join('\n\n')

  // Educational framing avoids content filter false-positives on terms
  // like "attack", "exploit", or "vulnerability" that appear in blockchain research.
  const prompt = `You are a blockchain educator on an educational learning platform for students.
Your role is to help students understand blockchain research papers.
Student background: ${studentBackground}

The student is studying: "${question}"

Here are the relevant passages from the original research paper:
${context}

Please explain the answer using ONLY the passages above.
Guidelines:
- Keep your answer under 200 words
- Use clear, educational language
- Reference which section your answer comes from (e.g. "According to Section 3...")
- Frame all technical concepts in a positive, learning-focused way
- If passages don't contain enough information, say so honestly
Return only the explanation text.`

  return safeGenerate(
    model,
    prompt,
    "I couldn't find a clear answer in the whitepaper for that question. Try highlighting a specific section or rephrasing your question."
  )
}

// Full pipeline — call this from pages/components
export async function askWhitepaper(
  question: string,
  whitepaperIds?: string[],
  studentBackground?: string
): Promise<RAGAnswer> {
  const hasHFKey = !!import.meta.env.VITE_HUGGINGFACE_API_KEY
  const hasSupabase = !!import.meta.env.VITE_SUPABASE_URL

  if (!hasHFKey || !hasSupabase) {
    return fallbackAsk(question)
  }

  try {
    const chunks = await retrieveChunks(question, whitepaperIds)

    if (!chunks || chunks.length === 0) {
      return fallbackAsk(question)
    }

    const answer = await generateRAGAnswer(question, chunks, studentBackground)
    return {
      answer,
      usedRAG: true,
      sources: chunks.slice(0, 3).map((c) => ({
        section: c.section_title || 'Whitepaper Section',
        preview: c.content.substring(0, 120) + '…',
        similarity: Math.round(c.similarity * 100) / 100,
      })),
    }
  } catch {
    return fallbackAsk(question)
  }
}

// Plain Gemini answer when HF/Supabase isn't configured or RAG returns nothing
async function fallbackAsk(question: string): Promise<RAGAnswer> {
  try {
    const model = getGeminiModel()
    const answer = await safeGenerate(
      model,
      `You are a blockchain educator. A student on a learning platform asked: "${question}".
Give a clear, educational answer in under 150 words. Frame all technical concepts positively.`,
      'AI explanation is unavailable right now. Please check your API key configuration.'
    )
    return { answer, sources: [], usedRAG: false }
  } catch {
    return {
      answer: 'AI explanation is unavailable right now. Please check your API key configuration.',
      sources: [],
      usedRAG: false,
    }
  }
}

// Fetch all text chunks for a whitepaper (for the reader text display)
export async function getWhitepaperChunks(whitepaperSlug: string) {
  const { data: wp } = await supabase
    .from('whitepapers')
    .select('id')
    .eq('slug', whitepaperSlug)
    .single()

  if (!wp) return []

  const { data } = await supabase
    .from('whitepaper_chunks')
    .select('id, chunk_index, section_title, content')
    .eq('whitepaper_id', wp.id)
    .order('chunk_index', { ascending: true })

  return data || []
}
