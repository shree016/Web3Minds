import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, ThumbsUp, ThumbsDown, Brain, Zap,
  BookOpen, ChevronRight, AlertCircle, Check, X
} from 'lucide-react'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/ui/Footer'
import { seedTerms } from '../lib/seedData'
import { explainTerm, generateQuiz, type ExplainStyle, type QuizQuestion } from '../lib/gemini'

const categoryColors: Record<string, string> = {
  'Core Concepts': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  'DeFi': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  'NFTs': 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  'Layer 2': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'DAOs': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'Wallets': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  'Staking': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  'Security': 'text-green-400 bg-green-500/10 border-green-500/20',
}

function getCategoryColor(cat: string) {
  return categoryColors[cat] || 'text-gray-400 bg-gray-500/10 border-gray-500/20'
}

const AI_LIMIT = 5
const STORAGE_KEY = 'w3m_ai_usage'

function getAIUsageToday(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return 0
    const { date, count } = JSON.parse(raw)
    if (date !== new Date().toISOString().split('T')[0]) return 0
    return count
  } catch { return 0 }
}

function incrementAIUsage() {
  const today = new Date().toISOString().split('T')[0]
  const count = getAIUsageToday() + 1
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count }))
}

export default function TermDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const term = seedTerms.find((t) => t.slug === slug)

  // AI Explainer state
  const [explainStyle, setExplainStyle] = useState<ExplainStyle>('beginner')
  const [aiResponse, setAiResponse] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const [aiUsed, setAiUsed] = useState(getAIUsageToday)

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [quizLoading, setQuizLoading] = useState(false)
  const [quizError, setQuizError] = useState('')
  const [quizStarted, setQuizStarted] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  // Votes
  const [votes, setVotes] = useState({ up: term?.upvotes ?? 0, down: term?.downvotes ?? 0 })
  const [voted, setVoted] = useState<'up' | 'down' | null>(null)

  useEffect(() => {
    if (!term) return
    // Track view
    const viewed = JSON.parse(localStorage.getItem('w3m_viewed') || '[]') as string[]
    if (!viewed.includes(term.name)) {
      localStorage.setItem('w3m_viewed', JSON.stringify([...viewed, term.name]))
    }
  }, [term])

  if (!term) {
    return (
      <div className="min-h-screen bg-mesh flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="text-6xl">🔍</div>
          <h1 className="text-2xl font-bold text-white">Term not found</h1>
          <p className="text-gray-400">The term "{slug}" doesn't exist in our glossary yet.</p>
          <div className="flex gap-3 mt-4">
            <Link to="/glossary" className="btn-secondary text-sm">← Back to Glossary</Link>
            <Link to="/submit" className="btn-primary text-sm">Submit this term</Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const relatedTerms = seedTerms
    .filter((t) => t.slug !== term.slug && t.category === term.category)
    .slice(0, 5)

  async function handleExplain() {
    if (aiUsed >= AI_LIMIT) {
      setAiError(`You've used all ${AI_LIMIT} free AI questions for today. Upgrade to Pro for unlimited access.`)
      return
    }
    setAiLoading(true)
    setAiResponse('')
    setAiError('')
    try {
      const text = await explainTerm(term.name, term.short_definition, explainStyle)
      setAiResponse(text)
      incrementAIUsage()
      setAiUsed(getAIUsageToday())
    } catch (e) {
      setAiError('AI explanation failed. Please check your Gemini API key in .env and try again.')
    } finally {
      setAiLoading(false)
    }
  }

  async function handleStartQuiz() {
    setQuizLoading(true)
    setQuizError('')
    setQuizStarted(true)
    setQuizSubmitted(false)
    setSelectedAnswers({})
    try {
      const qs = await generateQuiz(term.name, term.short_definition)
      setQuizQuestions(qs)
    } catch {
      setQuizError('Failed to generate quiz. Please try again.')
    } finally {
      setQuizLoading(false)
    }
  }

  function handleVote(type: 'up' | 'down') {
    if (voted === type) return
    setVotes((v) => ({
      up: type === 'up' ? v.up + 1 : voted === 'up' ? v.up - 1 : v.up,
      down: type === 'down' ? v.down + 1 : voted === 'down' ? v.down - 1 : v.down,
    }))
    setVoted(type)
  }

  const quizScore = quizSubmitted
    ? quizQuestions.filter((q, i) => selectedAnswers[i] === q.correct).length
    : 0

  return (
    <div className="min-h-screen bg-mesh">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 pt-28 pb-24">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 mb-8 transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Glossary
        </button>

        {/* Term Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full border mb-4 ${getCategoryColor(term.category)}`}>
            {term.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{term.name}</h1>
          <p className="text-xl text-gray-300 leading-relaxed mb-8">{term.short_definition}</p>

          {/* Vote bar */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => handleVote('up')}
              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-all ${
                voted === 'up'
                  ? 'bg-purple-600/20 border-purple-500/40 text-purple-300'
                  : 'border-white/10 text-gray-400 hover:border-purple-500/30 hover:text-purple-400'
              }`}
            >
              <ThumbsUp size={14} /> {votes.up}
            </button>
            <button
              onClick={() => handleVote('down')}
              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-all ${
                voted === 'down'
                  ? 'bg-red-600/20 border-red-500/40 text-red-300'
                  : 'border-white/10 text-gray-400 hover:border-red-500/30 hover:text-red-400'
              }`}
            >
              <ThumbsDown size={14} /> {votes.down}
            </button>
          </div>
        </motion.div>

        {/* Full Definition */}
        {term.full_definition && (
          <motion.div
            className="glass-card rounded-2xl p-6 mb-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-purple-400" /> Full Definition
            </h2>
            <p className="text-gray-300 leading-relaxed text-sm">{term.full_definition}</p>
          </motion.div>
        )}

        {/* ===== AI EXPLAINER ===== */}
        <motion.div
          className="glass-card rounded-2xl p-6 mb-8 border border-purple-500/20"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
                <Zap size={13} className="text-white" />
              </div>
              Ask AI to explain this
            </h2>
            <span className="text-xs text-gray-500">{AI_LIMIT - aiUsed}/{AI_LIMIT} free today</span>
          </div>

          <p className="text-sm text-gray-400 mb-3">How would you like it explained?</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {([
              { value: 'beginner', label: "Like I'm 5" },
              { value: 'technical', label: 'Technical' },
              { value: 'code', label: 'With code' },
            ] as { value: ExplainStyle; label: string }[]).map((s) => (
              <button
                key={s.value}
                onClick={() => setExplainStyle(s.value)}
                className={`category-pill ${explainStyle === s.value ? 'active' : ''}`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleExplain}
            disabled={aiLoading || aiUsed >= AI_LIMIT}
            className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            <Brain size={14} />
            {aiLoading ? 'Generating...' : 'Explain with AI →'}
          </button>

          {aiLoading && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="ml-1">Gemini is thinking...</span>
            </div>
          )}

          <AnimatePresence>
            {aiResponse && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-purple-600/10 border border-purple-500/20 rounded-xl p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap size={10} className="text-white" />
                  </div>
                  <p className="text-sm text-gray-200 leading-relaxed">{aiResponse}</p>
                </div>
              </motion.div>
            )}
            {aiError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-2"
              >
                <AlertCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-300">{aiError}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ===== AI QUIZ ===== */}
        <motion.div
          className="glass-card rounded-2xl p-6 mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <BookOpen size={18} className="text-cyan-400" /> Test Your Knowledge
          </h2>
          <p className="text-sm text-gray-400 mb-5">
            AI-generated quiz on <span className="text-white font-medium">{term.name}</span>
          </p>

          {!quizStarted ? (
            <button onClick={handleStartQuiz} className="btn-secondary text-sm">
              Start Quiz →
            </button>
          ) : quizLoading ? (
            <div className="flex items-center gap-2 text-sm text-gray-500 py-4">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="ml-1">Generating questions...</span>
            </div>
          ) : quizError ? (
            <div className="flex items-center gap-2 text-sm text-red-300">
              <AlertCircle size={14} />
              {quizError}
            </div>
          ) : (
            <div className="space-y-6">
              {quizSubmitted && (
                <div className={`flex items-center gap-3 p-4 rounded-xl border ${
                  quizScore === quizQuestions.length
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : quizScore >= quizQuestions.length / 2
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-red-500/10 border-red-500/30 text-red-300'
                }`}>
                  <span className="text-2xl">{quizScore === quizQuestions.length ? '🎉' : quizScore >= 1 ? '👍' : '📖'}</span>
                  <div>
                    <div className="font-bold">Score: {quizScore}/{quizQuestions.length}</div>
                    <div className="text-xs opacity-80">
                      {quizScore === quizQuestions.length ? 'Perfect score!' : 'Keep studying!'}
                    </div>
                  </div>
                  <button onClick={handleStartQuiz} className="ml-auto text-xs underline opacity-70 hover:opacity-100">
                    Retry
                  </button>
                </div>
              )}

              {quizQuestions.map((q, qi) => {
                const answered = selectedAnswers[qi]
                const isCorrect = answered === q.correct

                return (
                  <div key={qi} className="space-y-3">
                    <p className="text-sm font-semibold text-white">
                      {qi + 1}. {q.question}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, oi) => {
                        const letter = String.fromCharCode(97 + oi)
                        const isSelected = answered === letter
                        const isCorrectOpt = q.correct === letter

                        let style = 'border-white/10 text-gray-400 hover:border-purple-500/30'
                        if (quizSubmitted) {
                          if (isCorrectOpt) style = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                          else if (isSelected && !isCorrect) style = 'border-red-500/50 bg-red-500/10 text-red-300'
                        } else if (isSelected) {
                          style = 'border-purple-500/50 bg-purple-500/10 text-purple-300'
                        }

                        return (
                          <button
                            key={oi}
                            disabled={quizSubmitted}
                            onClick={() => !quizSubmitted && setSelectedAnswers((p) => ({ ...p, [qi]: letter }))}
                            className={`flex items-center gap-2 p-3 rounded-lg border text-xs text-left transition-all ${style}`}
                          >
                            <span className="font-mono font-bold opacity-60">{letter.toUpperCase()}.</span>
                            {opt}
                            {quizSubmitted && isCorrectOpt && <Check size={12} className="ml-auto text-emerald-400" />}
                            {quizSubmitted && isSelected && !isCorrect && <X size={12} className="ml-auto text-red-400" />}
                          </button>
                        )
                      })}
                    </div>
                    {quizSubmitted && q.explanation && (
                      <p className="text-xs text-gray-500 bg-white/3 rounded-lg p-3 border border-white/5">
                        💡 {q.explanation}
                      </p>
                    )}
                  </div>
                )
              })}

              {!quizSubmitted && quizQuestions.length > 0 && (
                <button
                  onClick={() => setQuizSubmitted(true)}
                  disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
                  className="btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Submit Answers
                </button>
              )}
            </div>
          )}
        </motion.div>

        {/* Related Terms */}
        {relatedTerms.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <h2 className="text-lg font-bold text-white mb-4">Related Terms</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {relatedTerms.map((t) => (
                <Link key={t.slug} to={`/glossary/${t.slug}`}>
                  <div className="glass-card rounded-xl px-4 py-3 flex-shrink-0 hover:border-purple-500/40 transition-all">
                    <div className="font-semibold text-white text-sm whitespace-nowrap">{t.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                      {t.category} <ChevronRight size={10} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  )
}
