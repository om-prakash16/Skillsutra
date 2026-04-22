-- Migration: 38_fix_rls_recursion.sql
-- Description: Fixes the infinite recursion bug in the company_members table RLS policy.

BEGIN;

-- 1. Drop the problematic recursive policy
DROP POLICY IF EXISTS "Members can view team" ON public.company_members;

-- 2. Implement a non-recursive policy for team visibility
-- We use a subquery directed specifically at the row level check without re-triggering the same policy
-- In Supabase, a common pattern is to check user_id directly for individual access
-- and use a SECURITY DEFINER function for complex cross-row checks to avoid recursion.

CREATE OR REPLACE FUNCTION public.is_company_member(cid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.company_members 
    WHERE company_id = cid AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Members can view team" ON public.company_members FOR SELECT USING (
    user_id = auth.uid() OR is_company_member(company_id)
);

-- 3. Fix the companies policy as well to ensure consistent access
DROP POLICY IF EXISTS "Members can view company details" ON public.companies;
CREATE POLICY "Members can view company details" ON public.companies FOR SELECT USING (
    is_company_member(id)
);

COMMIT;
