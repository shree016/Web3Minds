import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Check, X, HelpCircle } from 'lucide-react'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/ui/Footer'

const plans = [
  {
    name: 'Explorer',
    price: 'Free',
    desc: 'Perfect to get started with Web3 learning',
    features: [
      { text: 'Full glossary access (1,200+ terms)', included: true },
      { text: '5 AI questions per day', included: true },
      { text: 'Basic learning path', included: true },
      { text: 'Community voting', included: true },
      { text: 'Quiz history', included: false },
      { text: 'Ad-free experience', included: false },
      { text: 'Certificates', included: false },
      { text: 'Save progress', included: false },
    ],
    cta: 'Get Started Free',
    href: '/glossary',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$5',
    period: '/month',
    desc: 'For serious learners who want to go deep',
    features: [
      { text: 'Full glossary access (1,200+ terms)', included: true },
      { text: 'Unlimited AI questions', included: true },
      { text: 'Personalized learning path', included: true },
      { text: 'Community voting', included: true },
      { text: 'Quiz history', included: true },
      { text: 'Ad-free experience', included: true },
      { text: 'Certificates', included: true },
      { text: 'Save progress across sessions', included: true },
    ],
    cta: 'Upgrade to Pro',
    href: '/contact',
    highlight: true,
  },
  {
    name: 'Institute',
    price: '$49',
    period: '/month',
    desc: 'For schools, bootcamps, and teams',
    features: [
      { text: 'Full glossary access (1,200+ terms)', included: true },
      { text: 'Unlimited AI questions', included: true },
      { text: 'Personalized learning paths', included: true },
      { text: 'Community voting', included: true },
      { text: 'Quiz history + analytics', included: true },
      { text: 'Ad-free experience', included: true },
      { text: 'Certificates for all students', included: true },
      { text: 'Up to 30 student seats', included: true },
    ],
    cta: 'Contact Us',
    href: '/contact',
    highlight: false,
  },
]

const faqs = [
  { q: 'Can I cancel anytime?', a: 'Yes. No lock-in, no cancellation fees. Cancel from your profile page at any time.' },
  { q: 'Is there a student discount?', a: 'A student discount is coming soon. Join the waitlist by contacting us.' },
  { q: 'What payment methods are accepted?', a: 'Card payments via Stripe (Visa, Mastercard, Amex). Crypto payments coming soon.' },
  { q: 'Is the Free plan really free forever?', a: 'Yes. The Explorer plan is free forever with full glossary access and 5 AI questions per day.' },
  { q: 'What happens when I hit the AI limit?', a: "You'll see a prompt to upgrade to Pro. Your access to the glossary and community features continues uninterrupted." },
]

export default function Pricing() {
  return (
    <div className="min-h-screen bg-mesh">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-12 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-3">Pricing</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, transparent <span className="gradient-text">pricing</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Start free, upgrade when you're ready. No hidden fees, no lock-in.
          </p>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                className={`rounded-2xl p-8 relative ${plan.highlight ? 'gradient-border' : 'glass-card'}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg shadow-purple-500/30">
                    MOST POPULAR
                  </div>
                )}

                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-xs text-gray-500 mb-5">{plan.desc}</p>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="text-gray-400 text-sm">{plan.period}</span>}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex items-center gap-2.5 text-sm">
                      {f.included
                        ? <Check size={14} className="text-purple-400 flex-shrink-0" />
                        : <X size={14} className="text-gray-600 flex-shrink-0" />
                      }
                      <span className={f.included ? 'text-gray-300' : 'text-gray-600 line-through'}>{f.text}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.href}
                  className={plan.highlight ? 'btn-primary w-full justify-center py-3' : 'btn-secondary w-full justify-center py-3'}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">Pricing FAQ</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className="glass-card rounded-xl p-5"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                viewport={{ once: true }}
              >
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

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Start free today</h2>
          <p className="text-gray-400 mb-8">No credit card required. Upgrade anytime.</p>
          <Link to="/glossary" className="btn-primary text-base px-8 py-3">
            Get Started for Free
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
