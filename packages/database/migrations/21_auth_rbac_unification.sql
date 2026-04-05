-- 21_auth_rbac_unification.sql
-- Unified Solana Wallet Auth and Multi-Tenant RBAC

-- 1. Roles & Permissions System
DROP TABLE IF EXISTS public.user_roles CASCADE; -- Drop dependent first
DROP TABLE IF EXISTS public.roles CASCADE;
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_name TEXT UNIQUE NOT NULL, -- e.g., 'CANDIDATE', 'EMPLOYER', 'MODERATOR', 'ADMIN'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed core roles
INSERT INTO public.roles (role_name, description) VALUES
('USER', 'Individual professional / candidate'),
('COMPANY', 'Organization recruiter / employer'),
('STAFF', 'Platform moderator'),
('ADMIN', 'Super administrator')
ON CONFLICT (role_name) DO NOTHING;

-- 2. User Roles Assignment
CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
);

-- 3. Multi-Tenant Company System
DROP TABLE IF EXISTS public.company_members CASCADE; -- Drop dependent first
DROP TABLE IF EXISTS public.companies CASCADE;
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT NOT NULL,
    created_by_user_id UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Company Team Membership
CREATE TABLE IF NOT EXISTS public.company_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    company_role TEXT NOT NULL DEFAULT 'VIEWER', -- e.g., 'OWNER', 'HR', 'INTERVIEWER', 'VIEWER'
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, user_id)
);

-- RLS Policies
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_members ENABLE ROW LEVEL SECURITY;

-- Visibility rules
CREATE POLICY "Public read roles" ON public.roles FOR SELECT USING (true);
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public read companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Members can view company details" ON public.companies FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.company_members WHERE company_id = id AND user_id = auth.uid())
);
CREATE POLICY "Members can view team" ON public.company_members FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.company_members cm WHERE cm.company_id = company_id AND cm.user_id = auth.uid())
);
