import { getGeminiModel, safeGenerate, safeGenerateJSON } from './gemini-safety'

// ============================================================
// Existing feature types (unchanged)
// ============================================================

export type ExplainStyle = 'beginner' | 'technical' | 'code' | 'whitepaper'

export type QuizQuestion = {
  question: string
  options: string[]
  correct: string
  explanation: string
}

export type DefinitionCheck = {
  score: number
  accurate: boolean
  clear: boolean
  feedback: string
}

export type LearningTopic = {
  topic: string
  description: string
  category: string
}

// ============================================================
// New RAG feature types
// ============================================================

export type DiagnosticResult = {
  background: 'cs' | 'finance' | 'design' | 'other'
  prior_knowledge: 'none' | 'beginner' | 'intermediate' | 'advanced'
  interest_area: 'defi' | 'nft' | 'development' | 'investing'
  readiness: Record<string, number>
  recommended_start: string
}

export type LessonNode = {
  id: string
  title: string
  description: string
  tier: 1 | 2 | 3 | 4
  target_whitepaper: string
  estimated_minutes: number
  key_concept: string
}

export type LessonContent = {
  explanation: string
  whitepaper_quote: string
  whitepaper_section: string
  quick_check: QuizQuestion
}

// ============================================================
// Existing functions — updated to use safety wrappers
// ============================================================

export async function explainTerm(
  term: string,
  definition: string,
  style: ExplainStyle = 'beginner'
): Promise<string> {
  const model = getGeminiModel()

  const styleMap: Record<string, string> = {
    beginner:
      'Explain this concept for someone completely new to blockchain. Use simple analogies and avoid jargon.',
    technical:
      'Give a precise technical explanation using correct terminology for a developer audience.',
    code: 'Explain this concept and include a short code example (pseudocode or Solidity) showing how it works.',
    whitepaper: '', // handled separately via RAG pipeline
  }

  const prompt = `You are a friendly Web3 educator on an educational learning platform for students.
Term: "${term}"
Definition: "${definition}"
Task: ${styleMap[style] || styleMap.beginner}
Keep your response under 150 words. Be clear, engaging, and educational.
Return only the explanation text.`

  return safeGenerate(
    model,
    prompt,
    `${term} is an important blockchain concept. Try the "Technical" or "With Code" explanation styles for more detail.`
  )
}

export async function generateQuiz(
  term: string,
  definition: string
): Promise<QuizQuestion[]> {
  const model = getGeminiModel()

  const prompt = `You are an educational assessment tool for a blockchain learning platform.
Generate 3 multiple choice questions to test a student's understanding of this blockchain concept.
Term: "${term}"
Definition: "${definition}"
Return ONLY valid JSON with no markdown or backticks.
Format: [{ "question": "...", "options": ["a) ...", "b) ...", "c) ...", "d) ..."], "correct": "a", "explanation": "..." }]`

  return safeGenerateJSON<QuizQuestion[]>(model, prompt, [
    {
      question: `What best describes ${term}?`,
      options: [
        'a) ' + definition.substring(0, 60) + '...',
        'b) A type of wallet address',
        'c) A consensus mechanism',
        'd) A layer 2 scaling solution',
      ],
      correct: 'a',
      explanation: definition,
    },
  ])
}

export async function checkDefinition(
  term: string,
  definition: string
): Promise<DefinitionCheck> {
  const model = getGeminiModel()

  const prompt = `You are an educational review tool for a student-contributed blockchain glossary.
Review this student-submitted definition for educational accuracy and clarity.
Term: "${term}"
Student definition: "${definition}"
Return ONLY valid JSON with no markdown or backticks.
Format: { "score": 0-100, "accurate": true/false, "clear": true/false, "feedback": "one encouraging sentence with a specific suggestion" }`

  return safeGenerateJSON<DefinitionCheck>(model, prompt, {
    score: 70,
    accurate: true,
    clear: true,
    feedback:
      'Good start! Consider adding more detail about how this concept is used in practice.',
  })
}

