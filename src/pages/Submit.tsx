import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertTriangle, AlertCircle, Loader, Edit3, Plus, X } from 'lucide-react'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/ui/Footer'
import { checkDefinition, type DefinitionCheck } from '../lib/gemini'
import { supabase } from '../lib/supabase'

const categories = [
  'Core Concepts', 'DeFi', 'NFTs', 'Layer 2', 'DAOs',
  'Wallets', 'Staking', 'Bridges', 'Tokenomics', 'Security', 'Other',
]

function CheckBadge({ check }: { check: DefinitionCheck | null }) {
  if (!check) return null
  const good = check.score >= 70 && check.accurate && check.clear
  const medium = check.score >= 40
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-2 p-3 rounded-lg border text-xs mt-2 ${
        good
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          : medium
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          : 'bg-red-500/10 border-red-500/30 text-red-300'
      }`}
    >
      {good ? <CheckCircle size={14} className="flex-shrink-0 mt-0.5" /> : <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />}
      <div>
        <span className="font-semibold mr-1">
          {good ? '✓ Looks good!' : medium ? '⚠ Needs improvement' : '✗ Major issues'}
        </span>
        {check.feedback} (Score: {check.score}/100)
      </div>
    </motion.div>
  )
}

export default function Submit() {
  const [form, setForm] = useState({
    name: '',
    category: '',
    short_definition: '',
    full_definition: '',
    sources: '',
  })
  const [relatedTags, setRelatedTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  const [aiCheck, setAiCheck] = useState<DefinitionCheck | null>(null)
  const [checking, setChecking] = useState(false)
  const checkTimer = useRef<ReturnType<typeof setTimeout>>()

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  // Debounced AI check when name + definition are filled
  useEffect(() => {
    if (!form.name || form.short_definition.length < 20) {
      setAiCheck(null)
      return
    }
    clearTimeout(checkTimer.current)
    setChecking(true)
    checkTimer.current = setTimeout(async () => {
      try {
        const result = await checkDefinition(form.name, form.short_definition)
        setAiCheck(result)
      } catch {
        setAiCheck(null)
      } finally {
        setChecking(false)
      }
    }, 1200)
    return () => clearTimeout(checkTimer.current)
  }, [form.name, form.short_definition])

  function addTag() {
    const t = tagInput.trim()
    if (t && !relatedTags.includes(t)) setRelatedTags((p) => [...p, t])
    setTagInput('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name || !form.category || !form.short_definition) {
      setError('Please fill in all required fields.')
      return
    }

    setSubmitting(true)
    try {
      const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      const { error: dbErr } = await supabase.from('terms_pending').insert({
        name: form.name,
        category: form.category,
        short_definition: form.short_definition,
        full_definition: form.full_definition || null,
        sources: form.sources ? form.sources.split('\n').filter(Boolean) : [],
        submitter_wallet: 'anonymous',
        ai_score: aiCheck?.score ?? null,
        status: 'pending',
      })

      if (dbErr) {
        // If Supabase not configured, still show success for demo
        console.warn('Supabase error (demo mode):', dbErr.message)
      }

      setSubmitted(true)
      setForm({ name: '', category: '', short_definition: '', full_definition: '', sources: '' })
      setRelatedTags([])
      setAiCheck(null)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-mesh">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 pt-28 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-3">Contribute</p>
          <h1 className="text-4xl font-bold text-white mb-3">
            Submit a <span className="gradient-text">Term</span>
          </h1>
          <p className="text-gray-400 mb-10">
            Help the community grow. Submit a Web3 definition and our AI will review it before it goes live.
          </p>
        </motion.div>

        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center mb-8"
            >
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-xl font-bold text-emerald-300 mb-2">Term submitted!</h2>
              <p className="text-sm text-gray-400">
                Your definition is under review. It'll appear in the glossary once approved by the community.
              </p>
              <button onClick={() => setSubmitted(false)} className="btn-primary mt-6 text-sm">
                Submit another
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {!submitted && (
          <motion.form
            onSubmit={handleSubmit}
            className="glass-card rounded-2xl p-8 space-y-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Term name */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Term Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Flash Loan"
                className="input-dark"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className="input-dark"
                style={{ background: '#13151C' }}
                required
              >
                <option value="">Select a category</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Short definition */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Short Definition <span className="text-red-400">*</span>
                <span className="text-gray-500 font-normal ml-2">(max 150 chars, shown on cards)</span>
              </label>
              <textarea
                value={form.short_definition}
                onChange={(e) => setForm((p) => ({ ...p, short_definition: e.target.value.slice(0, 150) }))}
                placeholder="A concise, beginner-friendly definition..."
                className="input-dark h-24 resize-none"
                required
              />
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-600">{form.short_definition.length}/150</span>
                {checking && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Loader size={10} className="animate-spin" /> AI checking...
                  </span>
                )}
              </div>
              <CheckBadge check={aiCheck} />
            </div>

            {/* Full definition */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Full Definition
                <span className="text-gray-500 font-normal ml-2">(optional, detailed explanation)</span>
              </label>
              <textarea
                value={form.full_definition}
                onChange={(e) => setForm((p) => ({ ...p, full_definition: e.target.value }))}
                placeholder="Provide a comprehensive explanation with context, examples, and nuance..."
                className="input-dark h-40 resize-none"
              />
            </div>

            {/* Related terms */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Related Terms</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                  placeholder="Type a term and press Enter"
                  className="input-dark flex-1"
                />
                <button type="button" onClick={addTag} className="btn-secondary px-3 py-2">
                  <Plus size={16} />
                </button>
              </div>
              {relatedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {relatedTags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs">
                      {tag}
                      <button onClick={() => setRelatedTags((p) => p.filter((t) => t !== tag))}>
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Sources */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Sources / References
                <span className="text-gray-500 font-normal ml-2">(one URL per line)</span>
              </label>
              <textarea
                value={form.sources}
                onChange={(e) => setForm((p) => ({ ...p, sources: e.target.value }))}
                placeholder="https://ethereum.org/en/defi/&#10;https://docs.uniswap.org/"
                className="input-dark h-20 resize-none font-mono text-xs"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full justify-center py-3 text-base disabled:opacity-50"
            >
              <Edit3 size={16} />
              {submitting ? 'Submitting...' : 'Submit for Review →'}
            </button>

            <p className="text-xs text-gray-600 text-center">
              Your submission will be reviewed by AI and community moderators before going live.
            </p>
          </motion.form>
        )}
      </div>

      <Footer />
    </div>
  )
}
