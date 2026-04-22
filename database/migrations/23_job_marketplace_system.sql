-- 23_job_marketplace_system.sql
-- AI-Assisted Job Marketplace and SaaS Application System

-- 1. Job Postings Table
DROP TABLE IF EXISTS public.jobs CASCADE;
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    skills_required TEXT[] DEFAULT '{}',
    experience_level TEXT,
    salary_range TEXT,
    job_type TEXT DEFAULT 'remote', -- remote, onsite, hybrid
    location TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Job Applications Table
DROP TABLE IF EXISTS public.applications CASCADE;
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'applied', -- applied, shortlisted, interview, hired, rejected
    ai_match_score FLOAT DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SaaS Data Isolation (RLS)
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- 4. Visibility Policies
-- Public: Can view all active jobs
CREATE POLICY "Public read active jobs" ON public.jobs 
FOR SELECT USING (is_active = TRUE);

-- Recruiters: Manage own company jobs
CREATE POLICY "Recruiters manage own jobs" ON public.jobs
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.company_members 
        WHERE company_id = jobs.company_id AND user_id = auth.uid()
    )
);

-- Candidates: View own applications
CREATE POLICY "Candidates view own apps" ON public.applications
FOR SELECT USING (candidate_id = auth.uid());

-- Recruiters: View applications for own jobs
CREATE POLICY "Recruiters view applications" ON public.applications
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.jobs 
        JOIN public.company_members ON jobs.company_id = company_members.company_id
        WHERE jobs.id = applications.job_id AND company_members.user_id = auth.uid()
    )
);

-- Recruiters: Update application status
CREATE POLICY "Recruiters update app status" ON public.applications
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.jobs 
        JOIN public.company_members ON jobs.company_id = company_members.company_id
        WHERE jobs.id = applications.job_id AND company_members.user_id = auth.uid()
    )
);

-- 5. Performance Indexing
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON public.jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_apps_job_id ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_apps_candidate_id ON public.applications(candidate_id);
