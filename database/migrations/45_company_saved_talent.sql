-- Migration: 45_company_saved_talent.sql
-- Description: Create table for companies to bookmark/select talent for future roles.

CREATE TABLE IF NOT EXISTS company_saved_talent (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(company_id, user_id)
);

-- Enable RLS
ALTER TABLE company_saved_talent ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Companies can view their saved talent" 
ON company_saved_talent FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM company_members
        WHERE company_members.company_id = company_saved_talent.company_id
        AND company_members.user_id = auth.uid()
    )
);

CREATE POLICY "Companies can save talent" 
ON company_saved_talent FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM company_members
        WHERE company_members.company_id = company_saved_talent.company_id
        AND company_members.user_id = auth.uid()
    )
);

CREATE POLICY "Companies can unsave talent" 
ON company_saved_talent FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM company_members
        WHERE company_members.company_id = company_saved_talent.company_id
        AND company_members.user_id = auth.uid()
    )
);
