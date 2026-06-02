-- ============================================================
-- Web3Minds — RAG Whitepaper Engine Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Enable pgvector extension
create extension if not exists vector;

-- ============================================================
-- Whitepaper library
-- ============================================================
create table if not exists whitepapers (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  author text not null,
  year integer not null,
  tier integer not null check (tier between 1 and 4),
  slug text unique not null,
  description text,
  pdf_url text,
  difficulty text default 'intermediate' check (difficulty in ('beginner', 'intermediate', 'advanced')),
  unlocked_by_default boolean default false,
  created_at timestamp with time zone default now()
);

-- ============================================================
-- Whitepaper text chunks (for RAG vector search)
-- ============================================================
create table if not exists whitepaper_chunks (
  id uuid default gen_random_uuid() primary key,
  whitepaper_id uuid references whitepapers(id) on delete cascade,
  chunk_index integer not null,
  section_title text,
  content text not null,
  embedding vector(384),
  created_at timestamp with time zone default now()
);

-- Index for fast similarity search
create index if not exists whitepaper_chunks_embedding_idx
  on whitepaper_chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- ============================================================
-- Vector similarity search function
-- ============================================================
create or replace function match_whitepaper_chunks(
  query_embedding vector(384),
  match_threshold float default 0.6,
  match_count int default 5
)
returns table (
  id uuid,
  whitepaper_id uuid,
  content text,
  section_title text,
  similarity float
)
language sql stable
as $$
  select
    whitepaper_chunks.id,
    whitepaper_chunks.whitepaper_id,
    whitepaper_chunks.content,
    whitepaper_chunks.section_title,
    1 - (whitepaper_chunks.embedding <=> query_embedding) as similarity
  from whitepaper_chunks
  where 1 - (whitepaper_chunks.embedding <=> query_embedding) > match_threshold
  order by whitepaper_chunks.embedding <=> query_embedding
  limit match_count;
$$;

-- ============================================================
-- Student whitepaper progress
-- ============================================================
create table if not exists whitepaper_progress (
  id uuid default gen_random_uuid() primary key,
  wallet_address text not null,
  whitepaper_id uuid references whitepapers(id) on delete cascade,
  comprehension_level text default 'surface' check (comprehension_level in ('surface', 'structural', 'deep', 'mastery')),
  surface_score integer default 0,
  structural_score integer default 0,
  deep_score integer default 0,
  mastery_score integer default 0,
  unlocked boolean default false,
  unlocked_at timestamp with time zone,
  last_read_at timestamp with time zone,
  updated_at timestamp with time zone default now(),
  unique(wallet_address, whitepaper_id)
);

