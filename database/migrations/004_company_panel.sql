-- Migration: 004_company_panel.sql
-- Description: Adds schema for Company Profiles, Dynamic Jobs, and Applications

-- 1. Companies Table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_wallet TEXT NOT NULL REFERENCES users(wallet_address) ON DELETE CASCADE,
    name TEXT NOT NULL,
    website TEXT,
    industry TEXT,
    company_size TEXT,
    location TEXT,
    logo_url TEXT,
    about_company TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Job Schema Fields (Dynamic Schema for Jobs)
CREATE TABLE IF NOT EXISTS job_schema_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label TEXT NOT NULL,
    key TEXT NOT NULL UNIQUE, -- e.g., 'tech_stack'
    type TEXT NOT NULL, -- 'text', 'number', 'select', 'multiselect', 'date', 'file', 'url'
    required BOOLEAN DEFAULT FALSE,
    placeholder TEXT,
    options JSONB, -- For select/multiselect e.g. ["Remote", "Onsite", "Hybrid"]
    validation_rules JSONB, -- e.g., { 'min': 0, 'max': 1000000 }
    default_value TEXT,
    section_name TEXT DEFAULT 'Job Details', -- 'Basic Info', 'Requirements', 'Nice to have', etc.
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed basic job schema fields
INSERT INTO job_schema_fields (label, key, type, required, placeholder, section_name, display_order)
VALUES 
    ('Tech Stack', 'tech_stack', 'text', true, 'e.g. React, Node.js, Python', 'Requirements', 1),
    ('Team Size', 'team_size', 'number', false, 'e.g. 5', 'Company Info', 2),
    ('Project Duration', 'project_duration', 'text', false, 'e.g. 6 Months', 'Project Info', 3),
    ('Preferred Tools', 'preferred_tools', 'text', false, 'e.g. Jira, GitHub, Figma', 'Requirements', 4),
    ('Education Requirement', 'education_requirement', 'text', false, 'e.g. Bachelor in CS', 'Requirements', 5)
ON CONFLICT (key) DO NOTHING;

-- 3. Modify Jobs Table
-- Add relation to company, and allow dynamic fields.
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id) ON DELETE CASCADE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS employment_type TEXT; -- full-time, part-time, contract, internship
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS location_type TEXT; -- remote, onsite, hybrid
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_range TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS dynamic_fields JSONB DEFAULT '{}'::jsonb;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS deadline TIMESTAMP WITH TIME ZONE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS min_reputation_score INTEGER DEFAULT 0;

-- 4. Modify Applications Table
-- Assuming table already exists, we enhance the status enum/field.
-- Since it's a TEXT field currently, we can add a check or just assume backend validation.
ALTER TABLE applications ADD COLUMN IF NOT EXISTS ai_match_score DECIMAL(5,2); -- Store the score directly on application for fast querying
ALTER TABLE applications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 5. Talent Bookmarks (Talent Pool)
CREATE TABLE IF NOT EXISTS talent_bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    candidate_wallet TEXT NOT NULL REFERENCES users(wallet_address) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, candidate_wallet)
);
