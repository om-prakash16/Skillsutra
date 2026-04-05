-- 17_data_sync_system.sql
-- Data Synchronization System for Web3 State Management

-- 1. Create Sync State Enum
DO $$ BEGIN
    CREATE TYPE sync_state AS ENUM ('pending', 'synced', 'failed', 'outdated');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.metadata_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL, 
    entity_id UUID, 
    cid TEXT NOT NULL,
    version_number INTEGER,
    metadata_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure column exists if table was created in previous run
ALTER TABLE public.metadata_versions ADD COLUMN IF NOT EXISTS version_number INTEGER;
ALTER TABLE public.metadata_versions ALTER COLUMN version_number SET NOT NULL;

-- Function to auto-increment version number
CREATE OR REPLACE FUNCTION increment_metadata_version() RETURNS TRIGGER AS $$
DECLARE
    current_max INTEGER;
BEGIN
    SELECT COALESCE(MAX(version_number), 0) INTO current_max
    FROM public.metadata_versions
    WHERE user_id = NEW.user_id AND entity_type = NEW.entity_type;
    
    NEW.version_number := current_max + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_increment_version ON public.metadata_versions;
CREATE TRIGGER tr_increment_version
BEFORE INSERT ON public.metadata_versions
FOR EACH ROW EXECUTE FUNCTION increment_metadata_version();

-- 3. Sync Status Table
CREATE TABLE IF NOT EXISTS public.sync_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    current_state sync_state DEFAULT 'pending',
    latest_cid TEXT,
    onchain_tx_hash TEXT,
    last_synced_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, entity_type, entity_id)
);

-- 4. Security & RBAC
ALTER TABLE public.metadata_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_status ENABLE ROW LEVEL SECURITY;

-- Read: Users can view their own sync status and versions
DROP POLICY IF EXISTS "Users can view own metadata versions" ON public.metadata_versions;
CREATE POLICY "Users can view own metadata versions" 
ON public.metadata_versions FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own sync status" ON public.sync_status;
CREATE POLICY "Users can view own sync status" 
ON public.sync_status FOR SELECT 
USING (auth.uid() = user_id);

-- System Policy: Staff/Admin/System can manage all sync records
DROP POLICY IF EXISTS "System can manage sync records" ON public.sync_status;
CREATE POLICY "System can manage sync records" 
ON public.sync_status FOR ALL 
USING (EXISTS (
    SELECT 1 FROM public.staff_assignments sa
    JOIN public.staff_roles sr ON sa.role_id = sr.id
    WHERE sa.user_id = auth.uid() AND sr.role_name IN ('admin', 'system')
));

-- 5. Helper Indicies
CREATE INDEX IF NOT EXISTS idx_metadata_user_version ON public.metadata_versions(user_id, version_number);
CREATE INDEX IF NOT EXISTS idx_sync_status_user_state ON public.sync_status(user_id, current_state);

-- 6. Trigger for updated_at in sync_status
DROP TRIGGER IF EXISTS trigger_update_sync_status_time ON public.sync_status;
CREATE TRIGGER trigger_update_sync_status_time
BEFORE UPDATE ON public.sync_status
FOR EACH ROW EXECUTE FUNCTION update_blockchain_tx_time(); -- Using existing helper
