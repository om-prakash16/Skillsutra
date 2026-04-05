-- 25_advanced_search_discovery.sql
-- Optimizing Candidate Discovery and Job Search with Denormalized Tables

-- 1. Search Candidates Table
DROP TABLE IF EXISTS public.search_candidates CASCADE;
CREATE TABLE IF NOT EXISTS public.search_candidates (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    full_name TEXT,
    skills TEXT[] DEFAULT '{}',
    experience_level TEXT,
    proof_score FLOAT DEFAULT 0.0,
    location TEXT,
    search_vector TSVECTOR,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Search Jobs Table
DROP TABLE IF EXISTS public.search_jobs CASCADE;
CREATE TABLE IF NOT EXISTS public.search_jobs (
    job_id UUID PRIMARY KEY REFERENCES public.jobs(id) ON DELETE CASCADE,
    title TEXT,
    skills TEXT[] DEFAULT '{}',
    salary_range TEXT,
    experience_level TEXT,
    job_type TEXT,
    search_vector TSVECTOR,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Sync Logic: Candidates
CREATE OR REPLACE FUNCTION sync_search_candidate() RETURNS trigger AS $$
BEGIN
  INSERT INTO public.search_candidates (user_id, full_name, skills, proof_score, location, experience_level, search_vector)
  SELECT 
    u.id, 
    u.full_name,
    COALESCE((SELECT array_agg(skill_name) FROM public.user_skills WHERE user_id = u.id), '{}'),
    COALESCE((SELECT proof_score FROM public.ai_scores WHERE user_id = u.id), 0.0),
    u.location,
    'Mid-Level', -- Placeholder, could be mapped from profile_data
    setweight(to_tsvector('english', coalesce(u.full_name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(u.bio, '')), 'B') ||
    setweight(to_tsvector('english', array_to_string(COALESCE((SELECT array_agg(skill_name) FROM public.user_skills WHERE user_id = u.id), '{}'), ' ')), 'A')
  FROM public.users u WHERE u.id = COALESCE(NEW.user_id, NEW.id)
  ON CONFLICT (user_id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    skills = EXCLUDED.skills,
    proof_score = EXCLUDED.proof_score,
    location = EXCLUDED.location,
    search_vector = EXCLUDED.search_vector,
    updated_at = NOW();
  RETURN NULL;
END
$$ LANGUAGE plpgsql;

-- Trigger on users change
CREATE TRIGGER tr_sync_user_to_search AFTER INSERT OR UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION sync_search_candidate();

-- Trigger on skills change
CREATE TRIGGER tr_sync_skills_to_search AFTER INSERT OR UPDATE OR DELETE ON public.user_skills
FOR EACH ROW EXECUTE FUNCTION sync_search_candidate();

-- Trigger on AI score change
CREATE TRIGGER tr_sync_ai_to_search AFTER INSERT OR UPDATE ON public.ai_scores
FOR EACH ROW EXECUTE FUNCTION sync_search_candidate();

-- 4. Sync Logic: Jobs
CREATE OR REPLACE FUNCTION sync_search_job() RETURNS trigger AS $$
BEGIN
  INSERT INTO public.search_jobs (job_id, title, skills, salary_range, experience_level, job_type, search_vector)
  VALUES (
    NEW.id,
    NEW.title,
    NEW.skills_required,
    NEW.salary_range,
    NEW.experience_level,
    NEW.job_type,
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', array_to_string(NEW.skills_required, ' ')), 'A')
  )
  ON CONFLICT (job_id) DO UPDATE SET
    title = EXCLUDED.title,
    skills = EXCLUDED.skills,
    salary_range = EXCLUDED.salary_range,
    experience_level = EXCLUDED.experience_level,
    job_type = EXCLUDED.job_type,
    search_vector = EXCLUDED.search_vector,
    updated_at = NOW();
  RETURN NULL;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_sync_job_to_search AFTER INSERT OR UPDATE ON public.jobs
FOR EACH ROW EXECUTE FUNCTION sync_search_job();

-- 5. Performance Indexing
CREATE INDEX IF NOT EXISTS idx_search_cand_skills ON public.search_candidates USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_search_cand_vector ON public.search_candidates USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_search_cand_score ON public.search_candidates(proof_score DESC);

CREATE INDEX IF NOT EXISTS idx_search_jobs_skills ON public.search_jobs USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_search_jobs_vector ON public.search_jobs USING GIN(search_vector);
