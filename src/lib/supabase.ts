import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Term = {
  id: string
  slug: string
  name: string
  category: string
  short_definition: string
  full_definition?: string
  sources?: string[]
  related_terms?: string[]
  submitter_wallet?: string
  upvotes: number
  downvotes: number
  ipfs_hash?: string
  created_at: string
  updated_at: string
}

export type TermPending = {
  id: string
  name: string
  category: string
  short_definition: string
  full_definition?: string
  sources?: string[]
  submitter_wallet: string
  ai_score?: number
  status: 'pending' | 'approved' | 'rejected'
  mod_feedback?: string
  created_at: string
}

export type UserProfile = {
  wallet_address: string
  ens_name?: string
  reputation: number
  subscription_tier: 'free' | 'pro' | 'institute'
  joined_at: string
}

export type ContactMessage = {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  created_at: string
}

// ============================================================
// Whitepaper RAG types
// ============================================================

export type Whitepaper = {
  id: string
  title: string
  author: string
  year: number
  tier: 1 | 2 | 3 | 4
  slug: string
  description: string
  pdf_url?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  unlocked_by_default: boolean
  created_at: string
}

export type WhitepaperChunk = {
  id: string
  whitepaper_id: string
  chunk_index: number
  section_title?: string
  content: string
  created_at: string
}

export type WhitepaperProgress = {
  id: string
  wallet_address: string
  whitepaper_id: string
  comprehension_level: 'surface' | 'structural' | 'deep' | 'mastery'
  surface_score: number
  structural_score: number
  deep_score: number
  mastery_score: number
  unlocked: boolean
  unlocked_at?: string
  last_read_at?: string
  updated_at: string
}

export type LessonNode = {
  id: string
  title: string
  description: string
  tier: 1 | 2 | 3 | 4
  target_whitepaper: string
  estimated_minutes: number
  key_concept: string
}

export type StudentDiagnostic = {
  id: string
  wallet_address: string
  background?: 'cs' | 'finance' | 'design' | 'other'
  prior_knowledge_level?: 'none' | 'beginner' | 'intermediate' | 'advanced'
  interest_area?: 'defi' | 'nft' | 'development' | 'investing'
  readiness_scores?: Record<string, number>
  custom_path?: LessonNode[]
  created_at: string
  updated_at: string
}

export type PathProgressRow = {
  id: string
  wallet_address: string
  lesson_id: string
  target_whitepaper_id?: string
  completed: boolean
  completed_at?: string
}
