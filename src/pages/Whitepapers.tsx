import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Lock, Zap, ArrowRight, Star, TrendingUp,
  ChevronRight,
} from 'lucide-react'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/ui/Footer'
import {
  seedWhitepapers,
  tierColors,
  difficultyColors,
  getWPProgress,
  getUnlockedWhitepapers,
  isWhitepaperUnlocked,
  type SeedWhitepaper,
} from '../lib/seedWhitepapers'
import { supabase } from '../lib/supabase'
import type { Whitepaper } from '../lib/supabase'

type DisplayWhitepaper = SeedWhitepaper & { dbId?: string }

const tierTabs = [
  { id: 0, label: 'All' },
  { id: 1, label: 'Tier 1 · Foundations' },
  { id: 2, label: 'Tier 2 · Smart Contracts' },
  { id: 3, label: 'Tier 3 · DeFi & Scaling' },
  { id: 4, label: 'Tier 4 · Frontier' },
]

const levelOrder = { surface: 0, structural: 1, deep: 2, mastery: 3 }
const levelColors = {
  surface: 'text-gray-400',
  structural: 'text-blue-400',
  deep: 'text-purple-400',
  mastery: 'text-amber-400',
}
const levelLabels = { surface: 'Surface', structural: 'Structural', deep: 'Deep', mastery: 'Mastery' }

function ComprehensionBar({ slug }: { slug: string }) {
  const progress = getWPProgress()
  const entry = progress[slug]
  if (!entry) {
    return <span className="text-xs text-gray-600">Not started</span>
  }
  const lvl = levelOrder[entry.level]
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-600 to-cyan-500"
          style={{ width: `${((lvl + 1) / 4) * 100}%` }}
        />
      </div>
      <span className={`text-xs font-medium ${levelColors[entry.level]}`}>
        {levelLabels[entry.level]}
      </span>
    </div>
  )
}

