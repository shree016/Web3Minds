import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Search, Wallet, BookOpen, Edit3, HelpCircle, ArrowRight, CheckCircle } from 'lucide-react'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/ui/Footer'

const steps = [
  { icon: Search, title: 'Browse the glossary', desc: 'No account needed. Just search for any Web3 term and read clear explanations in plain English.', color: 'from-purple-500 to-purple-700' },
  { icon: Wallet, title: 'Connect your wallet', desc: 'Free, takes 2 minutes. Install MetaMask, get testnet ETH, and connect. No real money needed.', color: 'from-cyan-500 to-cyan-700' },
  { icon: BookOpen, title: 'Ask the AI, earn reputation', desc: 'Get AI explanations, contribute definitions, upvote the best answers, and build your Web3 reputation.', color: 'from-pink-500 to-pink-700' },
]

const faqs = [
  { q: 'Is Web3Minds free?', a: 'Yes, forever for the basics. Browse all 1,200+ terms, use 5 AI questions per day, and contribute without paying anything.' },
  { q: 'Do I need real crypto?', a: "No! We use testnets only. You never need to spend real money to use Web3Minds. Your wallet is just your identity." },
  { q: 'What is upvoting?', a: 'Like Reddit — the best definitions rise to the top. Wallet-connected users can upvote or downvote any definition.' },
  { q: 'Who writes the definitions?', a: 'Real students like you, verified by AI and the community. Our Gemini AI checks accuracy and clarity before anything goes live.' },
  { q: 'Is my wallet safe?', a: "You never share your private keys or seed phrase. Wallets are just your identity — like a username. You only sign read-only messages." },
  { q: 'What is MetaMask?', a: 'MetaMask is a free browser extension that acts as your crypto wallet. It lets you connect to Web3 apps without creating accounts.' },
]

const metamaskSteps = [
  'Go to metamask.io and install the browser extension',
  'Create a new wallet and save your seed phrase safely (never share it!)',
  'Click "Connect Wallet" on Web3Minds and approve the connection',
  'Done! Your wallet address is your username. No password needed.',
]

export default function About() {
  return (
    <div className="min-h-screen bg-mesh">
      <Navbar />

      <section className="pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-3">For Beginners</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              New to Web3?<br />
              <span className="gradient-text">You're in the right place.</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Web3Minds is built by students, for students. No jargon. No gatekeeping.
              Just clear explanations of everything blockchain.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#0F1117]/40">
        <div className="max-w-3xl mx-auto">
          <motion.div className="glass-card rounded-2xl p-8" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-white mb-6">What is Web3Minds?</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed text-sm">
              <p>Think of it like <strong className="text-white">Wikipedia for crypto</strong> — but smarter, because it's powered by AI and maintained by a community of real students like you.</p>
              <p>When you search "liquidity pool" or "proof of stake," you don't just get a dry definition. You get an AI that can explain it <em>like you're 5</em>, test your knowledge with a quiz, and suggest what to learn next.</p>
              <p>Every definition is written by students and verified by AI. Anyone can contribute — and the best contributions get upvoted to the top, Reddit-style.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Your 3-step guide</h2>
            <p className="text-gray-400">From zero to contributing in minutes.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div key={step.title} className="glass-card rounded-2xl p-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5`}>
                  <step.icon size={22} className="text-white" />
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Step {i + 1}</div>
                <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#0F1117]/40">
        <div className="max-w-3xl mx-auto">
          <motion.div className="glass-card rounded-2xl p-8" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                <Wallet size={22} className="text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">What is a crypto wallet?</h2>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                  A crypto wallet is like a digital ID card. It doesn't hold your money — it just proves who you are on the blockchain. MetaMask is the most popular wallet and it's completely free.
                  <strong className="text-yellow-400"> You never need real money to use Web3Minds.</strong>
                </p>
                <h3 className="text-sm font-bold text-white mb-4">How to set up MetaMask (4 steps):</h3>
                <ol className="space-y-3">
                  {metamaskSteps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                      <span className="text-sm text-gray-300 leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-6 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <p className="text-xs text-amber-300">🔑 <strong>Important:</strong> Never share your seed phrase or private key with anyone — not even us. Anyone who asks for it is a scammer.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">Your first contribution</h2>
            <p className="text-gray-400">It takes less than 5 minutes.</p>
          </div>
          <div className="space-y-4">
            {[
              { icon: Search, text: 'Search for a Web3 term you know well', color: 'text-purple-400' },
              { icon: BookOpen, text: 'Read the existing definitions and learn from them', color: 'text-cyan-400' },
              { icon: Edit3, text: 'Click "Submit Term" and write your own explanation in plain English', color: 'text-pink-400' },
              { icon: CheckCircle, text: 'Our AI reviews it for accuracy, then community moderators approve it', color: 'text-emerald-400' },
            ].map((item, i) => (
              <motion.div key={i} className="glass-card rounded-xl p-5 flex items-center gap-4" initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}>
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <item.icon size={18} className={item.color} />
                </div>
                <span className="text-sm text-gray-300">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#0F1117]/40">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div key={i} className="glass-card rounded-xl p-5" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} viewport={{ once: true }}>
                <div className="flex items-start gap-3">
                  <HelpCircle size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">{faq.q}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to start?</h2>
          <p className="text-gray-400 mb-8">No wallet needed to browse. Just start exploring.</p>
          <Link to="/glossary" className="btn-primary text-base px-8 py-3">
            Start Exploring <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
