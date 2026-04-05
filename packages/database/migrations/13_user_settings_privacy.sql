-- 13_user_settings_privacy.sql
-- Enterprise Privacy and User Preference Management

-- 1. Settings Registry
CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'private', 'recruiters_only')),
    
    -- Compact JSONB Storage for dynamic preferences
    notification_prefs JSONB DEFAULT '{
        "application_updates": true,
        "ai_recommendations": true,
        "skill_verification": true,
        "interview_requests": true
    }'::jsonb,
    
    job_prefs JSONB DEFAULT '{
        "target_roles": [],
        "expected_salary": null,
        "preferred_location": "remote",
        "job_type": "full-time"
    }'::jsonb,
    
    privacy_rules JSONB DEFAULT '{
        "email": "private",
        "phone": "private",
        "resume": "recruiters_only",
        "github": "public",
        "portfolio": "public"
    }'::jsonb,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Row Level Security (RLS)
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Users can read and update ONLY their own settings
CREATE POLICY "Users can manage own settings" 
ON public.user_settings FOR ALL 
USING (auth.uid() = user_id);

-- Recruiter-level visibility utility (Optional Helper)
CREATE OR REPLACE FUNCTION check_field_visibility(target_user_id UUID, researcher_id UUID, field_name TEXT) 
RETURNS BOOLEAN AS $$
DECLARE
    rule TEXT;
    researcher_role TEXT;
BEGIN
    SELECT privacy_rules->>field_name INTO rule FROM public.user_settings WHERE user_id = target_user_id;
    -- If no rule, default to private for safety
    IF rule IS NULL THEN RETURN FALSE; END IF;
    IF rule = 'public' THEN RETURN TRUE; END IF;
    IF rule = 'private' AND target_user_id = researcher_id THEN RETURN TRUE; END IF;
    
    -- Check if recruiter
    -- Assuming a user_roles or metadata check exists on public.users or auth.users
    IF rule = 'recruiters_only' THEN
        -- Placeholder for role check logic
        RETURN TRUE; 
    END IF;

    RETURN FALSE;
END
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Trigger: Auto-create settings for new users
CREATE OR REPLACE FUNCTION handle_new_user_settings() RETURNS trigger AS $$
BEGIN
    INSERT INTO public.user_settings (user_id) VALUES (new.id);
    RETURN new;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_create_settings_on_signup AFTER INSERT ON public.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user_settings();
