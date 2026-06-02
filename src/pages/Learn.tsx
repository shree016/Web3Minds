import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, BookOpen, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/ui/Footer'
import DiagnosticChat from '../components/learn/DiagnosticChat'
import ReadinessMap from '../components/learn/ReadinessMap'
import PersonalizedPath from '../components/learn/PersonalizedPath'
import LessonModal from '../components/learn/LessonModal'
import WhitepaperUnlock from '../components/learn/WhitepaperUnlock'
import { type DiagnosticResult, type LessonNode } from '../lib/gemini'

type Phase = 'diagnostic' | 'path'

function loadDiagnostic(): DiagnosticResult | null {
  try {
    return JSON.parse(localStorage.getItem('w3m_diagnostic') || 'null')
  } catch {
    return null
  }
}

function loadCompleted(): string[] {
  try {
    return JSON.parse(localStorage.getItem('w3m_path_completed') || '[]')
  } catch {
    return []
  }
}

const BG_LABELS: Record<string, string> = {
  cs: 'Software Developer',
  finance: 'Finance Professional',
  design: 'Designer',
  other: 'General Student',
}

const KNOWLEDGE_LABELS: Record<string, string> = {
  none: 'Brand new to blockchain',
  beginner: 'Heard of Bitcoin/Ethereum',
  intermediate: 'Have used Web3 products',
  advanced: 'Deep blockchain knowledge',
}

export default function Learn() {
  const [phase, setPhase] = useState<Phase>(() => (loadDiagnostic() ? 'path' : 'diagnostic'))
  const [diagnostic, setDiagnostic] = useState<DiagnosticResult | null>(loadDiagnostic)
  const [completedIds, setCompletedIds] = useState<string[]>(loadCompleted)
  const [openLesson, setOpenLesson] = useState<LessonNode | null>(null)
  const [unlockWpSlug, setUnlockWpSlug] = useState<string | null>(null)

  function handleDiagnosticComplete(d: DiagnosticResult) {
    setDiagnostic(d)
    localStorage.setItem('w3m_diagnostic', JSON.stringify(d))
    setPhase('path')
  }

  function handleLessonComplete(lessonId: string) {
    const next = [...new Set([...completedIds, lessonId])]
    setCompletedIds(next)
    localStorage.setItem('w3m_path_completed', JSON.stringify(next))
    setOpenLesson(null)
  }

  function handleReset() {
    if (!confirm('Reset your learning path? Your progress will be cleared.')) return
    localStorage.removeItem('w3m_diagnostic')
    localStorage.removeItem('w3m_path')
    localStorage.removeItem('w3m_path_completed')
    setDiagnostic(null)
    setCompletedIds([])
    setPhase('diagnostic')
  }

  const studentBackground =
    diagnostic?.background === 'cs'
      ? 'software developer'
      : diagnostic?.background === 'finance'
      ? 'finance professional'
      : diagnostic?.background === 'design'
      ? 'designer'
      : 'general student'

  return (
    <div className="min-h-screen bg-mesh">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-10 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-purple-600/10 border border-purple-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">
              RAG-Powered Learning
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your Web3 <span className="gradient-text">Journey</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            {phase === 'diagnostic'
              ? 'Answer a few quick questions to get a learning path built specifically for you.'
              : 'Your personalised path to reading the original blockchain whitepapers.'}
          </p>
        </motion.div>
      </section>

      <div className="px-4 pb-24 max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {phase === 'diagnostic' ? (
            <motion.div
              key="diagnostic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="max-w-2xl mx-auto"
            >
              <p className="text-center text-sm text-gray-600 mb-6">
                Takes about 2 minutes · Personalises your entire learning path · Can skip any time
              </p>
              <DiagnosticChat onComplete={handleDiagnosticComplete} />

              {/* Manual interest selector fallback */}
              <div className="mt-8">
                <p className="text-center text-xs text-gray-600 mb-4">
                  Or jump straight in with a preset path:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'development', label: 'Builder', emoji: '⚙️', bg: 'finance' as const },
                    { id: 'defi', label: 'DeFi', emoji: '💰', bg: 'other' as const },
                    { id: 'nft', label: 'NFTs', emoji: '🎨', bg: 'design' as const },
                    { id: 'investing', label: 'Investing', emoji: '📈', bg: 'finance' as const },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() =>
                        handleDiagnosticComplete({
                          background: preset.bg,
                          prior_knowledge: 'beginner',
                          interest_area: preset.id as DiagnosticResult['interest_area'],
                          readiness: { bitcoin_wp: 0.15, ethereum_wp: 0.05, defi_wp: 0.0 },
                          recommended_start: 'what-problem-bitcoin-solves',
                        })
                      }
                      className="glass-card rounded-xl p-4 text-center hover:border-purple-500/30 transition-all"
                    >
                      <div className="text-2xl mb-1">{preset.emoji}</div>
                      <div className="text-xs font-semibold text-white">{preset.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="path"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Top info row */}
              {diagnostic && (
                <div className="grid md:grid-cols-3 gap-5">
                  {/* Readiness map */}
                  <div className="md:col-span-2">
                    <ReadinessMap readiness={diagnostic.readiness} />
                  </div>

                  {/* Profile card */}
                  <div className="glass-card rounded-2xl p-5 flex flex-col gap-4">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <BookOpen size={15} className="text-purple-400" />
                      Your Profile
                    </h3>
                    <div className="space-y-2 flex-1">
                      {[
                        ['Background', BG_LABELS[diagnostic.background] ?? diagnostic.background],
                        ['Knowledge', KNOWLEDGE_LABELS[diagnostic.prior_knowledge] ?? diagnostic.prior_knowledge],
                        ['Focus area', diagnostic.interest_area],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-start justify-between gap-2 text-xs">
                          <span className="text-gray-500 flex-shrink-0">{label}</span>
                          <span className="text-gray-300 capitalize text-right">{value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-2 pt-3 border-t border-white/5">
                      <Link
                        to="/whitepapers"
                        className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                      >
                        View whitepaper library <ArrowRight size={11} />
                      </Link>
                      <button
                        onClick={handleReset}
                        className="text-xs text-gray-600 hover:text-gray-400 flex items-center gap-1 transition-colors"
                      >
                        <RotateCcw size={11} /> Restart diagnostic
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Personalized path */}
              {diagnostic && (
                <PersonalizedPath
                  diagnostic={diagnostic}
                  completedIds={completedIds}
                  onOpenLesson={setOpenLesson}
                  onUnlock={setUnlockWpSlug}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {openLesson && (
          <LessonModal
            key={openLesson.id}
            lesson={openLesson}
            onClose={() => setOpenLesson(null)}
            onComplete={handleLessonComplete}
            studentBackground={studentBackground}
          />
        )}
        {unlockWpSlug && (
          <WhitepaperUnlock
            key={unlockWpSlug}
            wpSlug={unlockWpSlug}
            onClose={() => setUnlockWpSlug(null)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