export async function generateLearningPath(
  interests: string,
  viewedTerms: string[]
): Promise<LearningTopic[]> {
  const model = getGeminiModel()

  const prompt = `You are a curriculum designer for a blockchain education platform for students.
Create a structured 10-topic learning roadmap for a student interested in Web3.
Interest area: ${interests}
Concepts already studied: ${viewedTerms.join(', ') || 'none yet'}
Return ONLY valid JSON with no markdown or backticks.
Format: [{ "topic": "...", "description": "One sentence: what the student will learn.", "category": "..." }]
Generate exactly 10 topics in order from foundational to advanced.`

  return safeGenerateJSON<LearningTopic[]>(model, prompt, [
    {
      topic: 'Introduction to Blockchain',
      description: 'Understand how distributed ledgers work.',
      category: 'Foundations',
    },
  ])
}

// ============================================================
// New RAG-powered functions
// ============================================================

// Called per turn of the 3-4 message diagnostic conversation.
// Maintains conversation history as a plain formatted string.
export async function runDiagnosticTurn(
  conversationHistory: { role: 'user' | 'ai'; text: string }[]
): Promise<{ text: string; done: boolean; diagnostic?: DiagnosticResult }> {
  const model = getGeminiModel()

  const historyText = conversationHistory
    .map((m) => `${m.role === 'user' ? 'Student' : 'Advisor'}: ${m.text}`)
    .join('\n')

  const prompt = `You are a friendly learning advisor for Web3Minds, a blockchain education platform for students.
Your goal: have a short 3-4 message conversation to understand the student's background and goals.
Ask ONE question at a time. Be warm, encouraging, and brief.

After 3-4 exchanges when you have enough information, respond with ONLY a JSON object — no other text.
JSON format (all fields required):
{"done":true,"data":{"background":"cs|finance|design|other","prior_knowledge":"none|beginner|intermediate|advanced","interest_area":"defi|nft|development|investing","readiness":{"bitcoin_wp":0.0,"ethereum_wp":0.0,"defi_wp":0.0},"recommended_start":"lesson-id"}}

Until you have enough info, respond with just your next question (plain text, not JSON).

Conversation so far:
${historyText}

Your response:`

  const raw = await safeGenerate(
    model,
    prompt,
    'Great! What is your main interest in blockchain — building applications, understanding DeFi, investing, or general curiosity?'
  )

  // Detect if the response is the final JSON
  const trimmed = raw.trim()
  if (trimmed.startsWith('{') && trimmed.includes('"done":true')) {
    try {
      const clean = trimmed
        .replace(/^```json\s*/im, '')
        .replace(/\s*```\s*$/im, '')
        .trim()
      const parsed = JSON.parse(clean)
      if (parsed.done && parsed.data) {
        return { text: '', done: true, diagnostic: parsed.data as DiagnosticResult }
      }
    } catch {
      // fall through to text response
    }
  }

  return { text: trimmed, done: false }
}

export async function generatePersonalizedPath(
  diagnostic: DiagnosticResult
): Promise<LessonNode[]> {
  const model = getGeminiModel()

  const prompt = `You are a curriculum designer for Web3Minds, a blockchain education platform for students.
Create a personalized learning path for this student.

Student profile:
- Academic background: ${diagnostic.background}
- Prior blockchain knowledge: ${diagnostic.prior_knowledge}
- Main area of interest: ${diagnostic.interest_area}
- Whitepaper readiness (0=no knowledge, 1=ready to read): ${JSON.stringify(diagnostic.readiness)}

Generate a JSON array of lesson nodes in learning order.
Return ONLY valid JSON with no markdown or backticks.
Each node:
{
  "id": "kebab-case-id",
  "title": "Short lesson title (5-7 words)",
  "description": "One sentence: what the student will understand after this lesson.",
  "tier": 1,
  "target_whitepaper": "bitcoin | ethereum | uniswap-v2 | lightning-network",
  "estimated_minutes": 8,
  "key_concept": "The single most important idea in this lesson"
}

Personalization rules:
- CS background: start with cryptographic foundations (hashing, digital signatures)
- Finance background: start with trust, intermediaries, and settlement problems
- No prior knowledge: gradual complexity, max 6 lessons per tier
- Advanced knowledge: skip basics, focus on design decisions and tradeoffs
- Always end each tier with an unlock node (id ending in "-unlock", title "Unlock [X] Whitepaper")
- Total: 20-28 lessons across tiers 1-2 (tiers 3-4 are optional extension)`

  return safeGenerateJSON<LessonNode[]>(model, prompt, getDefaultPath())
}