function WhitepaperCard({
  wp,
  unlocked,
  index,
}: {
  wp: DisplayWhitepaper
  unlocked: boolean
  index: number
}) {
  const tier = tierColors[wp.tier]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`glass-card rounded-2xl p-6 flex flex-col gap-4 transition-all ${
        unlocked
          ? 'hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5'
          : 'opacity-60'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${tier.text} ${tier.bg} ${tier.border}`}
            >
              {tier.badge}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full border ${difficultyColors[wp.difficulty]}`}
            >
              {wp.difficulty.charAt(0).toUpperCase() + wp.difficulty.slice(1)}
            </span>
          </div>
          <h3 className="font-bold text-white text-sm leading-snug">{wp.title}</h3>
          <p className="text-xs text-gray-500 mt-1">
            {wp.author} · {wp.year}
          </p>
        </div>
        {!unlocked && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <Lock size={14} className="text-gray-500" />
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{wp.description}</p>

      {/* Comprehension progress */}
      <div className="space-y-1">
        <p className="text-xs text-gray-600">Comprehension</p>
        <ComprehensionBar slug={wp.slug} />
      </div>

      {/* CTA */}
      {unlocked ? (
        <Link to={`/whitepapers/${wp.slug}`}>
          <motion.div
            whileHover={{ x: 2 }}
            className="flex items-center justify-between mt-auto pt-2 border-t border-white/5 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <span className="text-xs font-semibold">Read & Explore</span>
            <ArrowRight size={14} />
          </motion.div>
        </Link>
      ) : (
        <Link to="/learn">
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5 text-gray-600">
            <span className="text-xs">Unlock in Learn Path</span>
            <ChevronRight size={14} />
          </div>
        </Link>
      )}
    </motion.div>
  )
}

export default function Whitepapers() {
  const [activeTier, setActiveTier] = useState(0)
  const [whitepapers, setWhitepapers] = useState<DisplayWhitepaper[]>(seedWhitepapers)
  const [unlockedSlugs, setUnlockedSlugs] = useState<string[]>(['bitcoin'])

  useEffect(() => {
    setUnlockedSlugs(getUnlockedWhitepapers())
    // Try to merge with Supabase data (get DB IDs for RAG queries)
    fetchDBWhitepapers()
  }, [])

  async function fetchDBWhitepapers() {
    try {
      const { data } = await supabase
        .from('whitepapers')
        .select('id, slug, unlocked_by_default')
      if (!data) return
      setWhitepapers((prev) =>
        prev.map((wp) => {
          const db = (data as Pick<Whitepaper, 'id' | 'slug' | 'unlocked_by_default'>[]).find(
            (d) => d.slug === wp.slug
          )
          return db ? { ...wp, dbId: db.id, unlocked_by_default: db.unlocked_by_default } : wp
        })
      )
    } catch {
      // Supabase not configured — use seed data only
    }
  }

  const filtered =
    activeTier === 0 ? whitepapers : whitepapers.filter((w) => w.tier === activeTier)

  const unlockedCount = whitepapers.filter((w) => isWhitepaperUnlocked(w.slug)).length
  const progress = getWPProgress()
  const readCount = Object.values(progress).filter((p) => p.last_read).length

  return (
    <div className="min-h-screen bg-mesh">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-12 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-purple-600/10 border border-purple-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
              RAG-Powered
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Read What the Inventors{' '}
            <span className="gradient-text">Actually Wrote</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Master blockchain by going straight to the source — the original whitepapers, made
            readable with AI.
          </p>
        </motion.div>
      </section>

      {/* Progress summary */}
      <section className="px-4 mb-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="glass-card rounded-2xl p-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <BookOpen size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Your Whitepaper Journey</p>
                  <p className="text-xs text-gray-500">
                    {unlockedCount}/{whitepapers.length} unlocked · {readCount} read
                  </p>
                </div>
              </div>
              <div className="flex-1 max-w-xs">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Tier 1 progress</span>
                  <span>{Math.round((unlockedCount / whitepapers.length) * 100)}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 transition-all"
                    style={{ width: `${(unlockedCount / whitepapers.length) * 100}%` }}
                  />
                </div>
              </div>
              <Link to="/learn" className="btn-secondary text-xs flex-shrink-0">
                Continue Learning <ArrowRight size={12} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tier navigation */}
      <section className="px-4 mb-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {tierTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTier(tab.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  activeTier === tab.id
                    ? 'bg-purple-600/20 border border-purple-500/40 text-purple-300'
                    : 'border border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-4 pb-24">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTier}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filtered.map((wp, i) => (
                <WhitepaperCard
                  key={wp.slug}
                  wp={wp}
                  unlocked={isWhitepaperUnlocked(wp.slug)}
                  index={i}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-600">
              No whitepapers in this tier yet.
            </div>
          )}

          {/* CTA for locked tiers */}
          {activeTier > 1 && !filtered.some((w) => isWhitepaperUnlocked(w.slug)) && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 rounded-2xl bg-purple-600/5 border border-purple-500/20 text-center"
            >
              <Lock size={24} className="text-purple-400 mx-auto mb-3" />
              <h3 className="font-bold text-white mb-2">Complete Earlier Tiers First</h3>
              <p className="text-sm text-gray-400 mb-4">
                Work through the learning path to unlock these whitepapers.
              </p>
              <Link to="/learn" className="btn-primary text-sm">
                Start Your Learning Path
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Stats bar */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card rounded-2xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { icon: <BookOpen size={20} className="text-cyan-400" />, value: '6', label: 'Original Papers' },
                { icon: <Zap size={20} className="text-purple-400" />, value: 'RAG', label: 'AI-Grounded Answers' },
                { icon: <Star size={20} className="text-amber-400" />, value: '4', label: 'Mastery Levels' },
                { icon: <TrendingUp size={20} className="text-pink-400" />, value: '100%', label: 'Free to Read' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="flex justify-center mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
