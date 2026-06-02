import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Brain, Search, Edit3, Shield, BookOpen, Zap, ArrowRight,
  Star, Users, FileText, Layers, Check, Sparkles
} from 'lucide-react'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/ui/Footer'

/* ---- Particle Canvas ---- */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const W = canvas.width = canvas.offsetWidth
    const H = canvas.height = canvas.offsetHeight

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(124,58,237,0.7)'
        ctx.fill()
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(124,58,237,${0.25 * (1 - dist / 120)})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(animId)
  }, [])

  return <canvas ref={canvasRef} id="particle-canvas" className="absolute inset-0 w-full h-full" />
}

/* ---- Animated Counter ---- */
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          let start = 0
          const step = Math.ceil(target / 60)
          const timer = setInterval(() => {
            start += step
            if (start >= target) { setCount(target); clearInterval(timer) }
            else setCount(start)
          }, 16)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

/* ---- Scroll Reveal Hook ---- */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.12 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

const stats = [
  { value: 1200, suffix: '+', label: 'Terms' },
  { value: 5000, suffix: '+', label: 'Students' },
  { value: 48, suffix: '', label: 'Categories' },
  { value: 100, suffix: '%', label: 'AI-Powered' },
]

const features = [
  { icon: Brain, title: 'AI Explainer', desc: 'Get any term explained in 3 styles: simple, technical, or with code — powered by Gemini AI.', color: 'from-purple-500 to-purple-700' },
  { icon: Search, title: 'Semantic Search', desc: "Find terms by meaning, not just keywords. Our AI understands what you're looking for.", color: 'from-cyan-500 to-cyan-700' },
  { icon: Layers, title: 'Quiz Generator', desc: 'Test your understanding with AI-generated quizzes on any term in the glossary.', color: 'from-pink-500 to-pink-700' },
  { icon: BookOpen, title: 'Learning Path', desc: 'Get a personalized Web3 roadmap based on your interests and progress.', color: 'from-amber-500 to-orange-600' },
  { icon: Edit3, title: 'Definition Checker', desc: 'Submit a definition and AI reviews it for accuracy, clarity, and duplicates in real-time.', color: 'from-emerald-500 to-emerald-700' },
  { icon: Shield, title: 'Community Verified', desc: 'Wallet-gated voting ensures the best definitions rise to the top. Quality by design.', color: 'from-indigo-500 to-indigo-700' },
]

const steps = [
  { number: '01', title: 'Browse or Search', desc: 'Explore 1,200+ Web3 terms. Search by meaning, not just keywords.', icon: Search },
  { number: '02', title: 'Ask the AI', desc: 'Have any term explained in plain English, technical detail, or with code examples.', icon: Brain },
  { number: '03', title: 'Contribute & Earn', desc: 'Submit definitions, vote on others, and build your reputation in the community.', icon: Users },
]

const pricingPlans = [
  {
    name: 'Explorer', price: 'Free', desc: 'Perfect to get started',
    features: ['Full glossary access', '5 AI questions/day', 'Basic learning path', 'Community voting'],
    cta: 'Get Started', href: '/glossary', highlight: false,
  },
  {
    name: 'Pro', price: '$5', period: '/month', desc: 'For serious learners',
    features: ['Everything in Explorer', 'Unlimited AI questions', 'Personalized learning path', 'Quiz history', 'Ad-free experience', 'Certificates'],
    cta: 'Upgrade to Pro', href: '/pricing', highlight: true,
  },
  {
    name: 'Institute', price: '$49', period: '/month', desc: 'For schools & bootcamps',
    features: ['Everything in Pro', 'Up to 30 student seats', 'Teacher dashboard', 'Progress tracking', 'Custom branding'],
    cta: 'Contact Us', href: '/contact', highlight: false,
  },
]

const testimonials = [
  { name: 'Alex Chen', role: 'CS Student, Stanford', avatar: 'AC', text: '"Web3Minds made DeFi click for me in 20 minutes. The AI explainer is insane — I asked it to explain liquidity pools like I\'m 5, and it actually worked."' },
  { name: 'Priya Sharma', role: 'Blockchain Bootcamp Graduate', avatar: 'PS', text: '"I contributed 15 definitions and the community feedback helped me understand concepts even deeper. This is what Wikipedia should\'ve been for crypto."' },
  { name: 'Marcus Williams', role: 'Self-taught Web3 Dev', avatar: 'MW', text: '"The quiz generator is my secret weapon. I go through a topic, take the AI quiz, and I actually retain it. No other platform does this."' },
]