export async function generateLessonContent(
  lesson: LessonNode,
  whitepaperContext: { content: string; section_title: string }[],
  studentBackground: string
): Promise<LessonContent> {
  const model = getGeminiModel()

  const contextText =
    whitepaperContext.length > 0
      ? whitepaperContext
          .map((c) => `[${lesson.target_whitepaper} — ${c.section_title}]:\n${c.content}`)
          .join('\n\n')
      : `This lesson is about the ${lesson.target_whitepaper} whitepaper.`

  const prompt = `You are a blockchain educator on an educational learning platform for students.
Generate lesson content for:

Lesson title: "${lesson.title}"
Core concept to teach: "${lesson.key_concept}"
Student background: ${studentBackground}
This lesson prepares the student for the ${lesson.target_whitepaper} whitepaper.

Whitepaper context passages:
${contextText}

Return ONLY valid JSON with no markdown or backticks.
Format:
{
  "explanation": "150-200 word lesson explanation, engaging and student-friendly",
  "whitepaper_quote": "A short relevant phrase from the passages above (under 20 words)",
  "whitepaper_section": "The section name the quote is from",
  "quick_check": {
    "question": "One question based on the lesson content?",
    "options": ["a) ...", "b) ...", "c) ...", "d) ..."],
    "correct": "b",
    "explanation": "Why this answer is correct, referencing the core concept."
  }
}`

  return safeGenerateJSON<LessonContent>(model, prompt, {
    explanation: `${lesson.title} is a foundational concept in blockchain technology. ${lesson.key_concept} forms the basis of how this system works in practice. Understanding this concept is essential preparation for reading the original whitepaper.`,
    whitepaper_quote: 'See the original whitepaper for the primary source.',
    whitepaper_section: lesson.target_whitepaper,
    quick_check: {
      question: `What is the key idea behind "${lesson.key_concept}"?`,
      options: [
        'a) It enables decentralization without trust',
        'b) It speeds up transactions on-chain',
        'c) It reduces gas fees for users',
        'd) It provides smart contract execution',
      ],
      correct: 'a',
      explanation: `${lesson.key_concept} is central to understanding how this blockchain system achieves its goals.`,
    },
  })
}

export async function generateComprehensionQuestions(
  whitepaperTitle: string,
  level: 'surface' | 'structural' | 'deep' | 'mastery',
  whitepaperContext: { content: string; section_title: string }[]
): Promise<QuizQuestion[]> {
  const model = getGeminiModel()

  const levelDescriptions = {
    surface:
      'Test whether the student can identify the main problem the paper addresses and its proposed solution.',
    structural:
      'Test whether the student understands how the core mechanism works step by step.',
    deep: 'Test whether the student can identify design decisions, tradeoffs, and key assumptions.',
    mastery:
      'Test whether the student can critically evaluate the design or compare it to alternatives.',
  }

  const contextText = whitepaperContext
    .map((c) => `[${c.section_title}]:\n${c.content}`)
    .join('\n\n')

  const prompt = `You are an educational assessment designer for a blockchain learning platform.
Generate 3 comprehension questions for students studying this research paper.

Paper: "${whitepaperTitle}"
Comprehension level: ${level}
What to test: ${levelDescriptions[level]}

Base your questions on these passages from the paper:
${contextText}

Return ONLY valid JSON with no markdown or backticks.
Format: [
  {
    "question": "Question text?",
    "options": ["a) ...", "b) ...", "c) ...", "d) ..."],
    "correct": "a",
    "explanation": "Why this answer is correct, referencing the paper."
  }
]`

  return safeGenerateJSON<QuizQuestion[]>(model, prompt, [
    {
      question: `What is the main contribution of the ${whitepaperTitle}?`,
      options: [
        'a) A novel solution to a fundamental digital systems problem',
        'b) A new programming language for smart contracts',
        'c) A database storage mechanism',
        'd) A networking routing protocol',
      ],
      correct: 'a',
      explanation:
        'The paper introduces a novel approach to solving a core problem that previous systems could not address.',
    },
  ])
}

