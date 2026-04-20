-- Migration 42: Elite Profile Foundation & Sync System (Self-Healing)
-- Features: dynamic_profile_data, user_skills enrichment, project_ledger, and GIN search indices.

-- 1. Repair Users Table (Ensuring architectural parity with Python backend)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='full_name') THEN
        ALTER TABLE public.users ADD COLUMN full_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='profile_data') THEN
        ALTER TABLE public.users ADD COLUMN profile_data JSONB DEFAULT '{}';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='reputation_score') THEN
        ALTER TABLE public.users ADD COLUMN reputation_score INTEGER DEFAULT 0;
    END IF;
END $$;

-- 2. Dynamic Profile Data Table (Self-Healing)
CREATE TABLE IF NOT EXISTS public.dynamic_profile_data (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    profile_data JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='dynamic_profile_data' AND column_name='user_id') THEN
        ALTER TABLE public.dynamic_profile_data ADD COLUMN user_id UUID REFERENCES public.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 3. User Skills Nexus Alignment (Enriching pre-existing records)
CREATE TABLE IF NOT EXISTS public.user_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    proficiency_level INTEGER DEFAULT 1,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, skill_name)
);
DO $$ 
BEGIN
    -- Ensure all elite columns exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_skills' AND column_name='user_id') THEN
        ALTER TABLE public.user_skills ADD COLUMN user_id UUID REFERENCES public.users(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_skills' AND column_name='verified_at') THEN
        ALTER TABLE public.user_skills ADD COLUMN verified_at TIMESTAMP WITH TIME ZONE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_skills' AND column_name='verifier_id') THEN
        ALTER TABLE public.user_skills ADD COLUMN verifier_id UUID REFERENCES public.users(id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_skills' AND column_name='proof_score') THEN
        ALTER TABLE public.user_skills ADD COLUMN proof_score FLOAT DEFAULT 0.0;
    END IF;
END $$;

-- 4. Project Ledger (Self-Healing)
CREATE TABLE IF NOT EXISTS public.project_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
DO $$ 
BEGIN
    -- Force-Inject missing columns into pre-existing ghost tables
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='project_ledger' AND column_name='user_id') THEN
        ALTER TABLE public.project_ledger ADD COLUMN user_id UUID REFERENCES public.users(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='project_ledger' AND column_name='description') THEN
        ALTER TABLE public.project_ledger ADD COLUMN description TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='project_ledger' AND column_name='stack') THEN
        ALTER TABLE public.project_ledger ADD COLUMN stack TEXT[] DEFAULT '{}';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='project_ledger' AND column_name='github_url') THEN
        ALTER TABLE public.project_ledger ADD COLUMN github_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='project_ledger' AND column_name='live_url') THEN
        ALTER TABLE public.project_ledger ADD COLUMN live_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='project_ledger' AND column_name='is_ai_verified') THEN
        ALTER TABLE public.project_ledger ADD COLUMN is_ai_verified BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='project_ledger' AND column_name='integrity_score') THEN
        ALTER TABLE public.project_ledger ADD COLUMN integrity_score FLOAT DEFAULT 0.0;
    END IF;
END $$;

-- 5. Search Nexux Optimizations
CREATE INDEX IF NOT EXISTS idx_users_profile_data_gin ON public.users USING GIN (profile_data);
CREATE INDEX IF NOT EXISTS idx_dynamic_profile_data_gin ON public.dynamic_profile_data USING GIN (profile_data);

-- 6. Helper Triggers (Reputation Synchronization)
CREATE OR REPLACE FUNCTION public.update_user_reputation_on_skill()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_verified = TRUE AND (OLD.is_verified IS NULL OR OLD.is_verified = FALSE) THEN
        UPDATE public.users 
        SET reputation_score = COALESCE(reputation_score, 0) + 50
        WHERE public.users.id = NEW.user_id; 
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_reputation_skill ON public.user_skills;
CREATE TRIGGER trg_update_reputation_skill
AFTER UPDATE ON public.user_skills
FOR EACH ROW EXECUTE FUNCTION public.update_user_reputation_on_skill();

-- RLS (Row Level Security) Boilerplate
ALTER TABLE public.dynamic_profile_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_ledger ENABLE ROW LEVEL SECURITY;

-- Policies (Explicit Scoping)
DROP POLICY IF EXISTS "Users can manage their own dynamic profile" ON public.dynamic_profile_data;
CREATE POLICY "Users can manage their own dynamic profile" ON public.dynamic_profile_data
    FOR ALL USING (auth.uid() = public.dynamic_profile_data.user_id);

DROP POLICY IF EXISTS "Users can manage their own skills" ON public.user_skills;
CREATE POLICY "Users can manage their own skills" ON public.user_skills
    FOR ALL USING (auth.uid() = public.user_skills.user_id);

DROP POLICY IF EXISTS "Users can manage their own projects" ON public.project_ledger;
CREATE POLICY "Users can manage their own projects" ON public.project_ledger
    FOR ALL USING (auth.uid() = public.project_ledger.user_id);

DROP POLICY IF EXISTS "Public can view verified skills" ON public.user_skills;
CREATE POLICY "Public can view verified skills" ON public.user_skills
    FOR SELECT USING (is_verified = TRUE);

COMMENT ON TABLE public.dynamic_profile_data IS 'High-fidelity profile metadata from the multi-step wizard.';
COMMENT ON TABLE public.user_skills IS 'Tracked technical competencies for AI Forensic Auditing.';
COMMENT ON TABLE public.project_ledger IS 'Verified proof-of-work projects and repositories.';