export default function Index() {
  useScrollReveal()

  return (
    <div className="min-h-screen bg-mesh">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 overflow-hidden">
        <ParticleCanvas />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
          <div className="hero-badge inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-sm text-purple-300">
            <div className="w-2 h-2 rounded-full bg-purple-400" style={{ boxShadow: '0 0 8px #A78BFA' }} />
            <Sparkles size={14} />
            Powered by Gemini AI
          </div>

          <h1 className="hero-headline text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight tracking-tight mb-6">
            Learn Web3 the way<br />
            it should be —{' '}
            <span className="gradient-text-glow">in plain English</span>
          </h1>

          <p className="hero-sub text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            A student community where you explore, contribute, and master blockchain concepts together.
            The AI-powered Wikipedia for Web3.
          </p>

          <div className="hero-ctas flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/glossary" className="btn-primary text-base px-6 py-3">
              Start Exploring <ArrowRight size={16} />
            </Link>
            <Link to="/about" className="btn-secondary text-base px-6 py-3">
              How it works
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 text-xs">
          <span>Scroll to explore</span>
          <div className="w-0.5 h-8 bg-gradient-to-b from-purple-500/50 to-transparent rounded" />
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="py-16 border-y border-white/5 bg-[#0F1117]/60">
        <div className="max-w-4xl mx-auto px-4">
          <div className="hero-stats grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-4xl font-bold gradient-text mb-1">
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </div>
                <div className="text-sm text-gray-500 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal">
            <p className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How it <span className="gradient-text">works</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">From zero to Web3 fluency in three steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                className="glass-card rounded-2xl p-8 relative reveal"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-6xl font-bold text-white/5 absolute top-4 right-6 select-none">{step.number}</div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/30 to-cyan-500/20 flex items-center justify-center mb-6 border border-purple-500/20">
                  <step.icon size={22} className="text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== AI FEATURES ===== */}
      <section className="py-24 px-4 bg-[#0F1117]/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal">
            <p className="text-sm font-semibold text-cyan-400 uppercase tracking-widest mb-3">AI-Powered</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Features that <span className="gradient-text">actually teach</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="glass-card rounded-2xl p-6 reveal"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon size={18} className="text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* AI Mockup */}
          <div className="mt-16 reveal">
            <div className="gradient-border rounded-2xl max-w-2xl mx-auto">
              <div className="bg-[#13151C] rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <span className="ml-2 text-xs text-gray-500 font-mono">AI Explainer — Web3Minds</span>
                </div>
                <div className="text-sm text-gray-400 mb-3">Ask AI to explain: <span className="text-purple-300 font-semibold">Liquidity Pool</span></div>
                <div className="flex gap-2 mb-4 flex-wrap">
                  {["Like I'm 5", 'Technical', 'With code'].map((s) => (
                    <button key={s} className={`category-pill text-xs ${s === "Like I'm 5" ? 'active' : ''}`}>{s}</button>
                  ))}
                </div>
                <div className="bg-purple-600/10 border border-purple-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Zap size={10} className="text-white" />
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      Imagine a piggy bank that <em>everyone</em> shares. You put some money in, and whenever someone wants to swap one coin for another, they use that shared pool. You earn a cut of the fees! 🐷
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="text-xs text-gray-600 ml-2">Powered by Gemini AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal">
            <p className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Free to start,<br /><span className="gradient-text">powerful to grow</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                className={`rounded-2xl p-8 reveal relative ${plan.highlight ? 'gradient-border' : 'glass-card'}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-xs text-gray-500 mb-4">{plan.desc}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="text-gray-500 text-sm">{plan.period}</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                      <Check size={14} className="text-purple-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to={plan.href} className={plan.highlight ? 'btn-primary w-full justify-center' : 'btn-secondary w-full justify-center'}>
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 px-4 bg-[#0F1117]/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal">
            <p className="text-sm font-semibold text-cyan-400 uppercase tracking-widest mb-3">Community</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Students <span className="gradient-text">love it</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="glass-card rounded-2xl p-6 reveal"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-400 leading-relaxed mb-6 italic">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center reveal">
          <div className="gradient-border rounded-3xl">
            <div className="bg-[#13151C] rounded-3xl p-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Ready to master <span className="gradient-text">Web3?</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                Join 5,000+ students learning blockchain concepts the smart way.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/glossary" className="btn-primary text-base px-8 py-3">
                  Explore the Glossary <ArrowRight size={16} />
                </Link>
                <Link to="/submit" className="btn-secondary text-base px-8 py-3">
                  Contribute a Term
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
