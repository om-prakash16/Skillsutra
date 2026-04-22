-- 22_ai_evaluation_system.sql
-- AI Scoring and Evaluation Persistent Metrics

-- 1. AI Score Registry
DROP TABLE IF EXISTS public.ai_scores CASCADE;
CREATE TABLE IF NOT EXISTS public.ai_scores (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    skill_score FLOAT DEFAULT 0.0,
    project_score FLOAT DEFAULT 0.0,
    experience_score FLOAT DEFAULT 0.0,
    proof_score FLOAT DEFAULT 0.0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Performance Indexing
CREATE INDEX IF NOT EXISTS idx_ai_proof_score ON public.ai_scores(proof_score DESC);

-- 3. Security & RBAC
ALTER TABLE public.ai_scores ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own AI metrics
CREATE POLICY "Users can view own AI scores" 
ON public.ai_scores FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Public read for Proof Score (Frontend leaderboard)
CREATE POLICY "Public can view top proof scores" 
ON public.ai_scores FOR SELECT 
USING (true);

-- Policy: Admin/System Update Only
CREATE POLICY "Admins can update AI scores" 
ON public.ai_scores FOR ALL 
USING (EXISTS (
    SELECT 1 FROM public.admin_users WHERE wallet_address = (
        SELECT wallet_address FROM public.users WHERE id = auth.uid()
    ) AND role = 'SUPER_ADMIN'
));
