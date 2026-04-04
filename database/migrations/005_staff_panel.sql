-- Migration: 005_staff_panel.sql
-- Description: Role-Based Staff Panel — RBAC, Moderation, Reports, Tickets, Audit Logs
-- ──────────────────────────────────────────────────────────────────────────────────────

-- 1. Expand user roles to include 'staff'
-- Drop the old constraint and add the new one
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check
    CHECK (role IN ('talent', 'company', 'admin', 'staff'));

-- 2. Staff Roles Master Table
-- Defines the granular operational role types within the staff tier
CREATE TABLE IF NOT EXISTS staff_roles_master (
    id TEXT PRIMARY KEY, -- e.g., 'support_staff', 'moderator'
    label TEXT NOT NULL,
    description TEXT,
    permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
    -- permissions array e.g. ["view_users", "flag_user", "resolve_report"]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed role definitions
INSERT INTO staff_roles_master (id, label, description, permissions)
VALUES
    ('support_staff',       'Support Staff',        'Handle user queries and profile issues.',
        '["view_users","view_tickets","resolve_ticket","send_message"]'),
    ('moderator',           'Moderator',            'Review reported profiles and jobs.',
        '["view_users","view_jobs","flag_user","flag_job","view_reports","resolve_report","warn_user","escalate_report"]'),
    ('verification_staff',  'Verification Staff',   'Review skill validation requests.',
        '["view_users","view_skill_nfts","approve_skill","request_retest","flag_fake_skill"]'),
    ('recruitment_staff',   'Recruitment Staff',    'Assist companies with job postings.',
        '["view_jobs","approve_job","flag_job","view_users"]'),
    ('content_staff',       'Content Staff',        'Manage skill categories and taxonomy.',
        '["view_skills_taxonomy","edit_skills_taxonomy"]')
ON CONFLICT (id) DO NOTHING;

-- 3. Staff Permissions (assignment table)
-- Maps a staff wallet to their granular roles
CREATE TABLE IF NOT EXISTS staff_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_wallet TEXT NOT NULL REFERENCES users(wallet_address) ON DELETE CASCADE,
    role_id TEXT NOT NULL REFERENCES staff_roles_master(id) ON DELETE CASCADE,
    granted_by TEXT REFERENCES users(wallet_address), -- admin wallet who granted the role
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(staff_wallet, role_id)
);

-- 4. User Reports
-- Users can report fake profiles, plagiarism, suspicious behaviour
CREATE TABLE IF NOT EXISTS user_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_wallet TEXT REFERENCES users(wallet_address) ON DELETE SET NULL,
    reported_wallet TEXT NOT NULL REFERENCES users(wallet_address) ON DELETE CASCADE,
    report_type TEXT NOT NULL CHECK (report_type IN ('fake_profile','plagiarized_project','suspicious_activity','harassment','other')),
    reason TEXT NOT NULL,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low','normal','high','critical')),
    status TEXT DEFAULT 'open' CHECK (status IN ('open','in_review','resolved','dismissed')),
    assigned_to TEXT REFERENCES users(wallet_address), -- staff wallet
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Job Reports
-- Users can report spam or fake job postings
CREATE TABLE IF NOT EXISTS job_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_wallet TEXT REFERENCES users(wallet_address) ON DELETE SET NULL,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    report_type TEXT NOT NULL CHECK (report_type IN ('spam','fake_company','misleading','scam','other')),
    reason TEXT NOT NULL,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low','normal','high','critical')),
    status TEXT DEFAULT 'open' CHECK (status IN ('open','in_review','resolved','dismissed')),
    assigned_to TEXT REFERENCES users(wallet_address),
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Skill Verification Flags
-- Staff can flag suspicious skill NFT verifications for re-review
CREATE TABLE IF NOT EXISTS skill_verification_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nft_mint TEXT NOT NULL,              -- The Solana NFT mint address
    candidate_wallet TEXT REFERENCES users(wallet_address) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    flag_reason TEXT NOT NULL CHECK (flag_reason IN ('ai_score_mismatch','github_suspicious','duplicate_cert','invalid_proof','manual_review')),
    status TEXT DEFAULT 'flagged' CHECK (status IN ('flagged','approved','rejected','retest_requested')),
    flagged_by TEXT REFERENCES users(wallet_address), -- staff wallet
    reviewed_by TEXT REFERENCES users(wallet_address),
    review_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submitter_wallet TEXT REFERENCES users(wallet_address) ON DELETE SET NULL,
    category TEXT NOT NULL CHECK (category IN ('profile_issue','wallet_connection','nft_sync','job_application','other')),
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','closed')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
    assigned_to TEXT REFERENCES users(wallet_address), -- staff wallet
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Staff Audit Logs
-- Every action taken by any staff member is immutably logged here
CREATE TABLE IF NOT EXISTS staff_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_wallet TEXT NOT NULL REFERENCES users(wallet_address) ON DELETE CASCADE,
    action TEXT NOT NULL,           -- e.g., 'flag_user', 'resolve_report', 'approve_skill'
    target_type TEXT NOT NULL,      -- e.g., 'user', 'job', 'report', 'ticket', 'skill_nft'
    target_id TEXT NOT NULL,        -- ID or wallet of the affected entity
    metadata JSONB DEFAULT '{}'::jsonb, -- Extra context (reason, notes, diff)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast audit log querying by staff
CREATE INDEX IF NOT EXISTS idx_audit_logs_staff ON staff_audit_logs(staff_wallet);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target ON staff_audit_logs(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_user_reports_status ON user_reports(status, priority);
CREATE INDEX IF NOT EXISTS idx_job_reports_status ON job_reports(status, priority);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status, assigned_to);
