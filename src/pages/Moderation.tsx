import { motion } from 'framer-motion'
import { Shield, Check, X, MessageSquare, Clock, AlertCircle } from 'lucide-react'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/ui/Footer'

const mockPending = [
  {
    id: '1',
    name: 'Flash Loan',
    category: 'DeFi',
    short_definition: 'An uncollateralized loan that must be borrowed and repaid within a single blockchain transaction.',
    submitter_wallet: '0x1234...5678',
    ai_score: 88,
    created_at: '2025-06-01',
  },
  {
    id: '2',
    name: 'Rug Pull',
    category: 'Security',
    short_definition: 'A crypto scam where developers abandon a project and run away with investor funds.',
    submitter_wallet: '0xabcd...efgh',
    ai_score: 92,
    created_at: '2025-06-01',
  },
  {
    id: '3',
    name: 'Merkle Tree',
    category: 'Core Concepts',
    short_definition: 'A data structure used in blockchain to efficiently verify the integrity of large datasets.',
    submitter_wallet: '0x9876...4321',
    ai_score: 76,
    created_at: '2025-05-31',
  },
]

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
    : score >= 60 ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
    : 'bg-red-500/10 border-red-500/30 text-red-300'
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${color}`}>
      AI: {score}/100
    </span>
  )
}

export default function Moderation() {
  return (
    <div className="min-h-screen bg-mesh">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-28 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Moderation Queue</h1>
              <p className="text-sm text-gray-500">Review pending term submissions</p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-2 text-sm text-amber-300 mb-8">
            <AlertCircle size={14} />
            Moderation access requires reputation score &gt; 50. This is a preview.
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Pending', value: mockPending.length, color: 'text-amber-400' },
            { label: 'Approved today', value: 7, color: 'text-emerald-400' },
            { label: 'Total reviewed', value: 142, color: 'text-purple-400' },
          ].map((s) => (
            <div key={s.label} className="glass-card rounded-xl p-4 text-center">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Queue */}
        <div className="space-y-4">
          {mockPending.map((item, i) => (
            <motion.div
              key={item.id}
              className="glass-card rounded-2xl p-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white">{item.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300">{item.category}</span>
                    <ScoreBadge score={item.ai_score} />
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.short_definition}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Clock size={11} /> {item.created_at}</span>
                  <span>by {item.submitter_wallet}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition-colors">
                    <Check size={12} /> Approve
                  </button>
                  <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-colors">
                    <MessageSquare size={12} /> Request changes
                  </button>
                  <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 transition-colors">
                    <X size={12} /> Reject
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
