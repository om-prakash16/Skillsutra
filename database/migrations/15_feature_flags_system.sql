-- 15_feature_flags_system.sql
-- Platform-wide Dynamic Feature Management

-- 1. Feature Registry
DROP TABLE IF EXISTS public.feature_flags CASCADE;
CREATE TABLE public.feature_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feature_name TEXT UNIQUE NOT NULL, 
    is_enabled BOOLEAN DEFAULT FALSE,
    category TEXT NOT NULL CHECK (category IN ('ai', 'web3', 'marketplace', 'advanced', 'experiment')),
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id)
) ;

-- 2. Security & RBAC
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- Policy: Public Read (Frontend needs to check features)
CREATE POLICY "Public can view feature status" 
ON public.feature_flags FOR SELECT 
USING (TRUE);

-- Policy: Admin Update Only
CREATE POLICY "Admins can update feature flags" 
ON public.feature_flags FOR UPDATE 
USING (EXISTS (
    SELECT 1 FROM public.staff_assignments sa
    JOIN public.staff_roles sr ON sa.role_id = sr.id
    WHERE sa.user_id = auth.uid() AND sr.role_name IN ('admin', 'superadmin')
));

-- 3. Seed Defaults for Hackathon / Production Launch
INSERT INTO public.feature_flags (feature_name, is_enabled, category, description) VALUES 
-- AI Features
('enable_ai_resume_analysis', TRUE, 'ai', 'Automated extraction of skills and history from uploaded PDFs.'),
('enable_ai_job_matching', TRUE, 'ai', 'Orchestrates Gemini 1.5 resonance scoring for job applications.'),
('enable_skill_gap_analysis', TRUE, 'ai', 'AI-driven identification of missing professional skills.'),
-- Web3 Features
('enable_profile_nft', FALSE, 'web3', 'Sovereign identity anchoring via NFT profiles.'),
('enable_skill_nft', FALSE, 'web3', 'Minting of on-chain skill verification badges on Solana.'),
('enable_metadata_sync', FALSE, 'web3', 'Real-time synchronization of profile data to IPFS/Arweave.'),
-- Marketplace Features
('enable_job_posting', TRUE, 'marketplace', 'Core capability for companies to create new listings.'),
('enable_job_application', TRUE, 'marketplace', 'Enables candidates to apply for active job listings.'),
('enable_candidate_search', TRUE, 'marketplace', 'Recruiter discovery engine for verified talent.'),
-- Advanced Features
('enable_semantic_search', FALSE, 'advanced', 'Vector-based talent discovery using RAG infrastructure.'),
('enable_ai_interview_questions', FALSE, 'advanced', 'Dynamic generation of technical interview prompts.')
ON CONFLICT (feature_name) DO UPDATE SET 
    category = EXCLUDED.category,
    description = EXCLUDED.description;

-- 4. Audit Trigger
CREATE OR REPLACE FUNCTION log_feature_change() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.staff_action_logs (staff_user_id, target_id, target_type, action_description)
    VALUES (
        COALESCE(NEW.updated_by, auth.uid()),
        NEW.id,
        'feature_flag',
        'Updated feature ' || NEW.feature_name || ' status to ' || NEW.is_enabled
    );
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_feature_change
AFTER UPDATE ON public.feature_flags
FOR EACH ROW EXECUTE FUNCTION log_feature_change();
