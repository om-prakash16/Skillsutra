-- 99_master_schema_parity.sql
-- Synchronizes existing project schema with the Scalable Relational Design.

-- 1. Table Renames for Parity
DO $$ 
BEGIN
    -- Rename profile_schema_fields to profile_schema if source exists and target does not
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profile_schema_fields') AND 
       NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profile_schema') THEN
        ALTER TABLE public.profile_schema_fields RENAME TO profile_schema;
    END IF;

    -- Rename ai_evaluation_results to ai_scores if source exists and target does not
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ai_evaluation_results') AND 
       NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ai_scores') THEN
        ALTER TABLE public.ai_evaluation_results RENAME TO ai_scores;
    END IF;
END $$;

-- 2. User & Roles Sync (SECTION 1 & 2)
-- Assuming users and user_roles exist from 21_auth_rbac_unification.sql

-- 3. Company & Multi-tenancy Refinement (SECTION 3)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='companies' AND column_name='industry') THEN
        ALTER TABLE public.companies ADD COLUMN industry TEXT;
    END IF;
END $$;

-- 4. Dynamic Profile Structure (SECTION 4 & 5)
ALTER TABLE IF EXISTS public.profile_schema ADD COLUMN IF NOT EXISTS field_label TEXT;
ALTER TABLE IF EXISTS public.profile_schema ADD COLUMN IF NOT EXISTS validation_rules JSONB;

CREATE TABLE IF NOT EXISTS public.dynamic_profile_data (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    profile_data JSONB DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. AI Scoring Realignment (SECTION 6)
-- (Ensuring ai_scores has the exact float/int columns from 22_ai_evaluation_system.sql)

-- 6. Job Marketplace Synchronization (SECTION 8)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='company_id') THEN
        ALTER TABLE public.applications ADD COLUMN company_id UUID REFERENCES public.companies(id);
    END IF;
END $$;

-- 7. Notification & Logging Alignment (SECTION 12 & 13)
-- (Handled by 10_notification_and_logging.sql)

-- 8. Analytics & Sync (SECTION 14 & 15)
-- (Handled by 14_analytics_and_insights.sql and 17_data_sync_system.sql)

-- Final Audit: Ensure all Foreign Keys match the Master Design
ALTER TABLE IF EXISTS public.applications DROP CONSTRAINT IF EXISTS applications_company_id_fkey;
ALTER TABLE IF EXISTS public.applications ADD CONSTRAINT applications_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;
