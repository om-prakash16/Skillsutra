-- 12_file_storage_registry.sql
-- Scalable File Metadata and Access Control System

-- 1. Metadata Registry
CREATE TABLE IF NOT EXISTS public.files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('avatar', 'resume', 'portfolio', 'certificate', 'logo', 'nft_metadata')),
    file_name TEXT NOT NULL,
    storage_path TEXT NOT NULL UNIQUE, -- Supabase Bucket Path
    ipfs_cid TEXT UNIQUE, -- Optional; for decentralized storage
    mime_type TEXT NOT NULL,
    size_bytes BIGINT NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Indexes for fast discovery
CREATE INDEX IF NOT EXISTS idx_files_user_id ON public.files(user_id);
CREATE INDEX IF NOT EXISTS idx_files_category ON public.files(category);
CREATE INDEX IF NOT EXISTS idx_files_ipfs_cid ON public.files(ipfs_cid) WHERE ipfs_cid IS NOT NULL;

-- 3. Row Level Security (RLS)
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own files (Public or Private)
CREATE POLICY "Users can view own files" 
ON public.files FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Anyone can view PUBLIC files (Avatars, Logos, Portfolio)
CREATE POLICY "Anyone can view public files" 
ON public.files FOR SELECT 
USING (is_public = TRUE);

-- Policy: Users can upload their own files
CREATE POLICY "Users can insert own files" 
ON public.files FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own files
CREATE POLICY "Users can delete own files" 
ON public.files FOR DELETE 
USING (auth.uid() = user_id);

-- 4. Audit Hook (Log file events)
-- Assuming activity_logs table from Migration 10 exists
CREATE OR REPLACE FUNCTION log_file_upload() RETURNS trigger AS $$
BEGIN
    INSERT INTO public.activity_logs (user_id, action_type, description, metadata)
    VALUES (new.user_id, 'file_upload', 'Uploaded ' || new.category || ': ' || new.file_name, 
            jsonb_build_object('file_id', new.id, 'category', new.category));
    RETURN new;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_log_file_upload AFTER INSERT ON public.files
FOR EACH ROW EXECUTE FUNCTION log_file_upload();
