import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Zap, ExternalLink, Check, X, AlertCircle,
  BookmarkPlus, MessageSquare, Lock,
} from 'lucide-react'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/ui/Footer'
import {
  seedWhitepapers,
  tierColors,
  difficultyColors,
  getWPProgress,
  setWPProgress,
  isWhitepaperUnlocked,
} from '../lib/seedWhitepapers'
import { askWhitepaper } from '../lib/rag'
import { generateComprehensionQuestions, type QuizQuestion } from '../lib/gemini'
import { supabase } from '../lib/supabase'

const RAG_LIMIT = 5
const RAG_KEY = 'w3m_rag_usage'

function getRagUsageToday(): number {
  try {
    const raw = localStorage.getItem(RAG_KEY)
    if (!raw) return 0
    const { date, count } = JSON.parse(raw)
    if (date !== new Date().toISOString().split('T')[0]) return 0
    return count
  } catch { return 0 }
}

function incrementRagUsage() {
  const today = new Date().toISOString().split('T')[0]
  const count = getRagUsageToday() + 1
  localStorage.setItem(RAG_KEY, JSON.stringify({ date: today, count }))
}

type Chunk = { section_title?: string; content: string; chunk_index?: number }

const levelDescriptions = {
  surface: 'Identify the main problem and proposed solution',
  structural: 'Understand how the mechanism works step by step',
  deep: 'Analyse design decisions and tradeoffs',
  mastery: 'Critically evaluate and compare to alternatives',
}

const levelColors = {
  surface: 'text-gray-400 border-gray-500/30 bg-gray-500/5',
  structural: 'text-blue-400 border-blue-500/30 bg-blue-500/5',
  deep: 'text-purple-400 border-purple-500/30 bg-purple-500/5',
  mastery: 'text-amber-400 border-amber-500/30 bg-amber-500/5',
}

const levelActiveColors = {
  surface: 'border-gray-400 bg-gray-500/20 text-white',
  structural: 'border-blue-400 bg-blue-500/20 text-white',
  deep: 'border-purple-400 bg-purple-500/20 text-white',
  mastery: 'border-amber-400 bg-amber-500/20 text-white',
}

