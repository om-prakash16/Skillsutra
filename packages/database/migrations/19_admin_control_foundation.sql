-- 19_admin_control_foundation.sql
-- Foundation Schema-Driven Admin Control System

-- 1. Admin Roles & Users
DROP TABLE IF EXISTS public.admin_users CASCADE;
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'SUPER_ADMIN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Profile Schema Builder
DROP TABLE IF EXISTS public.profile_schema CASCADE;
CREATE TABLE IF NOT EXISTS public.profile_schema (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field_name TEXT UNIQUE NOT NULL,
    field_label TEXT NOT NULL,
    field_type TEXT NOT NULL, -- e.g., 'text', 'textarea', 'number', 'url', 'select', 'multi-select', 'date', 'file'
    section TEXT NOT NULL,
    required BOOLEAN DEFAULT FALSE,
    validation_rules JSONB,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed profile schema
INSERT INTO public.profile_schema (field_name, field_label, field_type, section, required, display_order) VALUES
('github_url', 'GitHub URL', 'url', 'Links', FALSE, 1),
('portfolio_url', 'Portfolio URL', 'url', 'Links', FALSE, 2),
('years_of_experience', 'Years of Experience', 'number', 'Experience', TRUE, 1),
('primary_skills', 'Primary Skills', 'multi-select', 'Skills', TRUE, 1),
('education_level', 'Education Level', 'select', 'Basic Info', FALSE, 3)
ON CONFLICT (field_name) DO NOTHING;

-- 3. Skills Taxonomy Manager
DROP TABLE IF EXISTS public.skill_categories CASCADE;
CREATE TABLE IF NOT EXISTS public.skill_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name TEXT NOT NULL,
    parent_id UUID REFERENCES public.skill_categories(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(category_name, parent_id)
);

-- 4. Job Category Manager
DROP TABLE IF EXISTS public.job_categories CASCADE;
CREATE TABLE IF NOT EXISTS public.job_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed job categories
INSERT INTO public.job_categories (category_name) VALUES
('Frontend Developer'), ('Backend Developer'), ('AI Engineer'), ('Data Scientist')
ON CONFLICT (category_name) DO NOTHING;

-- 6. Platform Settings (AI Config, etc)
DROP TABLE IF EXISTS public.platform_settings CASCADE;
CREATE TABLE IF NOT EXISTS public.platform_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed platform settings
INSERT INTO public.platform_settings (setting_key, setting_value) VALUES
('skill_weight', '0.40'),
('github_weight', '0.30'),
('project_weight', '0.20'),
('experience_weight', '0.10')
ON CONFLICT (setting_key) DO NOTHING;

-- RLS Policies
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_schema ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read for these structural tables since UI needs them to render
CREATE POLICY "Public read profile_schema" ON public.profile_schema FOR SELECT USING (true);
CREATE POLICY "Public read skill_categories" ON public.skill_categories FOR SELECT USING (true);
CREATE POLICY "Public read job_categories" ON public.job_categories FOR SELECT USING (true);
CREATE POLICY "Public read platform_settings" ON public.platform_settings FOR SELECT USING (true);

-- Admin write policies - relying on service role token from backend for admin functions
