-- 48_career_courses_system.sql
-- Infrastructure for Career Path Bridging and Course Recommendations

BEGIN;

CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    provider TEXT, -- Coursera, Udemy, Internal, etc.
    url TEXT,
    skills_taught TEXT[] DEFAULT '{}',
    difficulty_level TEXT, -- Beginner, Intermediate, Advanced
    duration_hours INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for skill-based course lookup
CREATE INDEX IF NOT EXISTS idx_courses_skills ON public.courses USING GIN (skills_taught);

-- Seed some initial "Bridge Courses" for common tech stacks
INSERT INTO public.courses (title, provider, skills_taught, difficulty_level)
VALUES 
('Mastering FastAPI & Real-time APIs', 'Skillsutra Academy', ARRAY['FastAPI', 'Python', 'WebSockets'], 'Intermediate'),
('Solana Smart Contract Development', 'Solana Foundation', ARRAY['Rust', 'Solana', 'Anchor'], 'Advanced'),
('Next.js 14 Masterclass', 'Vercel', ARRAY['Next.js', 'React', 'TypeScript'], 'Beginner'),
('DevOps for Scale', 'Internal', ARRAY['Docker', 'Kubernetes', 'CI/CD'], 'Advanced');

COMMIT;
