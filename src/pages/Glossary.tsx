import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ThumbsUp, ArrowRight, Filter } from 'lucide-react'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/ui/Footer'
import { seedTerms } from '../lib/seedData'

const categories = [
  'All', 'Core Concepts', 'DeFi', 'NFTs', 'Layer 2', 'DAOs',
  'Wallets', 'Staking', 'Bridges', 'Tokenomics', 'Security',
]

const sortOptions = [
  { value: 'upvotes', label: 'Most Upvoted' },
  { value: 'newest', label: 'Newest' },
  { value: 'name', label: 'A–Z' },
]

const categoryColors: Record<string, string> = {
  'Core Concepts': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  'DeFi': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  'NFTs': 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  'Layer 2': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'DAOs': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'Wallets': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  'Staking': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  'Bridges': 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  'Tokenomics': 'text-red-400 bg-red-500/10 border-red-500/20',
  'Security': 'text-green-400 bg-green-500/10 border-green-500/20',
}

function getCategoryColor(cat: string) {
  return categoryColors[cat] || 'text-gray-400 bg-gray-500/10 border-gray-500/20'
}

export default function Glossary() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('upvotes')

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(t)
  }, [query])

  const filtered = useMemo(() => {
    let terms = [...seedTerms]

    if (activeCategory !== 'All') {
      terms = terms.filter((t) => t.category === activeCategory)
    }

    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase()
      terms = terms.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.short_definition.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      )
    }

    if (sortBy === 'upvotes') terms.sort((a, b) => b.upvotes - a.upvotes)
    else if (sortBy === 'name') terms.sort((a, b) => a.name.localeCompare(b.name))

    return terms
  }, [debouncedQuery, activeCategory, sortBy])

  return (
    <div className="min-h-screen bg-mesh">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-3">Glossary</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Explore <span className="gradient-text">Web3 Terms</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              1,200+ definitions explained in plain English. Powered by the community and AI.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            className="relative max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search — DeFi, gas fee, smart contract..."
              className="input-dark pl-11 text-base py-4 rounded-xl"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                ✕
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Category pills — horizontal scroll */}
            <div className="flex gap-2 overflow-x-auto pb-2 flex-1 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`category-pill flex-shrink-0 ${activeCategory === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Filter size={14} className="text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-dark py-2 text-sm w-auto pr-8"
                style={{ background: '#13151C' }}
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Grid */}
      <section className="px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          {/* Result count */}
          <div className="mb-6 text-sm text-gray-500">
            {filtered.length} {filtered.length === 1 ? 'term' : 'terms'}
            {debouncedQuery && <span> for "<span className="text-gray-300">{debouncedQuery}</span>"</span>}
            {activeCategory !== 'All' && <span> in <span className="text-gray-300">{activeCategory}</span></span>}
          </div>

          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-gray-400 text-lg">No terms found for "{debouncedQuery}"</p>
                <p className="text-gray-600 text-sm mt-2">Try a different search or browse all categories</p>
                <button
                  onClick={() => { setQuery(''); setActiveCategory('All') }}
                  className="btn-secondary mt-6 text-sm"
                >
                  Clear filters
                </button>
              </motion.div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((term, i) => (
                  <motion.div
                    key={term.slug}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.4) }}
                  >
                    <Link to={`/glossary/${term.slug}`}>
                      <div className="glass-card rounded-xl p-5 h-full flex flex-col cursor-pointer group">
                        {/* Category badge */}
                        <span className={`inline-flex text-xs font-semibold px-2 py-0.5 rounded-full border w-fit mb-3 ${getCategoryColor(term.category)}`}>
                          {term.category}
                        </span>

                        {/* Term name */}
                        <h3 className="font-bold text-white text-lg mb-2 group-hover:text-purple-300 transition-colors">
                          {term.name}
                        </h3>

                        {/* Short definition */}
                        <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 flex-1">
                          {term.short_definition}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <ThumbsUp size={12} className="text-purple-400" />
                            <span>{term.upvotes}</span>
                          </div>
                          <span className="text-xs text-purple-400 group-hover:text-purple-300 flex items-center gap-1 transition-colors">
                            Read more <ArrowRight size={12} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* CTA to submit */}
          {filtered.length > 0 && (
            <div className="mt-12 text-center">
              <p className="text-gray-500 text-sm mb-4">Don't see your term?</p>
              <Link to="/submit" className="btn-primary text-sm">
                Submit a Definition
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
