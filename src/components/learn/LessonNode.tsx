import { motion } from 'framer-motion'
import { CheckCircle, Circle, Star, Lock } from 'lucide-react'
import type { LessonNode as LessonNodeType } from '../../lib/gemini'

interface Props {
  lesson: LessonNodeType
  completed: boolean
  current: boolean
  locked: boolean
  onOpen: (lesson: LessonNodeType) => void
}

export default function LessonNode({ lesson, completed, current, locked, onOpen }: Props) {
  const isUnlock = lesson.id.endsWith('-unlock')

  if (isUnlock) {
    return (
      <motion.button
        whileHover={!locked && !completed ? { scale: 1.01 } : {}}
        onClick={() => !locked && onOpen(lesson)}
        disabled={locked}
        className={`w-full rounded-xl p-4 flex items-center gap-4 transition-all border text-left ${
          completed
            ? 'border-amber-500/40 bg-amber-500/5'
            : locked
            ? 'opacity-40 cursor-not-allowed border-white/5 bg-white/2'
            : 'border-amber-500/20 bg-amber-500/5 hover:border-amber-500/40 cursor-pointer shadow-[0_0_16px_rgba(245,158,11,0.08)]'
        }`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            completed ? 'bg-amber-500/30' : locked ? 'bg-white/5' : 'bg-amber-500/20'
          }`}
        >
          {completed ? (
            <CheckCircle size={16} className="text-amber-400" />
          ) : locked ? (
            <Lock size={13} className="text-gray-600" />
          ) : (
            <Star size={15} className="text-amber-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-bold ${
              completed ? 'text-amber-400' : locked ? 'text-gray-600' : 'text-amber-300'
            }`}
          >
            {lesson.title}
          </p>
          <p className="text-xs text-gray-600 mt-0.5">
            {completed
              ? 'Whitepaper unlocked!'
              : locked
              ? 'Complete all lessons above to unlock'
              : 'Click to unlock this whitepaper'}
          </p>
        </div>
      </motion.button>
    )
  }

  return (
    <div className="flex items-start gap-3">
      {/* Timeline dot */}
      <div className="relative flex-shrink-0 mt-3.5">
        <button
          onClick={() => !locked && onOpen(lesson)}
          disabled={locked}
          style={
            current
              ? { boxShadow: '0 0 0 4px rgba(124,58,237,0.2), 0 0 12px rgba(124,58,237,0.5)' }
              : undefined
          }
          className={`w-7 h-7 rounded-full flex items-center justify-center border-2 bg-[#0A0B0F] transition-all ${
            completed
              ? 'border-purple-500 cursor-default'
              : current
              ? 'border-purple-400 cursor-pointer'
              : locked
              ? 'border-white/10 cursor-not-allowed'
              : 'border-white/20 hover:border-purple-500/60 cursor-pointer'
          }`}
        >
          {completed ? (
            <CheckCircle size={14} className="text-purple-400" />
          ) : locked ? (
            <Circle size={12} className="text-gray-700" />
          ) : (
            <Circle size={12} className={current ? 'text-purple-400' : 'text-gray-500'} />
          )}
        </button>
      </div>

      {/* Card */}
      <button
        onClick={() => !locked && onOpen(lesson)}
        disabled={locked}
        className={`flex-1 min-w-0 rounded-xl p-4 text-left border transition-all ${
          completed
            ? 'opacity-60 border-white/5 bg-white/2 cursor-default'
            : locked
            ? 'opacity-30 cursor-not-allowed border-white/5 bg-white/2'
            : current
            ? 'border-purple-500/30 bg-purple-600/5 hover:border-purple-500/50 cursor-pointer'
            : 'border-white/8 bg-white/2 hover:border-purple-500/30 hover:bg-purple-600/5 cursor-pointer'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-semibold leading-snug ${
                completed ? 'line-through text-gray-500' : current ? 'text-white' : 'text-gray-200'
              }`}
            >
              {lesson.title}
            </p>
            {!completed && (
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{lesson.description}</p>
            )}
          </div>
          {lesson.estimated_minutes > 0 && !completed && (
            <span className="text-xs text-gray-600 flex-shrink-0">{lesson.estimated_minutes}m</span>
          )}
        </div>
      </button>
    </div>
  )
}