-- ============================================================
-- Student diagnostic results (personalised learning path)
-- ============================================================
create table if not exists student_diagnostics (
  id uuid default gen_random_uuid() primary key,
  wallet_address text not null unique,
  background text check (background in ('cs', 'finance', 'design', 'other')),
  prior_knowledge_level text check (prior_knowledge_level in ('none', 'beginner', 'intermediate', 'advanced')),
  interest_area text check (interest_area in ('defi', 'nft', 'development', 'investing')),
  readiness_scores jsonb,
  custom_path jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================================
-- Student lesson progress (path nodes)
-- ============================================================
create table if not exists path_progress (
  id uuid default gen_random_uuid() primary key,
  wallet_address text not null,
  lesson_id text not null,
  target_whitepaper_id uuid references whitepapers(id),
  completed boolean default false,
  completed_at timestamp with time zone,
  unique(wallet_address, lesson_id)
);

-- ============================================================
-- Mini-whitepaper capstone (Pro feature)
-- ============================================================
create table if not exists student_whitepapers (
  id uuid default gen_random_uuid() primary key,
  wallet_address text not null,
  title text,
  problem_statement text,
  proposed_solution text,
  technical_design text,
  tradeoffs text,
  "references" jsonb,
  ai_feedback jsonb,
  status text default 'draft' check (status in ('draft', 'submitted')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================================
-- RLS Policies — public read for library, wallet-gated writes
-- ============================================================
alter table whitepapers enable row level security;
alter table whitepaper_chunks enable row level security;
alter table whitepaper_progress enable row level security;
alter table student_diagnostics enable row level security;
alter table path_progress enable row level security;
alter table student_whitepapers enable row level security;

-- Whitepapers: anyone can read
create policy "Public can read whitepapers"
  on whitepapers for select using (true);

-- Chunks: anyone can read (needed for RAG queries from browser)
create policy "Public can read whitepaper chunks"
  on whitepaper_chunks for select using (true);

-- Progress: users can read/write their own rows
create policy "Users can read own whitepaper progress"
  on whitepaper_progress for select using (true);
create policy "Users can upsert own whitepaper progress"
  on whitepaper_progress for insert with check (true);
create policy "Users can update own whitepaper progress"
  on whitepaper_progress for update using (true);

create policy "Users can read own diagnostic"
  on student_diagnostics for select using (true);
create policy "Users can upsert own diagnostic"
  on student_diagnostics for insert with check (true);
create policy "Users can update own diagnostic"
  on student_diagnostics for update using (true);

create policy "Users can read own path progress"
  on path_progress for select using (true);
create policy "Users can upsert own path progress"
  on path_progress for insert with check (true);
create policy "Users can update own path progress"
  on path_progress for update using (true);

create policy "Users can manage own student whitepapers"
  on student_whitepapers for all using (true);

-- ============================================================
-- Seed data: Whitepaper library
-- ============================================================
insert into whitepapers (title, author, year, tier, slug, description, pdf_url, difficulty, unlocked_by_default)
values
  (
    'Bitcoin: A Peer-to-Peer Electronic Cash System',
    'Satoshi Nakamoto', 2008, 1, 'bitcoin',
    'The original paper that started it all. 9 pages. Explains the double-spend problem and how a decentralised chain of blocks solves it.',
    'https://bitcoin.org/bitcoin.pdf', 'beginner', true
  ),
  (
    'Ethereum: A Next-Generation Smart Contract and Decentralised Application Platform',
    'Vitalik Buterin', 2013, 2, 'ethereum',
    'Vitalik''s original vision for a programmable blockchain. Introduces smart contracts, the EVM, and gas.',
    'https://ethereum.org/content/whitepaper/whitepaper-pdf/Ethereum_White_Paper_-_Buterin_2014.pdf', 'intermediate', false
  ),
  (
    'Uniswap v2 Core',
    'Hayden Adams et al.', 2020, 3, 'uniswap-v2',
    'How automated market makers (AMMs) work. Explains the x*y=k formula and how liquidity pools replace order books.',
    'https://uniswap.org/whitepaper.pdf', 'intermediate', false
  ),
  (
    'The Bitcoin Lightning Network',
    'Joseph Poon & Thaddeus Dryja', 2016, 3, 'lightning-network',
    'Bitcoin''s Layer 2 scaling solution. Explains payment channels and how to route payments off-chain.',
    'https://lightning.network/lightning-network-paper.pdf', 'advanced', false
  ),
  (
    'Ethereum Smart Contract Security Best Practices',
    'ConsenSys Diligence', 2016, 3, 'smart-contract-security',
    'What goes wrong with smart contracts. Covers reentrancy, the DAO attack, and how to write safer on-chain code.',
    'https://consensys.github.io/smart-contract-best-practices/', 'intermediate', false
  ),
  (
    'Zerocash: Decentralised Anonymous Payments',
    'Ben-Sasson et al.', 2014, 4, 'zerocash',
    'The foundational paper for ZK-proof based privacy on blockchains. The cryptographic origin of Zcash.',
    'https://eprint.iacr.org/2014/349.pdf', 'advanced', false
  )
on conflict (slug) do nothing;
