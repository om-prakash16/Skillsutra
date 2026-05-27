-- ==============================================================================
-- Enterprise Search Indexes & Anti-Abuse Optimization (pgvector & FTS)
-- ==============================================================================
-- Run this migration manually or integrate it into Alembic.

-- 1. Enable pgvector if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;
-- 2. Enable pg_trgm for fast autocomplete / ILIKE fallbacks
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ==============================================================================
-- EMBEDDING VECTORS (HNSW Indexes for Fast Approximate Nearest Neighbor)
-- ==============================================================================
-- Note: Assuming embeddings are 768 dimensions (from Google text-embedding-004)

-- Add embedding column to Profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS embedding vector(768);
CREATE INDEX IF NOT EXISTS idx_profiles_embedding 
ON profiles USING hnsw (embedding vector_cosine_ops);

-- Add embedding column to Jobs
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS embedding vector(768);
CREATE INDEX IF NOT EXISTS idx_jobs_embedding 
ON jobs USING hnsw (embedding vector_cosine_ops);

-- Add embedding column to Gigs
ALTER TABLE gigs ADD COLUMN IF NOT EXISTS embedding vector(768);
CREATE INDEX IF NOT EXISTS idx_gigs_embedding 
ON gigs USING hnsw (embedding vector_cosine_ops);


-- ==============================================================================
-- FULL TEXT SEARCH (tsvector)
-- ==============================================================================
-- Users/Profiles FTS
ALTER TABLE users ADD COLUMN IF NOT EXISTS search_vector tsvector
    GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(username, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(email, '')), 'B')
    ) STORED;

CREATE INDEX IF NOT EXISTS idx_users_fts ON users USING GIN (search_vector);

-- Jobs FTS
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS search_vector tsvector
    GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(description_markdown, '')), 'B')
    ) STORED;

CREATE INDEX IF NOT EXISTS idx_jobs_fts ON jobs USING GIN (search_vector);

-- Forum Posts FTS
ALTER TABLE forum_posts ADD COLUMN IF NOT EXISTS search_vector tsvector
    GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(content, '')), 'B')
    ) STORED;

CREATE INDEX IF NOT EXISTS idx_forum_posts_fts ON forum_posts USING GIN (search_vector);


-- ==============================================================================
-- COMPOSITE INDEXES FOR FILTERING
-- ==============================================================================
-- Used heavily by hybrid search when filtering BEFORE vector search

-- Jobs filtering: Active jobs by creation date
CREATE INDEX IF NOT EXISTS idx_jobs_status_created 
ON jobs (status, created_at DESC) 
WHERE status = 'OPEN';

-- User matching: Open to work candidates
CREATE INDEX IF NOT EXISTS idx_profiles_open_to_work 
ON profiles (user_id) 
WHERE open_to_work = true;

-- Skills graph traversal / matching
CREATE INDEX IF NOT EXISTS idx_user_skills_user_skill 
ON user_skill_nodes (user_id, skill_id);

CREATE INDEX IF NOT EXISTS idx_user_skills_skill 
ON user_skill_nodes (skill_id);

-- Trending / Engagement
CREATE INDEX IF NOT EXISTS idx_posts_likes_created 
ON posts (created_at DESC, likes_count DESC)
WHERE deleted_at IS NULL;

-- Applications lookup (recruiter dashboard)
CREATE INDEX IF NOT EXISTS idx_applications_job_status 
ON applications (job_id, status);


-- ==============================================================================
-- AUTOCOMPLETE (pg_trgm Fallback if Redis is down)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_skill_taxonomy_trgm 
ON skill_taxonomy USING gin (name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_companies_name_trgm 
ON companies USING gin (name gin_trgm_ops);
