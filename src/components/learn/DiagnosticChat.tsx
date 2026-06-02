import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Bot, User, Loader, SkipForward } from 'lucide-react'
import { runDiagnosticTurn, type DiagnosticResult } from '../../lib/gemini'

type Message = { role: 'user' | 'ai'; text: string }

const INITIAL_MESSAGE: Message = {
  role: 'ai',
  text: "Welcome! I'm your Web3Minds learning advisor. To build your personalised path, I have just a few quick questions.\n\nWhat brings you to blockchain? Are you a developer, an investor, a student, or just curious about the technology?",
}

const DEFAULT_DIAGNOSTIC: DiagnosticResult = {
  background: 'other',
  prior_knowledge: 'beginner',
  interest_area: 'defi',
  readiness: { bitcoin_wp: 0.2, ethereum_wp: 0.05, defi_wp: 0.0 },
  recommended_start: 'what-problem-bitcoin-solves',
}

interface Props {
  onComplete: (diagnostic: DiagnosticResult) => void
}

export default function DiagnosticChat({ onComplete }: Props) {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { role: 'user', text }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const result = await runDiagnosticTurn(next.map((m) => ({ role: m.role, text: m.text })))

      if (result.done && result.diagnostic) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            text: "Perfect! I've got a clear picture of your background and goals. Building your personalised path now…",
          },
        ])
        setLoading(false)
        // Small delay so the user can read the completion message
        setTimeout(() => onComplete(result.diagnostic!), 1200)
      } else {
        setMessages((prev) => [...prev, { role: 'ai', text: result.text }])
        setLoading(false)
        setTimeout(() => inputRef.current?.focus(), 100)
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: "I had a little trouble there. Let's use a solid default path to get you started right away.",
        },
      ])
      setLoading(false)
      setTimeout(() => onComplete(DEFAULT_DIAGNOSTIC), 1000)
    }
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-purple-500/20">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
          <Bot size={15} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-white">Learning Advisor</p>
          <p className="text-xs text-gray-500">~2 min personalisation chat</p>
        </div>
        <button
          onClick={() => onComplete(DEFAULT_DIAGNOSTIC)}
          className="text-xs text-gray-600 hover:text-gray-400 flex items-center gap-1.5 transition-colors"
        >
          <SkipForward size={11} /> Skip
        </button>
      </div>

      {/* Messages */}
      <div className="h-72 overflow-y-auto px-6 py-4 space-y-4 scroll-smooth">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                m.role === 'ai'
                  ? 'bg-gradient-to-br from-purple-600 to-cyan-500'
                  : 'bg-white/10 border border-white/10'
              }`}
            >
              {m.role === 'ai' ? (
                <Bot size={11} className="text-white" />
              ) : (
                <User size={11} className="text-white" />
              )}
            </div>
            <div
              className={`rounded-2xl px-4 py-2.5 text-sm max-w-xs leading-relaxed whitespace-pre-wrap ${
                m.role === 'ai'
                  ? 'bg-white/5 border border-white/8 text-gray-200 rounded-tl-sm'
                  : 'bg-purple-600/20 border border-purple-500/30 text-purple-100 rounded-tr-sm'
              }`}
            >
              {m.text}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex gap-2.5">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-1">
              <Bot size={11} className="text-white" />
            </div>
            <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-white/5 border border-white/8 flex items-center gap-1">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-white/5">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your answer..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/40 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            {loading ? (
              <Loader size={14} className="text-white animate-spin" />
            ) : (
              <Send size={14} className="text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
