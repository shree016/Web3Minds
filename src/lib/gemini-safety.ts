import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  type GenerativeModel,
} from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '')

// Always use this instead of calling genAI.getGenerativeModel() directly.
// Safety thresholds are relaxed from the default BLOCK_MEDIUM_AND_ABOVE to
// BLOCK_ONLY_HIGH, which is appropriate for educational blockchain content
// (topics like "attacks", "vulnerabilities", "cryptography" can trigger false positives).
export function getGeminiModel(modelName = 'gemini-1.5-flash'): GenerativeModel {
  return genAI.getGenerativeModel({
    model: modelName,
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
    ],
  })
}

// Wrap all Gemini calls in this to handle content filter errors gracefully.
export async function safeGenerate(
  model: GenerativeModel,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prompt: string | any,
  fallback = "I wasn't able to generate a response for that question. Try rephrasing it."
): Promise<string> {
  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    if (!text || text.trim() === '') return fallback
    return text
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    const status = (error as { status?: number })?.status

    if (
      status === 400 ||
      msg.includes('400') ||
      msg.includes('content filtering') ||
      msg.includes('SAFETY') ||
      msg.includes('blocked')
    ) {
      console.warn('Gemini safety filter triggered:', msg)
      return fallback
    }
    if (status === 429 || msg.includes('429')) {
      return 'The AI is receiving too many requests right now. Please wait a moment and try again.'
    }
    throw error
  }
}

// Use for any prompt that expects a JSON response.
// Strips markdown code fences that Gemini sometimes adds and parses cleanly.
export async function safeGenerateJSON<T>(
  model: GenerativeModel,
  prompt: string,
  fallback: T
): Promise<T> {
  try {
    const raw = await safeGenerate(model, prompt, '')
    if (!raw) return fallback
    const clean = raw
      .replace(/^```json\s*/im, '')
      .replace(/^```\s*/im, '')
      .replace(/\s*```\s*$/im, '')
      .trim()
    return JSON.parse(clean) as T
  } catch {
    console.warn('Gemini JSON parse failed — using fallback')
    return fallback
  }
}
