import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { X, Star } from 'lucide-react'
import confetti from 'canvas-confetti'
import { unlockWhitepaper, seedWhitepapers, tierColors } from '../../lib/seedWhitepapers'

interface Props {
  wpSlug: string
  onClose: () => void
}

export default function WhitepaperUnlock({ wpSlug, onClose }: Props) {
  const wp = seedWhitepapers.find((w) => w.slug === wpSlug)
  const fired = useRef(false)

  useEffect(() => {
    unlockWhitepaper(wpSlug)
    if (!fired.current) {
      fired.current = true
      confetti({
        particleCount: 130,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#7C3AED', '#06B6D4', '#A78BFA', '#F8FAFC', '#F59E0B'],
      })
    }
  }, [wpSlug])

  if (!wp) return null

  const tier = tierColors[wp.tier]
  const nextTier = wp.tier < 4 ? wp.tier + 1 : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 12 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="relative glass-card rounded-2xl p-8 max-w-md w-full z-10 text-center border border-amber-500/20 shadow-[0_0_60px_rgba(245,158,11,0.1)]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
        >
          <X size={15} />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto mb-5 shadow-[0_0_24px_rgba(245,158,11,0.2)]">
          <Star size={28} className="text-amber-400" />
        </div>

        {/* Tier badge */}
        <div
          className={`inline-flex text-xs font-semibold px-3 py-1 rounded-full border mb-4 ${tier.text} ${tier.bg} ${tier.border}`}
        >
          {tier.badge}
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Whitepaper Unlocked!</h2>
        <p className="text-gray-400 text-sm mb-3">
          You've completed all the foundation lessons for this tier.
        </p>
        <p className="text-white font-semibold text-base mb-6 leading-snug">{wp.title}</p>

        <div className="flex flex-col gap-3">
          <Link to={`/whitepapers/${wpSlug}`} onClick={onClose} className="btn-primary w-full justify-center">
            Read Now →
          </Link>
          {nextTier && (
            <button onClick={onClose} className="btn-secondary w-full justify-center">
              Continue to Tier {nextTier} →
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
