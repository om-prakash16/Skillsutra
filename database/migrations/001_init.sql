CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    wallet_address TEXT PRIMARY KEY,
    profile_nft_mint TEXT,
    full_name TEXT,
    bio TEXT,
    reputation_score INTEGER DEFAULT 0,
    github_handle TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_pda TEXT UNIQUE,
    employer_wallet TEXT REFERENCES users(wallet_address),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    required_skills TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id),
    candidate_wallet TEXT REFERENCES users(wallet_address),
    on_chain_tx_sig TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ai_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id),
    match_percentage FLOAT,
    skill_gap_analysis JSONB,
    generated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id),
    referrer_wallet TEXT REFERENCES users(wallet_address),
    referred_wallet TEXT REFERENCES users(wallet_address),
    reward_claimed BOOLEAN DEFAULT FALSE
);

CREATE TABLE project_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_wallet TEXT REFERENCES users(wallet_address),
    project_name TEXT NOT NULL,
    github_link TEXT NOT NULL,
    tech_stack TEXT[],
    ai_score INTEGER,
    on_chain_hash TEXT UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE micro_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employer_wallet TEXT REFERENCES users(wallet_address),
    worker_wallet TEXT REFERENCES users(wallet_address),
    title TEXT NOT NULL,
    escrow_pda TEXT UNIQUE,
    bounty_amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'completed'
    created_at TIMESTAMP DEFAULT NOW()
);