export default function WhitepaperDetail() {
  const { slug } = useParams<{ slug: string }>()
  const wp = seedWhitepapers.find((w) => w.slug === slug)

  const [chunks, setChunks] = useState<Chunk[]>([])
  const [whitepaperDbId, setWhitepaperDbId] = useState<string | null>(null)
  const [readSections, setReadSections] = useState<Set<number>>(new Set())

  // RAG Q&A panel
  const [question, setQuestion] = useState('')
  const [highlightedText, setHighlightedText] = useState('')
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [ragAnswer, setRagAnswer] = useState('')
  const [ragSources, setRagSources] = useState<{ section: string; similarity: number }[]>([])
  const [ragLoading, setRagLoading] = useState(false)
  const [ragError, setRagError] = useState('')
  const [ragUsed, setRagUsed] = useState(getRagUsageToday)
  const [usedRAG, setUsedRAG] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)
  const questionRef = useRef<HTMLTextAreaElement>(null)

  // Comprehension quiz
  const [quizLevel, setQuizLevel] = useState<'surface' | 'structural' | 'deep' | 'mastery'>('surface')
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [quizLoading, setQuizLoading] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  useEffect(() => {
    if (!wp) return
    setChunks(
      wp.sections.map((s, i) => ({ section_title: s.title, content: s.content, chunk_index: i }))
    )
    setWPProgress(wp.slug, { last_read: new Date().toISOString() })
    fetchDBWhitepaperData()
  }, [wp?.slug])

  async function fetchDBWhitepaperData() {
    if (!slug) return
    try {
      const { data: wpRow } = await supabase
        .from('whitepapers')
        .select('id')
        .eq('slug', slug)
        .single()
      if (wpRow) setWhitepaperDbId(wpRow.id)

      // Replace demo chunks with real chunks if they exist
      const { data: dbChunks } = await supabase
        .from('whitepaper_chunks')
        .select('chunk_index, section_title, content')
        .eq('whitepaper_id', wpRow?.id)
        .order('chunk_index', { ascending: true })
      if (dbChunks && dbChunks.length > 0) setChunks(dbChunks)
    } catch {
      // Supabase not configured — use seed sections
    }
  }

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection()
    if (!selection || selection.toString().trim().length < 15) {
      setTooltipVisible(false)
      return
    }
    const text = selection.toString().trim()
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    setHighlightedText(text)
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top + window.scrollY - 48 })
    setTooltipVisible(true)
  }, [])

  function handleAskFromHighlight() {
    setQuestion(highlightedText)
    setTooltipVisible(false)
    questionRef.current?.focus()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleBookmarkHighlight() {
    const bookmarks = JSON.parse(localStorage.getItem('w3m_bookmarks') || '[]')
    bookmarks.push({ slug, text: highlightedText, date: new Date().toISOString() })
    localStorage.setItem('w3m_bookmarks', JSON.stringify(bookmarks))
    setTooltipVisible(false)
  }

  async function handleAskAI() {
    if (!question.trim() || ragLoading) return
    if (ragUsed >= RAG_LIMIT) {
      setRagError(`Daily limit reached (${RAG_LIMIT}/day on free plan). Upgrade to Pro for unlimited RAG questions.`)
      return
    }
    setRagLoading(true)
    setRagAnswer('')
    setRagSources([])
    setRagError('')
    try {
      const result = await askWhitepaper(
        question,
        whitepaperDbId ? [whitepaperDbId] : undefined
      )
      setRagAnswer(result.answer)
      setRagSources(result.sources)
      setUsedRAG(result.usedRAG)
      incrementRagUsage()
      setRagUsed(getRagUsageToday())
    } catch {
      setRagError('Failed to get an AI answer. Please check your API key configuration.')
    } finally {
      setRagLoading(false)
    }
  }

  async function handleStartQuiz() {
    setQuizLoading(true)
    setQuizStarted(true)
    setQuizSubmitted(false)
    setSelectedAnswers({})
    setQuizQuestions([])
    try {
      const context = chunks.slice(0, 4).map((c) => ({
        content: c.content,
        section_title: c.section_title || 'Section',
      }))
      const qs = await generateComprehensionQuestions(wp?.title || '', quizLevel, context)
      setQuizQuestions(qs)
    } catch {
      setQuizQuestions([])
    } finally {
      setQuizLoading(false)
    }
  }

  function handleSubmitQuiz() {
    setQuizSubmitted(true)
    const score = quizQuestions.filter((q, i) => selectedAnswers[i] === q.correct).length
    const pct = Math.round((score / quizQuestions.length) * 100)
    if (pct >= 60 && wp) {
      const levelMap = { surface: 0, structural: 1, deep: 2, mastery: 3 }
      const fieldMap = { surface: 'surface_score', structural: 'structural_score', deep: 'deep_score', mastery: 'mastery_score' } as const
      setWPProgress(wp.slug, {
        [fieldMap[quizLevel]]: pct,
        level: quizLevel,
      })
    }
  }

  if (!wp) {
    return (
      <div className="min-h-screen bg-mesh flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
          <div className="text-6xl">📄</div>
          <h1 className="text-2xl font-bold text-white">Whitepaper not found</h1>
          <p className="text-gray-400">The whitepaper "{slug}" doesn't exist in our library.</p>
          <Link to="/whitepapers" className="btn-secondary text-sm">← Back to Library</Link>
        </div>
        <Footer />
      </div>
    )
  }

  const unlocked = isWhitepaperUnlocked(wp.slug)
  const tier = tierColors[wp.tier]
  const progress = getWPProgress()[wp.slug]
  const quizScore = quizSubmitted
    ? quizQuestions.filter((q, i) => selectedAnswers[i] === q.correct).length
    : 0

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-mesh flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center px-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Lock size={28} className="text-gray-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{wp.title}</h1>
            <p className="text-gray-400 text-sm">
              Complete the Tier {wp.tier - 1} learning path lessons to unlock this whitepaper.
            </p>
          </div>
          <Link to="/learn" className="btn-primary">
            Start Learning Path <ArrowRight />
          </Link>
          <Link to="/whitepapers" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
            ← Back to library
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-mesh">
      <Navbar />

      {/* Highlight tooltip */}
      <AnimatePresence>
        {tooltipVisible && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed z-50 flex gap-1 p-1 rounded-xl bg-[#1A1C24] border border-white/10 shadow-xl"
            style={{ left: tooltipPos.x - 80, top: tooltipPos.y }}
          >
            <button
              onClick={handleAskFromHighlight}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-300 hover:bg-purple-600/20 transition-colors"
            >
              <MessageSquare size={12} /> Ask AI
            </button>
            <button
              onClick={handleBookmarkHighlight}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-400 hover:bg-white/5 transition-colors"
            >
              <BookmarkPlus size={12} /> Bookmark
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 pt-28 pb-24">
        {/* Back */}
        <Link
          to="/whitepapers"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 mb-8 transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Whitepaper Library
        </Link>

        {/* Header */}
        <motion.div
          className="glass-card rounded-2xl p-6 mb-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${tier.text} ${tier.bg} ${tier.border}`}>
              {tier.badge}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${difficultyColors[wp.difficulty]}`}>
              {wp.difficulty}
            </span>
            {progress?.level && (
              <span className="text-xs px-2 py-0.5 rounded-full border text-purple-400 bg-purple-500/10 border-purple-500/20">
                {progress.level} level
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{wp.title}</h1>
          <p className="text-gray-400 text-sm">
            {wp.author} · {wp.year}
          </p>
          <div className="flex items-center gap-3 mt-4">
            <a
              href={wp.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs flex items-center gap-1"
            >
              <ExternalLink size={12} /> Original PDF
            </a>
          </div>
        </motion.div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT — Whitepaper text */}
          <div
            ref={textRef}
            className="flex-1 min-w-0"
            onMouseUp={handleTextSelection}
          >
            <div className="space-y-4">
              {chunks.map((chunk, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`glass-card rounded-2xl p-6 transition-all cursor-text select-text ${
                    readSections.has(i) ? 'border-l-2 border-purple-500/40' : ''
                  }`}
                  onMouseEnter={() => setReadSections((prev) => new Set(prev).add(i))}
                >
                  {chunk.section_title && (
                    <h2 className="text-sm font-bold text-purple-400 mb-3 uppercase tracking-wider">
                      {chunk.section_title}
                    </h2>
                  )}
                  <p className="text-sm text-gray-300 leading-relaxed font-mono whitespace-pre-wrap">
                    {chunk.content}
                  </p>
                </motion.div>
              ))}
            </div>

            {chunks.length === 0 && (
              <div className="glass-card rounded-2xl p-10 text-center">
                <p className="text-gray-500 text-sm">
                  Whitepaper text will appear here after running the ingestion script.
                </p>
                <p className="text-gray-600 text-xs mt-2">
                  Run: <code className="font-mono">npx ts-node scripts/ingest-whitepapers.ts</code>
                </p>
              </div>
            )}
          </div>

          {/* RIGHT — AI Q&A panel (sticky) */}
          <div className="w-full lg:w-96 lg:flex-shrink-0">
            <div className="lg:sticky lg:top-20 space-y-4">
              {/* Ask widget */}
              <motion.div
                className="glass-card rounded-2xl p-5 border border-purple-500/20"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
                      <Zap size={11} className="text-white" />
                    </div>
                    Ask about this whitepaper
                  </h3>
                  <span className="text-xs text-gray-600">
                    {RAG_LIMIT - ragUsed}/{RAG_LIMIT} today
                  </span>
                </div>

                <textarea
                  ref={questionRef}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAskAI())}
                  placeholder="Highlight text above, or type your question..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-purple-500/40 transition-colors mb-3"
                />

                <button
                  onClick={handleAskAI}
                  disabled={ragLoading || !question.trim() || ragUsed >= RAG_LIMIT}
                  className="btn-primary text-sm w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {ragLoading ? (
                    <>
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="ml-2">Thinking…</span>
                    </>
                  ) : (
                    'Ask →'
                  )}
                </button>

                <AnimatePresence>
                  {ragError && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-3 flex items-start gap-2 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl p-3"
                    >
                      <AlertCircle size={13} className="mt-0.5 flex-shrink-0" />
                      {ragError}
                      {ragUsed >= RAG_LIMIT && (
                        <Link to="/pricing" className="ml-auto text-purple-400 hover:text-purple-300 underline whitespace-nowrap">
                          Upgrade →
                        </Link>
                      )}
                    </motion.div>
                  )}

                  {ragAnswer && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 space-y-3"
                    >
                      <div className="bg-purple-600/10 border border-purple-500/20 rounded-xl p-4">
                        <p className="text-sm text-gray-200 leading-relaxed">{ragAnswer}</p>
                        {!usedRAG && (
                          <p className="text-xs text-gray-600 mt-2 italic">
                            * Answer generated without whitepaper context (add VITE_HUGGINGFACE_API_KEY for full RAG)
                          </p>
                        )}
                      </div>

                      {ragSources.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-600 mb-2">Sources used:</p>
                          <div className="space-y-1.5">
                            {ragSources.map((s, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs">
                                <span className="text-purple-400 mt-0.5">•</span>
                                <div>
                                  <span className="text-gray-300">{s.section}</span>
                                  <span className="text-gray-600 ml-1">
                                    ({Math.round(s.similarity * 100)}% match)
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Reading tips */}
              <div className="glass-card rounded-2xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Tips
                </p>
                <div className="space-y-2">
                  {[
                    'Highlight any sentence and click "Ask AI" to get a grounded explanation',
                    'Read section headings first to understand the structure',
                    'Take the comprehension quiz below to test your understanding',
                  ].map((tip, i) => (
                    <p key={i} className="text-xs text-gray-500 flex items-start gap-2">
                      <span className="text-purple-400 mt-0.5">→</span>
                      {tip}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comprehension Quiz */}
        <motion.div
          className="glass-card rounded-2xl p-6 mt-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <BookmarkPlus size={18} className="text-cyan-400" />
            Test Your Understanding
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Select a comprehension level to generate questions grounded in this whitepaper.
          </p>

          {/* Level tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {(Object.entries(levelDescriptions) as [keyof typeof levelDescriptions, string][]).map(([level, desc]) => (
              <button
                key={level}
                onClick={() => { setQuizLevel(level); setQuizStarted(false); setQuizQuestions([]); setQuizSubmitted(false) }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  quizLevel === level ? levelActiveColors[level] : levelColors[level]
                }`}
              >
                <div className="text-xs font-bold capitalize mb-1">{level}</div>
                <div className="text-xs opacity-70 leading-tight">{desc}</div>
              </button>
            ))}
          </div>

          {!quizStarted ? (
            <button onClick={handleStartQuiz} className="btn-secondary text-sm">
              Start {quizLevel.charAt(0).toUpperCase() + quizLevel.slice(1)} Quiz →
            </button>
          ) : quizLoading ? (
            <div className="flex items-center gap-2 text-sm text-gray-500 py-4">
              <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
              <span className="ml-1">Generating questions from the whitepaper…</span>
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
                  <span className="text-2xl">
                    {quizScore === quizQuestions.length ? '🎉' : quizScore >= 1 ? '👍' : '📖'}
                  </span>
                  <div className="flex-1">
                    <div className="font-bold text-sm">Score: {quizScore}/{quizQuestions.length}</div>
                    <div className="text-xs opacity-80">
                      {quizScore === quizQuestions.length
                        ? 'Perfect! You have strong comprehension at this level.'
                        : 'Keep reading and try again.'}
                    </div>
                  </div>
                  <button onClick={handleStartQuiz} className="text-xs underline opacity-70 hover:opacity-100">
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
                            {opt.replace(/^[a-d]\)\s*/i, '')}
                            {quizSubmitted && isCorrectOpt && <Check size={11} className="ml-auto text-emerald-400" />}
                            {quizSubmitted && isSelected && !isCorrect && <X size={11} className="ml-auto text-red-400" />}
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
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
                  className="btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Submit Answers
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}

// Re-export ArrowRight for the locked state view
function ArrowRight() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
}