export async function reviewCapstoneSection(
  sectionName: string,
  studentText: string,
  relevantContext: { content: string; section_title: string; whitepaper_title: string }[]
): Promise<string> {
  const model = getGeminiModel()

  const contextText = relevantContext
    .map((c) => `[${c.whitepaper_title} — ${c.section_title}]:\n${c.content}`)
    .join('\n\n')

  const prompt = `You are a supportive academic mentor reviewing a student's mini-whitepaper on a blockchain learning platform.
Review this section and provide constructive, encouraging feedback.

Section being reviewed: "${sectionName}"
Student's writing: "${studentText}"

Relevant passages from real blockchain research papers for comparison:
${contextText}

Provide encouraging, specific, actionable feedback (under 120 words).
Compare the student's approach to how the original researchers framed similar ideas.
Always end with one concrete suggestion for improvement.
Return only the feedback text.`

  return safeGenerate(
    model,
    prompt,
    'Good work on this section! Consider comparing your approach to how the original authors framed this problem. Adding specific technical details and citing the whitepapers you have studied will strengthen your argument considerably.'
  )
}

// ============================================================
// Default learning path (fallback when Gemini is unavailable)
// ============================================================

function getDefaultPath(): LessonNode[] {
  return [
    { id: 'what-problem-bitcoin-solves', title: 'What Problem Does Bitcoin Solve?', description: 'Understand why digital cash needed a fundamentally new approach before Bitcoin existed.', tier: 1, target_whitepaper: 'bitcoin', estimated_minutes: 7, key_concept: 'The double-spend problem' },
    { id: 'hash-functions', title: 'Cryptographic Hash Functions', description: 'Learn how hash functions create unique digital fingerprints for any piece of data.', tier: 1, target_whitepaper: 'bitcoin', estimated_minutes: 8, key_concept: 'Deterministic one-way functions' },
    { id: 'digital-signatures', title: 'Digital Signatures Explained', description: 'Understand how public/private key pairs prove ownership without revealing secrets.', tier: 1, target_whitepaper: 'bitcoin', estimated_minutes: 6, key_concept: 'Asymmetric cryptography' },
    { id: 'blocks-and-chains', title: 'Blocks, Chains, and Linking', description: "See how chaining block hashes together makes Bitcoin's history tamper-evident.", tier: 1, target_whitepaper: 'bitcoin', estimated_minutes: 9, key_concept: 'Cryptographic chaining' },
    { id: 'proof-of-work', title: 'Proof of Work Mining', description: 'Discover how computational puzzles create consensus in a trustless network.', tier: 1, target_whitepaper: 'bitcoin', estimated_minutes: 10, key_concept: 'Computational difficulty as trust' },
    { id: 'bitcoin-unlock', title: 'Unlock Bitcoin Whitepaper', description: "You've completed Tier 1 foundations — you're ready to read Satoshi's original paper.", tier: 1, target_whitepaper: 'bitcoin', estimated_minutes: 0, key_concept: '' },
    { id: 'turing-completeness', title: 'Turing Completeness & Smart Contracts', description: "Understand what makes Ethereum's computation model different from Bitcoin's.", tier: 2, target_whitepaper: 'ethereum', estimated_minutes: 7, key_concept: 'Programmable blockchain' },
    { id: 'evm-explained', title: 'The Ethereum Virtual Machine', description: "See how the EVM executes code identically across thousands of nodes worldwide.", tier: 2, target_whitepaper: 'ethereum', estimated_minutes: 10, key_concept: 'Distributed computation' },
    { id: 'gas-and-fees', title: 'Gas, Fees, and Incentives', description: 'Learn why Ethereum charges for computation and how this prevents abuse.', tier: 2, target_whitepaper: 'ethereum', estimated_minutes: 6, key_concept: 'Metered computation' },
    { id: 'state-transitions', title: 'State Transitions and Accounts', description: "Understand Ethereum's account model and how state changes with each transaction.", tier: 2, target_whitepaper: 'ethereum', estimated_minutes: 8, key_concept: 'Global state machine' },
    { id: 'ethereum-unlock', title: 'Unlock Ethereum Whitepaper', description: "You've completed Tier 2 — you're ready to read Vitalik's original vision.", tier: 2, target_whitepaper: 'ethereum', estimated_minutes: 0, key_concept: '' },
  ]
}
