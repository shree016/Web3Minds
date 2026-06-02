import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, BookOpen, CheckCircle, Loader, AlertCircle } from 'lucide-react'
import { generateLessonContent, type LessonNode, type LessonContent } from '../../lib/gemini'
import { tierColors } from '../../lib/seedWhitepapers'

interface Props {
  lesson: LessonNode
  onClose: () => void
  onComplete: (lessonId: string) => void
  studentBackground?: string
}

const FALLBACK_CONTENT = (lesson: LessonNode): LessonContent => ({
  explanation: `${lesson.title} is a key concept in blockchain technology. ${lesson.description} Understanding this concept builds the foundation needed to read the original ${lesson.target_whitepaper} whitepaper.`,
  whitepaper_quote: '',
  whitepaper_section: '',
  quick_check: {
    question: `What is the core idea behind "${lesson.key_concept}"?`,
    options: [
      'a) It enables trustless peer-to-peer transactions',
      'b) It speeds up on-chain computations',
      'c) It reduces smart contract fees',
      'd) It stores data in a central database',
    ],
    correct: 'a',
    explanation: `${lesson.key_concept} is fundamental to how blockchain systems achieve their core goals without requiring a trusted third party.`,
  },
})

export default function LessonModal({ lesson, onClose, onComplete, studentBackground = 'general student' }: Props) {
  const [content, setContent] = useState<LessonContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    loadContent()
  }, [lesson.id])

  async function loadContent() {
    setLoading(true)
    setError('')
    setSelectedAnswer('')
    setSubmitted(false)
    try {
      const c = await generateLessonContent(lesson, [], studentBackground)
      setContent(c)
    } catch {
      setContent(FALLBACK_CONTENT(lesson))
    } finally {
      setLoading(false)
    }
  }

  const isCorrect = submitted && selectedAnswer === content?.quick_check.correct
  const tier = tierColors[lesson.tier]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        className="relative glass-card rounded-2xl p-6 max-w-lg w-full z-10 max-h-[90vh] overflow-y-auto border border-purple-500/20"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
        >
          <X size={15} />
        </button>

        {/* Header */}
        <div className="mb-5 pr-8">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${tier.text} ${tier.bg} ${tier.border}`}>
              Tier {lesson.tier}
            </span>
            {lesson.estimated_minutes > 0 && (
              <span className="text-xs text-gray-600">{lesson.estimated_minutes} min</span>
            )}
          </div>
          <h2 className="text-xl font-bold text-white leading-snug">{lesson.title}</h2>
          <p className="text-xs text-gray-500 mt-1">
            Prepares you for the {lesson.target_whitepaper} whitepaper
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 gap-3 text-gray-500">
            <Loader size={20} className="animate-spin text-purple-400" />
            <span className="text-sm">Generating lesson content…</span>
          </div>
        ) : error ? (
          <div className="flex items-start gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
            {error}
          </div>
        ) : content ? (
          <div className="space-y-5">
            {/* Explanation */}
            <p className="text-sm text-gray-300 leading-relaxed">{content.explanation}</p>

            {/* Whitepaper quote */}
            {content.whitepaper_quote && content.whitepaper_quote.length > 10 && (
              <div className="bg-purple-600/10 border border-purple-500/20 rounded-xl p-4">
                <p className="text-xs font-semibold text-purple-400 mb-2 flex items-center gap-1.5">
                  <BookOpen size={11} />
                  From the {lesson.target_whitepaper} whitepaper
                </p>
                <p className="text-sm text-gray-300 italic leading-relaxed">
                  "{content.whitepaper_quote}"
                </p>
                {content.whitepaper_section && (
                  <p className="text-xs text-gray-600 mt-1.5">— {content.whitepaper_section}</p>
                )}
              </div>
            )}

            {/* Quick check */}
            <div className="bg-white/3 border border-white/8 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Quick Check
              </p>
              <p className="text-sm text-white mb-3">{content.quick_check.question}</p>

              <div className="space-y-2">
                {content.quick_check.options.map((opt, i) => {
                  const letter = String.fromCharCode(97 + i)
                  const isSelected = selectedAnswer === letter
                  const isCorrectOpt = content.quick_check.correct === letter

                  let style = 'border-white/10 text-gray-400 hover:border-purple-500/30 hover:text-gray-200'
                  if (submitted) {
                    if (isCorrectOpt)
                      style = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                    else if (isSelected && !isCorrect)
                      style = 'border-red-500/50 bg-red-500/10 text-red-300'
                    else
                      style = 'border-white/5 text-gray-600'
                  } else if (isSelected) {
                    style = 'border-purple-500/50 bg-purple-500/10 text-purple-200'
                  }

                  return (
                    <button
                      key={i}
                      disabled={submitted}
                      onClick={() => !submitted && setSelectedAnswer(letter)}
                      className={`w-full flex items-center gap-2 p-3 rounded-lg border text-xs text-left transition-all ${style}`}
                    >
                      <span className="font-mono font-bold opacity-50">{letter.toUpperCase()}.</span>
                      {opt.replace(/^[a-d]\)\s*/i, '')}
                    </button>
                  )
                })}
              </div>

              {!submitted && selectedAnswer && (
                <button
                  onClick={() => setSubmitted(true)}
                  className="mt-3 btn-secondary text-xs"
                >
                  Check Answer
                </button>
              )}

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3"
                >
                  <p className={`text-xs font-semibold ${isCorrect ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {isCorrect ? '✓ Correct!' : '✗ Not quite — see explanation below'}
                  </p>
                  {content.quick_check.explanation && (
                    <p className="text-xs text-gray-500 mt-2 bg-white/3 rounded-lg p-3 border border-white/5 leading-relaxed">
                      💡 {content.quick_check.explanation}
                    </p>
                  )}
                </motion.div>
              )}
            </div>

            {/* Mark complete */}
            <button
              onClick={() => onComplete(lesson.id)}
              className="btn-primary w-full justify-center"
            >
              <CheckCircle size={14} />
              Mark Complete →
            </button>
          </div>
        ) : null}
      </motion.div>
    </div>
  )
}
