import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Award, ThumbsUp, BookOpen, Clock, Star, ArrowRight } from 'lucide-react'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/ui/Footer'
import { seedTerms } from '../lib/seedData'

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

function getViewedTerms(): string[] {
  try {
    return JSON.parse(localStorage.getItem('w3m_viewed') || '[]')
  } catch { return [] }
}

function shortenAddress(addr: string) {
  if (addr.length <= 12) return addr
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

function generateAvatar(address: string): string {
  const colors = ['from-purple-600 to-cyan-500', 'from-pink-500 to-purple-600', 'from-cyan-500 to-blue-600', 'from-amber-500 to-orange-600', 'from-emerald-500 to-cyan-500']
  const index = address.charCodeAt(2) % colors.length
  return colors[index]
}

const badges = [
  { id: 'contributor', label: 'Contributor', icon: '✍️', desc: 'Submitted at least 1 term' },
  { id: 'voter', label: 'Active Voter', icon: '🗳️', desc: 'Cast 10+ votes' },
  { id: 'scholar', label: 'Scholar', icon: '📚', desc: 'Viewed 10+ terms' },
  { id: 'ai-power', label: 'AI Explorer', icon: '🤖', desc: 'Used the AI explainer 5+ times' },
]

export default function Profile() {
  const { address } = useParams<{ address: string }>()
  const displayAddress = address || 'demo-user'

  const [aiUsed] = useState(getAIUsageToday)
  const [viewedTerms] = useState(getViewedTerms)

  const isDemo = displayAddress === 'demo-user'
  const reputation = isDemo ? 47 : Math.abs(displayAddress.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % 500

  const contributedTerms = isDemo
    ? seedTerms.slice(0, 3).map((t) => ({ ...t, status: 'live' as const }))
    : []

  const earnedBadges = badges.filter((b, i) => {
    if (b.id === 'scholar' && viewedTerms.length >= 1) return true
    if (b.id === 'ai-power' && aiUsed >= 1) return true
    return i === 0
  })

  return (
    <div className="min-h-screen bg-mesh">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-28 pb-24">
        {/* Profile header */}
        <motion.div className="glass-card rounded-2xl p-8 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${generateAvatar(displayAddress)} flex items-center justify-center flex-shrink-0 shadow-lg`}>
              <User size={32} className="text-white" />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-white mb-1">
                {isDemo ? 'Demo User' : shortenAddress(displayAddress)}
              </h1>
              <p className="text-sm text-gray-500 font-mono mb-4">
                {isDemo ? '0xdemo...0000' : displayAddress}
              </p>

              <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Clock size={14} className="text-purple-400" />
                  Member since 2025
                </div>
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Star size={14} className="text-amber-400" />
                  {reputation} reputation
                </div>
                <div className="flex items-center gap-1.5 text-gray-400">
                  <BookOpen size={14} className="text-cyan-400" />
                  {viewedTerms.length} terms viewed
                </div>
              </div>
            </div>

            {/* Subscription badge */}
            <div className="flex-shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Free Plan
              </span>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* AI Usage */}
          <motion.div className="glass-card rounded-2xl p-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-purple-400">🤖</span> AI Usage Today
            </h2>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 bg-white/5 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 transition-all"
                  style={{ width: `${(aiUsed / AI_LIMIT) * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-400 font-mono">{aiUsed}/{AI_LIMIT}</span>
            </div>
            <p className="text-xs text-gray-500">
              {AI_LIMIT - aiUsed} questions remaining today
            </p>
            {aiUsed >= AI_LIMIT && (
              <Link to="/pricing" className="btn-primary text-xs mt-4 inline-flex">
                Upgrade to Pro for unlimited →
              </Link>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div className="glass-card rounded-2xl p-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <h2 className="font-bold text-white mb-4 flex items-center gap-2">
              <ThumbsUp size={16} className="text-purple-400" /> Stats
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Reputation', value: reputation, color: 'text-amber-400' },
                { label: 'Terms Viewed', value: viewedTerms.length, color: 'text-cyan-400' },
                { label: 'AI Questions Used', value: aiUsed, color: 'text-purple-400' },
                { label: 'Contributions', value: contributedTerms.length, color: 'text-pink-400' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/3 rounded-xl p-3 text-center">
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Badges */}
        <motion.div className="glass-card rounded-2xl p-6 mt-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="font-bold text-white mb-5 flex items-center gap-2">
            <Award size={16} className="text-amber-400" /> Badges
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {badges.map((badge) => {
              const earned = earnedBadges.find((b) => b.id === badge.id)
              return (
                <div
                  key={badge.id}
                  className={`rounded-xl p-4 text-center border transition-all ${
                    earned
                      ? 'bg-purple-600/10 border-purple-500/30'
                      : 'bg-white/3 border-white/5 opacity-40'
                  }`}
                >
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <div className="text-xs font-bold text-white">{badge.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{badge.desc}</div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Viewed Terms */}
        {viewedTerms.length > 0 && (
          <motion.div className="glass-card rounded-2xl p-6 mt-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <h2 className="font-bold text-white mb-5 flex items-center gap-2">
              <BookOpen size={16} className="text-cyan-400" /> Recently Viewed
            </h2>
            <div className="flex flex-wrap gap-2">
              {viewedTerms.slice(-12).reverse().map((name) => {
                const term = seedTerms.find((t) => t.name === name)
                if (!term) return null
                return (
                  <Link key={name} to={`/glossary/${term.slug}`}>
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-xs text-gray-300 hover:border-purple-500/40 hover:text-purple-300 transition-all">
                      {name} <ArrowRight size={10} />
                    </span>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Contributions */}
        {isDemo && (
          <motion.div className="glass-card rounded-2xl p-6 mt-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="font-bold text-white mb-5 flex items-center gap-2">
              <Star size={16} className="text-purple-400" /> Contributions
            </h2>
            <div className="space-y-3">
              {contributedTerms.map((term) => (
                <Link key={term.slug} to={`/glossary/${term.slug}`}>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5 hover:border-purple-500/30 transition-all">
                    <div>
                      <div className="text-sm font-semibold text-white">{term.name}</div>
                      <div className="text-xs text-gray-500">{term.category}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        ✓ Live
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <ThumbsUp size={11} />
                        {term.upvotes}
                      </div>
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
