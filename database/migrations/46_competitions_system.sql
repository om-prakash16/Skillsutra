-- Migration: 46_competitions_system.sql
-- Description: Create tables for competitions/hackathons and user preferences.

CREATE TABLE IF NOT EXISTS competitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    comp_type VARCHAR(50) NOT NULL, -- 'hackathon', 'bounty', 'grant'
    skills_required JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(50) DEFAULT 'open', -- 'open', 'closed', 'upcoming'
    deadline TIMESTAMP WITH TIME ZONE,
    url VARCHAR(255),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_competition_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    interested_types JSONB DEFAULT '[]'::jsonb,
    preferred_skills JSONB DEFAULT '[]'::jsonb,
    receive_notifications BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_competition_preferences ENABLE ROW LEVEL SECURITY;

-- Competitions are public to view
CREATE POLICY "Competitions are public" 
ON competitions FOR SELECT 
USING (true);

-- Only admins or creators can insert/update (simplified for now to allow authenticated users)
CREATE POLICY "Authenticated users can create competitions" 
ON competitions FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- User preferences policies
CREATE POLICY "Users can view their own preferences" 
ON user_competition_preferences FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" 
ON user_competition_preferences FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
ON user_competition_preferences FOR UPDATE 
USING (auth.uid() = user_id);
