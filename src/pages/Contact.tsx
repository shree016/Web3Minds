import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Github, Linkedin, Send, CheckCircle, AlertCircle } from 'lucide-react'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/ui/Footer'
import { supabase } from '../lib/supabase'

const subjects = [
  'General inquiry',
  'Collaboration',
  'Bug report',
  'Feedback',
  'Other',
]

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.message.length < 20) {
      setError('Message must be at least 20 characters.')
      return
    }

    setSubmitting(true)
    try {
      const { error: dbErr } = await supabase.from('contact_messages').insert({
        name: form.name,
        email: form.email,
        subject: form.subject || null,
        message: form.message,
      })

      if (dbErr) {
        console.warn('Supabase not configured (demo mode):', dbErr.message)
      }

      setSubmitted(true)
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setError('Something went wrong. Please try again or email directly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-mesh">
      <Navbar />

      <section className="pt-28 pb-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <p className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-3">Contact</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Let's <span className="gradient-text">connect</span>
            </h1>
            <p className="text-gray-400 text-lg">Have a question, want to collaborate, or just want to say hi?</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left panel */}
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div className="glass-card rounded-2xl p-8 h-full">
                <h2 className="text-xl font-bold text-white mb-6">Get in touch</h2>

                <div className="space-y-5">
                  <a
                    href="mailto:shrilaxmi016@gmail.com"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center group-hover:bg-purple-600/30 transition-colors">
                      <Mail size={18} className="text-purple-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Email</div>
                      <div className="text-sm text-gray-200 group-hover:text-purple-300 transition-colors">shrilaxmi016@gmail.com</div>
                    </div>
                  </a>

                  <a
                    href="https://github.com/shree016"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-600/20 border border-gray-500/20 flex items-center justify-center group-hover:bg-gray-600/30 transition-colors">
                      <Github size={18} className="text-gray-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">GitHub</div>
                      <div className="text-sm text-gray-200 group-hover:text-gray-100 transition-colors">github.com/shree016</div>
                    </div>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/shree016/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                      <Linkedin size={18} className="text-blue-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">LinkedIn</div>
                      <div className="text-sm text-gray-200 group-hover:text-blue-300 transition-colors">linkedin.com/in/shree016</div>
                    </div>
                  </a>
                </div>

                <div className="mt-10 p-4 bg-purple-600/10 border border-purple-500/20 rounded-xl">
                  <p className="text-xs text-gray-400">
                    ⏱ <strong className="text-gray-300">Response time:</strong> within 48 hours
                  </p>
                </div>

                <div className="mt-8">
                  <p className="text-sm text-gray-500 leading-relaxed">
                    I'm always open to discussing Web3 education, technical collaborations,
                    or just chatting about blockchain. Don't be shy!
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right panel — form */}
            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="glass-card rounded-2xl p-10 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={32} className="text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-3">Message sent!</h2>
                    <p className="text-gray-400 text-sm mb-8">
                      I'll get back to you within 48 hours. Thanks for reaching out!
                    </p>
                    <button onClick={() => setSubmitted(false)} className="btn-secondary text-sm">
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="glass-card rounded-2xl p-8 space-y-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                          Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                          placeholder="Your name"
                          className="input-dark text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                          Email <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                          placeholder="your@email.com"
                          className="input-dark text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1.5">Subject</label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                        className="input-dark text-sm"
                        style={{ background: '#13151C' }}
                      >
                        <option value="">Select a subject</option>
                        {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                        Message <span className="text-red-400">*</span>
                        <span className="text-gray-600 font-normal ml-1">(min 20 chars)</span>
                      </label>
                      <textarea
                        value={form.message}
                        onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                        placeholder="Tell me what's on your mind..."
                        className="input-dark h-36 resize-none text-sm"
                        required
                      />
                      <div className="text-xs text-gray-600 mt-1 text-right">{form.message.length} chars</div>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        <AlertCircle size={12} />
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary w-full justify-center py-3 text-sm disabled:opacity-50"
                    >
                      <Send size={14} />
                      {submitting ? 'Sending...' : 'Send Message →'}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
