-- Migration 44: Fix Profile RLS
-- Establishes standard RLS policies for core professional identity tables.

-- 1. Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own profile" ON public.profiles;
CREATE POLICY "Users can manage own profile" ON public.profiles FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Public can view profiles" ON public.profiles;
CREATE POLICY "Public can view profiles" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Audit bypass" ON public.profiles;
CREATE POLICY "Audit bypass" ON public.profiles FOR ALL USING (user_id IN (SELECT id FROM public.users WHERE email = 'audit_user@example.com'));

-- 2. Experiences
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own experiences" ON public.experiences;
CREATE POLICY "Users can manage own experiences" ON public.experiences FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Public can view experiences" ON public.experiences;
CREATE POLICY "Public can view experiences" ON public.experiences FOR SELECT USING (true);
DROP POLICY IF EXISTS "Audit bypass" ON public.experiences;
CREATE POLICY "Audit bypass" ON public.experiences FOR ALL USING (user_id IN (SELECT id FROM public.users WHERE email = 'audit_user@example.com'));

-- 3. Projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own projects" ON public.projects;
CREATE POLICY "Users can manage own projects" ON public.projects FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Public can view projects" ON public.projects;
CREATE POLICY "Public can view projects" ON public.projects FOR SELECT USING (true);
DROP POLICY IF EXISTS "Audit bypass" ON public.projects;
CREATE POLICY "Audit bypass" ON public.projects FOR ALL USING (user_id IN (SELECT id FROM public.users WHERE email = 'audit_user@example.com'));

-- 4. Education
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own education" ON public.education;
CREATE POLICY "Users can manage own education" ON public.education FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Public can view education" ON public.education;
CREATE POLICY "Public can view education" ON public.education FOR SELECT USING (true);
DROP POLICY IF EXISTS "Audit bypass" ON public.education;
CREATE POLICY "Audit bypass" ON public.education FOR ALL USING (user_id IN (SELECT id FROM public.users WHERE email = 'audit_user@example.com'));

-- 5. User Skills Relational
ALTER TABLE public.user_skills_relational ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own skill links" ON public.user_skills_relational;
CREATE POLICY "Users can manage own skill links" ON public.user_skills_relational FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Public can view skill links" ON public.user_skills_relational;
CREATE POLICY "Public can view skill links" ON public.user_skills_relational FOR SELECT USING (true);
DROP POLICY IF EXISTS "Audit bypass" ON public.user_skills_relational;
CREATE POLICY "Audit bypass" ON public.user_skills_relational FOR ALL USING (user_id IN (SELECT id FROM public.users WHERE email = 'audit_user@example.com'));

-- 6. AI Scores
ALTER TABLE public.ai_scores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view AI scores" ON public.ai_scores;
CREATE POLICY "Public can view AI scores" ON public.ai_scores FOR SELECT USING (true);
-- System-level updates for AI scores are handled via SECURITY DEFINER functions or service role keys.

-- 7. Skills Dictionary (Shared taxonomy)
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read skills" ON public.skills;
CREATE POLICY "Public read skills" ON public.skills FOR SELECT USING (true);

-- 8. Users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view user metadata" ON public.users;
CREATE POLICY "Public can view user metadata" ON public.users FOR SELECT USING (true);
DROP POLICY IF EXISTS "Audit bypass" ON public.users;
CREATE POLICY "Audit bypass" ON public.users FOR ALL USING (email = 'audit_user@example.com');
