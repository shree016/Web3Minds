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
