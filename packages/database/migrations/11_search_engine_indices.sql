-- 11_search_engine_indices.sql
-- High-Performance Search and Filter Infrastructure

-- 0. Repair User Schema (ensure search-critical columns exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'username') THEN
        ALTER TABLE public.users ADD COLUMN username TEXT UNIQUE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'bio') THEN
        ALTER TABLE public.users ADD COLUMN bio TEXT;
    END IF;
END $$;

-- 1. Job Search vector & Indexing
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS search_vector TSVECTOR;

-- Trigger to update search vector on insert/update
CREATE OR REPLACE FUNCTION jobs_search_vector_trigger() RETURNS trigger AS $$
BEGIN
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.description, '')), 'B') ||
    setweight(to_tsvector('english', array_to_string(new.required_skills, ' ')), 'A');
  return new;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_jobs_search_vector_update BEFORE INSERT OR UPDATE
ON public.jobs FOR EACH ROW EXECUTE FUNCTION jobs_search_vector_trigger();

-- GIN Index for Full Text Search
CREATE INDEX IF NOT EXISTS idx_jobs_search_vector ON public.jobs USING GIN(search_vector);
-- GIN Index for Skill overlaps
CREATE INDEX IF NOT EXISTS idx_jobs_required_skills_gin ON public.jobs USING GIN(required_skills);

-- 2. Candidate Discovery View (Denormalized)
CREATE OR REPLACE VIEW public.search_candidates_view AS
SELECT 
    u.id as user_id,
    u.username,
    u.reputation_score,
    u.bio,
    array_agg(distinct us.skill_name) as skills,
    (
        SELECT count(*) 
        FROM professional_experience pe 
        WHERE pe.user_id = u.id
    ) as experience_count,
    -- Simple search vector for candidates
    setweight(to_tsvector('english', coalesce(u.username, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(u.bio, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(array_agg(distinct us.skill_name), ' '), '')), 'A') as search_vector
FROM 
    public.users u
LEFT JOIN 
    public.user_skills us ON u.id = us.user_id
GROUP BY 
    u.id, u.username, u.reputation_score, u.bio;

-- 3. pgvector placeholder (If extension exists)
-- Uncomment for production if pgvector is enabled in Supabase
-- CREATE INDEX IF NOT EXISTS idx_users_embedding ON public.users USING ivfflat (embedding vector_cosine_ops);

-- 4. Sorting & Filter Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_users_reputation ON public.users(reputation_score DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at_desc ON public.jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_active_salary ON public.jobs(salary_range) WHERE is_active = TRUE;
