-- Migration 006: User Panel System
-- Adds tables and columns for the full user dashboard, profile snapshots,
-- skill quizzes, reputation history, and privacy controls.

-- Add dynamic_fields JSONB to users (if not already present)
ALTER TABLE users ADD COLUMN IF NOT EXISTS dynamic_fields JSONB DEFAULT '{}'::jsonb;
ALTER TABLE users ADD COLUMN IF NOT EXISTS current_ipfs_cid TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS privacy_settings JSONB DEFAULT '{"profile_visibility":"public","wallet_address_visible":false,"reputation_score_visible":true,"nft_credentials_visible":true,"fields":{}}'::jsonb;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS experience JSONB DEFAULT '[]'::jsonb;
ALTER TABLE users ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '[]'::jsonb;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE users ADD COLUMN IF NOT EXISTS id UUID;

-- Profile Snapshots (Metadata versioning for IPFS)
CREATE TABLE IF NOT EXISTS profile_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address TEXT REFERENCES users(wallet_address),
    version INTEGER NOT NULL,
    ipfs_cid TEXT NOT NULL,
    change_summary JSONB,
    on_chain_tx_sig TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_snapshots_wallet ON profile_snapshots(wallet_address);

-- Skill Quizzes
CREATE TABLE IF NOT EXISTS skill_quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_wallet TEXT REFERENCES users(wallet_address),
    skill_name TEXT NOT NULL,
    difficulty TEXT DEFAULT 'intermediate',
    questions JSONB NOT NULL,
    answers JSONB,
    score INTEGER,
    passed BOOLEAN DEFAULT FALSE,
    nft_mint_address TEXT,
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_quizzes_wallet ON skill_quizzes(candidate_wallet);

-- Reputation History (for trend tracking)
CREATE TABLE IF NOT EXISTS reputation_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address TEXT REFERENCES users(wallet_address),
    total_score INTEGER NOT NULL,
    skills_score FLOAT DEFAULT 0,
    project_score FLOAT DEFAULT 0,
    github_score FLOAT DEFAULT 0,
    job_score FLOAT DEFAULT 0,
    web3_score FLOAT DEFAULT 0,
    recorded_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reputation_wallet ON reputation_history(wallet_address);
CREATE INDEX IF NOT EXISTS idx_reputation_date ON reputation_history(recorded_at);

-- Application status tracking enhancements
ALTER TABLE applications ADD COLUMN IF NOT EXISTS cover_note TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS interview_date TIMESTAMP;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Project ledger enhancements
ALTER TABLE project_ledger ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE project_ledger ADD COLUMN IF NOT EXISTS live_url TEXT;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_applications_wallet ON applications(candidate_wallet);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_project_ledger_wallet ON project_ledger(candidate_wallet);
