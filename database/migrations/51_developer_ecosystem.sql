-- Migration 51: Developer Ecosystem Core Tables
-- Add hackathon team builder, github tracking, coding challenges, and AI roadmaps.

-- 1. Profile Extensions (if not already added)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_banner TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_position VARCHAR(255);

-- 2. Saved Hackathons / Competitions
CREATE TABLE IF NOT EXISTS public.saved_competitions (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    competition_id UUID REFERENCES public.competitions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, competition_id)
);

-- 3. Teams and Members
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    competition_id UUID REFERENCES public.competitions(id) ON DELETE CASCADE,
    leader_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(competition_id, name)
);

CREATE TABLE IF NOT EXISTS public.team_members (
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role VARCHAR(100) DEFAULT 'Developer',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (team_id, user_id)
);

-- 4. GitHub Contribution Registry
CREATE TABLE IF NOT EXISTS public.github_contributions (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    github_handle VARCHAR(100) NOT NULL,
    pull_requests INTEGER DEFAULT 0,
    commits INTEGER DEFAULT 0,
    languages_json JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Coding Challenges
CREATE TABLE IF NOT EXISTS public.challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    points INTEGER DEFAULT 100,
    code_template TEXT NOT NULL,
    test_cases JSONB NOT NULL, -- e.g. [{"input": "5", "expected": "25"}]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.challenge_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'failed' CHECK (status IN ('passed', 'failed')),
    score INTEGER DEFAULT 0,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Career Roadmaps
CREATE TABLE IF NOT EXISTS public.career_roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    target_role VARCHAR(100) NOT NULL,
    nodes_json JSONB NOT NULL, -- list of roadmap milestones/tasks
    current_milestone_index INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6.5. Reputation History Table
CREATE TABLE IF NOT EXISTS public.reputation_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    total_score INTEGER DEFAULT 0,
    skills_score FLOAT DEFAULT 0.0,
    project_score FLOAT DEFAULT 0.0,
    github_score FLOAT DEFAULT 0.0,
    job_score FLOAT DEFAULT 0.0,
    web3_score FLOAT DEFAULT 0.0,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Seed initial coding challenges
INSERT INTO public.challenges (title, description, difficulty, points, code_template, test_cases)
VALUES
(
  'Square an Integer',
  'Write a function that accepts an integer `n` and returns its square value.',
  'Easy',
  50,
  'function square(n) {\n  // Write your code here\n  return n;\n}',
  '[{"input": [2], "expected": 4}, {"input": [5], "expected": 25}, {"input": [-3], "expected": 9}]'::jsonb
),
(
  'Reverse a String',
  'Write a function that accepts a string and returns it reversed.',
  'Easy',
  50,
  'function reverseString(str) {\n  // Write your code here\n  return str;\n}',
  '[{"input": ["hello"], "expected": "olleh"}, {"input": ["world"], "expected": "dlrow"}]'::jsonb
),
(
  'Fibonacci Sequence Number',
  'Write a function that returns the n-th Fibonacci number (0-indexed, where fib(0) = 0, fib(1) = 1).',
  'Medium',
  100,
  'function fib(n) {\n  // Write your code here\n  return 0;\n}',
  '[{"input": [0], "expected": 0}, {"input": [1], "expected": 1}, {"input": [6], "expected": 8}]'::jsonb
)
ON CONFLICT DO NOTHING;

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_saved_comps_user ON public.saved_competitions(user_id);
CREATE INDEX IF NOT EXISTS idx_teams_comp ON public.teams(competition_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON public.team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_attempts_user_challenge ON public.challenge_attempts(user_id, challenge_id);
CREATE INDEX IF NOT EXISTS idx_roadmaps_user ON public.career_roadmaps(user_id);
