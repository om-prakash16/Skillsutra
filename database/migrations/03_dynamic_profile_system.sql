-- 03_dynamic_profile_system.sql
-- Unified Dynamic Profile Schema Table

CREATE TABLE IF NOT EXISTS public.profile_schema_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label TEXT NOT NULL,
    key TEXT UNIQUE NOT NULL, 
    type TEXT NOT NULL, -- 'text', 'number', 'select', 'multiselect', 'date', 'file', 'url'
    required BOOLEAN DEFAULT FALSE,
    placeholder TEXT,
    validation_rules JSONB,
    default_value TEXT,
    section_name TEXT DEFAULT 'Professional Info',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed defaults for SkillProof AI
INSERT INTO public.profile_schema_fields (label, key, type, section_name, display_order) VALUES
('Full Name', 'full_name', 'text', 'Basic Info', 1),
('Professional Bio', 'bio', 'text', 'Basic Info', 2),
('GitHub Portfolio', 'github_url', 'url', 'Professional Info', 3),
('Solana Wallet', 'solana_wallet', 'text', 'Web3 Identity', 4),
('LinkedIn Profile', 'linkedin_url', 'url', 'Professional Info', 5)
ON CONFLICT (key) DO NOTHING;
