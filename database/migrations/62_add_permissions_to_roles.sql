ALTER TABLE public.roles ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '[]'::jsonb;
