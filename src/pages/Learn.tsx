import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, ArrowRight, Loader, CheckCircle, Circle, AlertCircle } from 'lucide-react'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/ui/Footer'
import { generateLearningPath, type LearningTopic } from '../lib/gemini'
import { seedTerms } from '../lib/seedData'

const interests = [
  { id: 'DeFi', label: 'DeFi Explorer', emoji: '💰', desc: 'Lending, DEXes, yield farming, stablecoins', color: 'from-cyan-600 to-cyan-800' },
  { id: 'NFTs', label: 'NFT Creator', emoji: '🎨', desc: 'Digital art, marketplaces, royalties, metadata', color: 'from-pink-600 to-pink-800' },
  { id: 'Development', label: 'Blockchain Developer', emoji: '⚙️', desc: 'Smart contracts, Solidity, dApps, tooling', color: 'from-purple-600 to-purple-800' },
  { id: 'Investing', label: 'Crypto Investor', emoji: '📈', desc: 'Tokenomics, market cycles, portfolio strategy', color: 'from-amber-600 to-amber-800' },
]

const categoryColors: Record<string, string> = {
  'DeFi': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  'NFTs': 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  'Core Concepts': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  'Security': 'text-green-400 bg-green-500/10 border-green-500/20',
}
function getCatColor(c: string) { return categoryColors[c] || 'text-gray-400 bg-gray-500/10 border-gray-500/20' }

function getViewedTerms(): string[] {
  try { return JSON.parse(localStorage.getItem('w3m_viewed') || '[]') } catch { return [] }
}

export default function Learn() {
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null)
  const [path, setPath] = useState<LearningTopic[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [completedTopics, setCompletedTopics] = useState<Set<number>>(new Set())

  const viewed = getViewedTerms()

  async function handleGenerate(interest: string) {
    setSelectedInterest(interest)
    setPath([])
    setError('')
    setCompletedTopics(new Set())
    setLoading(true)
    try {
      const result = await generateLearningPath(interest, viewed)
      setPath(result)
    } catch {
      setError('Failed to generate learning path. Please check your Gemini API key.')
    } finally {
      setLoading(false)
    }
  }

  function toggleComplete(i: number) {
    setCompletedTopics((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  const progress = path.length > 0 ? Math.round((completedTopics.size / path.length) * 100) : 0

  function findRelatedTerm(topic: string) {
    const t = topic.toLowerCase()
    return seedTerms.find((s) =>
      s.name.toLowerCase().includes(t) ||
      t.includes(s.name.toLowerCase()) ||
      s.slug === t.replace(/\s+/g, '-')
    )
  }

  return (
    <div className="min-h-screen bg-mesh">
      <Navbar />

      <section className="pt-28 pb-12 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-3">Learning Path</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your Web3 <span className="gradient-text">Journey</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Choose your interest area and get a personalized AI-generated roadmap of what to learn and in what order.
          </p>
        </motion.div>
      </section>

      {/* Interest Selector */}
      <section className="px-4 mb-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-white mb-6 text-center">What do you want to focus on?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {interests.map((interest, i) => (
              <motion.button
                key={interest.id}
                onClick={() => handleGenerate(interest.id)}
                className={`glass-card rounded-2xl p-6 text-left transition-all ${
                  selectedInterest === interest.id ? 'border-purple-500/50 bg-purple-600/10' : ''
                }`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -2 }}
                disabled={loading}
              >
                <div className="text-3xl mb-3">{interest.emoji}</div>
                <div className="font-bold text-white mb-1">{interest.label}</div>
                <div className="text-xs text-gray-400">{interest.desc}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Loading */}
      <AnimatePresence>
        {loading && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 mb-12"
          >
            <div className="max-w-2xl mx-auto text-center">
              <div className="glass-card rounded-2xl p-10">
                <Loader size={32} className="text-purple-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-400 mb-2">Generating your personalized learning path...</p>
                <div className="flex items-center justify-center gap-1">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 mb-12 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Learning Path */}
      <AnimatePresence>
        {path.length > 0 && !loading && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 pb-24"
          >
            <div className="max-w-2xl mx-auto">
              <div className="glass-card rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-white flex items-center gap-2">
                    <Brain size={18} className="text-purple-400" />
                    Your {selectedInterest} Learning Path
                  </h2>
                  <span className="text-sm text-gray-400">{completedTopics.size}/{path.length} done</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <motion.div
                    className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-2">{progress}% complete</div>
              </div>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-purple-600 to-cyan-500 opacity-20" />

                <div className="space-y-4">
                  {path.map((topic, i) => {
                    const done = completedTopics.has(i)
                    const relatedTerm = findRelatedTerm(topic.topic)

                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`glass-card rounded-xl p-5 ml-12 relative transition-all ${done ? 'opacity-60' : ''}`}
                      >
                        {/* Node */}
                        <button
                          onClick={() => toggleComplete(i)}
                          className="absolute -left-9 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all bg-[#0A0B0F]"
                          style={{ borderColor: done ? '#7C3AED' : 'rgba(255,255,255,0.1)' }}
                        >
                          {done
                            ? <CheckCircle size={16} className="text-purple-400" />
                            : <Circle size={16} className="text-gray-600" />
                          }
                        </button>

                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-xs font-bold text-gray-500">#{i + 1}</span>
                              <h3 className={`font-bold text-sm ${done ? 'line-through text-gray-500' : 'text-white'}`}>
                                {topic.topic}
                              </h3>
                              {topic.category && (
                                <span className={`text-xs px-2 py-0.5 rounded-full border ${getCatColor(topic.category)}`}>
                                  {topic.category}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed">{topic.description}</p>
                          </div>

                          {relatedTerm && (
                            <Link to={`/glossary/${relatedTerm.slug}`} className="flex-shrink-0">
                              <span className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 whitespace-nowrap">
                                Read <ArrowRight size={11} />
                              </span>
                            </Link>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {progress === 100 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center"
                >
                  <div className="text-4xl mb-3">🎉</div>
                  <h3 className="text-lg font-bold text-emerald-300 mb-2">Path Complete!</h3>
                  <p className="text-sm text-gray-400 mb-4">You've finished your {selectedInterest} learning path. Time to explore more!</p>
                  <Link to="/glossary" className="btn-primary text-sm">Explore the Glossary</Link>
                </motion.div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {!selectedInterest && !loading && (
        <div className="text-center py-12 text-gray-600 text-sm">
          ↑ Select an interest area above to generate your path
        </div>
      )}

      <Footer />
    </div>
  )
}
