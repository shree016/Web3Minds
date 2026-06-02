import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const KEY_TO_SLUG: Record<string, string> = {
  bitcoin_wp: 'bitcoin',
  ethereum_wp: 'ethereum',
  defi_wp: 'uniswap-v2',
  lightning_wp: 'lightning-network',
}

const KEY_TO_TITLE: Record<string, string> = {
  bitcoin_wp: 'Bitcoin Whitepaper',
  ethereum_wp: 'Ethereum Whitepaper',
  defi_wp: 'Uniswap v2 Paper',
  lightning_wp: 'Lightning Network',
}

interface Props {
  readiness: Record<string, number>
}

export default function ReadinessMap({ readiness }: Props) {
  const entries = Object.entries(readiness)
  const [bestKey] = entries.reduce((a, b) => (a[1] >= b[1] ? a : b), ['', -1])

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-bold text-white mb-1">Your Whitepaper Readiness</h3>
      <p className="text-xs text-gray-500 mb-5">
        Based on your background — 0% = starting fresh, 100% = ready to read now
      </p>

      <div className="space-y-4">
        {entries.map(([key, score], i) => {
          const slug = KEY_TO_SLUG[key] ?? key
          const title = KEY_TO_TITLE[key] ?? key.replace(/_wp$/, '').replace(/_/g, ' ')
          const pct = Math.round(score * 100)
          const isHighest = key === bestKey

          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/whitepapers/${slug}`}
                    className="text-sm text-gray-300 hover:text-white transition-colors capitalize"
                  >
                    {title}
                  </Link>
                  {isHighest && pct > 0 && (
                    <span className="text-xs font-semibold text-cyan-400">← Start here</span>
                  )}
                </div>
                <span className="text-xs font-mono text-gray-600">{pct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${isHighest ? 'bg-gradient-to-r from-cyan-600 to-purple-600' : 'bg-gradient-to-r from-purple-700 to-purple-500'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(pct, 2)}%` }}
                  transition={{ duration: 0.9, ease: 'easeOut', delay: i * 0.1 + 0.2 }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {bestKey && (
        <Link
          to={`/whitepapers/${KEY_TO_SLUG[bestKey] ?? bestKey}`}
          className="mt-5 inline-flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          Start with your highest readiness
          <ArrowRight size={13} />
        </Link>
      )}
    </div>
  )
}
