import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader, RefreshCw } from 'lucide-react'
import LessonNode from './LessonNode'
import {
  generatePersonalizedPath,
  type LessonNode as LessonNodeType,
  type DiagnosticResult,
} from '../../lib/gemini'
import { tierColors } from '../../lib/seedWhitepapers'

interface Props {
  diagnostic: DiagnosticResult
  completedIds: string[]
  onOpenLesson: (lesson: LessonNodeType) => void
  onUnlock: (wpSlug: string) => void
}

export default function PersonalizedPath({ diagnostic, completedIds, onOpenLesson, onUnlock }: Props) {
  const [path, setPath] = useState<LessonNodeType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadPath()
  }, [])

  async function loadPath() {
    // Restore from localStorage first so the page renders instantly on revisit
    try {
      const stored = JSON.parse(localStorage.getItem('w3m_path') || '[]')
      if (Array.isArray(stored) && stored.length > 0) {
        setPath(stored)
        setLoading(false)
        return
      }
    } catch {}

    await generatePath()
  }

  async function generatePath() {
    setLoading(true)
    setError('')
    try {
      const lessons = await generatePersonalizedPath(diagnostic)
      setPath(lessons)
      localStorage.setItem('w3m_path', JSON.stringify(lessons))
    } catch {
      setError('Failed to generate your path. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-10 text-center">
        <Loader size={24} className="text-purple-400 animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-400 mb-1">Building your personalised roadmap…</p>
        <p className="text-xs text-gray-600">This takes about 5–10 seconds</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <p className="text-red-400 text-sm mb-4">{error}</p>
        <button
          onClick={generatePath}
          className="btn-secondary text-sm flex items-center gap-2 mx-auto"
        >
          <RefreshCw size={13} /> Retry
        </button>
      </div>
    )
  }

  // Group lessons by tier
  const byTier = path.reduce(
    (acc, lesson) => {
      if (!acc[lesson.tier]) acc[lesson.tier] = []
      acc[lesson.tier].push(lesson)
      return acc
    },
    {} as Record<number, LessonNodeType[]>
  )

  const tierNums = Object.keys(byTier)
    .map(Number)
    .sort((a, b) => a - b)

  const totalLessons = path.filter((l) => !l.id.endsWith('-unlock')).length
  const doneCount = path.filter((l) => !l.id.endsWith('-unlock') && completedIds.includes(l.id)).length
  const progressPct = totalLessons > 0 ? Math.round((doneCount / totalLessons) * 100) : 0

  return (
    <div>
      {/* Progress bar */}
      <div className="glass-card rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-white text-sm">Your Learning Path</h3>
          <span className="text-xs text-gray-500">
            {doneCount}/{totalLessons} lessons complete
          </span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-1.5">{progressPct}% complete</p>
      </div>

      {/* Tier sections */}
      <div className="space-y-10">
        {tierNums.map((tierNum, tierIdx) => {
          const tierLessons = byTier[tierNum]
          const regularLessons = tierLessons.filter((l) => !l.id.endsWith('-unlock'))
          const unlockLesson = tierLessons.find((l) => l.id.endsWith('-unlock'))

          // A tier is locked if the previous tier's unlock node is not done
          const prevTierUnlock = tierIdx > 0
            ? byTier[tierNums[tierIdx - 1]]?.find((l) => l.id.endsWith('-unlock'))
            : null
          const tierLocked = prevTierUnlock ? !completedIds.includes(prevTierUnlock.id) : false

          const allRegularDone = regularLessons.every((l) => completedIds.includes(l.id))
          const unlockDone = unlockLesson ? completedIds.includes(unlockLesson.id) : false

          const tc = tierColors[tierNum]

          return (
            <motion.div
              key={tierNum}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: tierIdx * 0.08 }}
            >
              {/* Tier header */}
              <div className="flex items-center gap-3 mb-5">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${tc.text} ${tc.bg} ${tc.border}`}
                >
                  {tc.badge}
                </span>
                {tierLocked && (
                  <span className="text-xs text-gray-600">
                    Complete Tier {tierNum - 1} to unlock
                  </span>
                )}
                {!tierLocked && allRegularDone && (
                  <span className="text-xs text-emerald-400">All lessons done ✓</span>
                )}
              </div>

              {/* Node timeline */}
              <div className="relative">
                <div className="absolute left-3 top-4 bottom-4 w-px bg-gradient-to-b from-purple-600/30 via-purple-500/10 to-transparent" />

                <div className="space-y-3">
                  {regularLessons.map((lesson, i) => {
                    const prevDone = i === 0 || completedIds.includes(regularLessons[i - 1].id)
                    const isCompleted = completedIds.includes(lesson.id)
                    const isCurrent = !isCompleted && !tierLocked && prevDone
                    const isLocked = tierLocked || (!isCompleted && !prevDone)

                    return (
                      <LessonNode
                        key={lesson.id}
                        lesson={lesson}
                        completed={isCompleted}
                        current={isCurrent}
                        locked={isLocked}
                        onOpen={onOpenLesson}
                      />
                    )
                  })}

                  {/* Unlock star node */}
                  {unlockLesson && (
                    <div className="mt-4">
                      <LessonNode
                        lesson={unlockLesson}
                        completed={unlockDone}
                        current={allRegularDone && !unlockDone && !tierLocked}
                        locked={!allRegularDone || tierLocked}
                        onOpen={() => onUnlock(unlockLesson.target_whitepaper)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
