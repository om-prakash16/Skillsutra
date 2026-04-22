-- 18_ai_quiz_system.sql
-- Storage for AI-Generated Quizzes and Verification Tokens

CREATE TABLE IF NOT EXISTS public.ai_quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id),
    skill_name TEXT NOT NULL,
    difficulty TEXT DEFAULT 'intermediate',
    question_data JSONB NOT NULL, -- Full quiz JSON (questions + correct answers)
    score INTEGER,
    passed BOOLEAN DEFAULT FALSE,
    mint_token TEXT UNIQUE, -- Secret token used to authorize the NFT minting
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + interval '1 hour')
);

-- Security: Users can view their own quizzes
ALTER TABLE public.ai_quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quizzes"
ON public.ai_quizzes FOR SELECT
USING (auth.uid() = user_id);

-- Only System/API can create/update
CREATE POLICY "System can manage quizzes"
ON public.ai_quizzes FOR ALL
USING (EXISTS (
    SELECT 1 FROM public.staff_assignments sa
    JOIN public.staff_roles sr ON sa.role_id = sr.id
    WHERE sa.user_id = auth.uid() AND sr.role_name = 'system'
));
