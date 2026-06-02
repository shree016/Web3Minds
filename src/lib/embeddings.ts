const HF_API_URL =
  'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2'

// Returns a 384-dimensional embedding vector for the given text.
// Requires VITE_HUGGINGFACE_API_KEY in .env.local
export async function getEmbedding(text: string): Promise<number[]> {
  const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY
  if (!apiKey) throw new Error('VITE_HUGGINGFACE_API_KEY is not set in .env.local')

  const response = await fetch(HF_API_URL, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ inputs: text }),
  })

  if (!response.ok) {
    const body = await response.text()
    // Model may still be loading on free tier — surface a clear error
    if (response.status === 503) {
      throw new Error('HuggingFace model is warming up. Please retry in ~20 seconds.')
    }
    throw new Error(`HuggingFace API error ${response.status}: ${body}`)
  }

  const result = await response.json()
  // API returns [[...384 floats...]] — unwrap outer array if present
  return Array.isArray(result[0]) ? (result[0] as number[]) : (result as number[])
}
