import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ''

function getModel() {
  const genAI = new GoogleGenerativeAI(apiKey)
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
}

export type ExplainStyle = 'beginner' | 'technical' | 'code'

export async function explainTerm(
  term: string,
  definition: string,
  style: ExplainStyle = 'beginner'
): Promise<string> {
  const styleMap = {
    beginner: "Explain like I'm completely new to crypto, use simple analogies, no jargon",
    technical: 'Give a technical explanation with precise terminology for a developer',
    code: 'Explain with a short code example showing how this works in practice',
  }
  const prompt = `You are a friendly Web3 educator for students.
Term: "${term}"
Definition: "${definition}"
Task: ${styleMap[style]}
Keep your response under 150 words. Be clear, engaging, and educational.`

  const result = await getModel().generateContent(prompt)
  return result.response.text()
}

export type QuizQuestion = {
  question: string
  options: string[]
  correct: string
  explanation: string
}

export async function generateQuiz(
  term: string,
  definition: string
): Promise<QuizQuestion[]> {
  const prompt = `Generate 3 multiple choice questions to test understanding of this Web3 term.
Term: "${term}"
Definition: "${definition}"
Return ONLY a valid JSON array with no markdown, no code blocks: [{ "question": "...", "options": ["a","b","c","d"], "correct": "a", "explanation": "..." }]`

  const result = await getModel().generateContent(prompt)
  const text = result.response.text().trim()
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return JSON.parse(cleaned)
}

export type DefinitionCheck = {
  score: number
  accurate: boolean
  clear: boolean
  feedback: string
}

export async function checkDefinition(
  term: string,
  definition: string
): Promise<DefinitionCheck> {
  const prompt = `Review this student-submitted Web3 definition for accuracy and clarity.
Term: "${term}"
Definition: "${definition}"
Return ONLY valid JSON with no markdown: { "score": 0-100, "accurate": true/false, "clear": true/false, "feedback": "one sentence" }`

  const result = await getModel().generateContent(prompt)
  const text = result.response.text().trim()
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return JSON.parse(cleaned)
}

export type LearningTopic = {
  topic: string
  description: string
  category: string
}

export async function generateLearningPath(
  interests: string,
  viewedTerms: string[]
): Promise<LearningTopic[]> {
  const prompt = `Create a structured learning path for a Web3 student.
Interest area: ${interests}
Terms already viewed: ${viewedTerms.join(', ') || 'none yet'}
Return ONLY a JSON array of 10 topics in order of complexity with no markdown: [{ "topic": "...", "description": "...", "category": "..." }]`

  const result = await getModel().generateContent(prompt)
  const text = result.response.text().trim()
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return JSON.parse(cleaned)
}
