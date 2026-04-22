-- 16_blockchain_transaction_monitoring.sql
-- Blockchain Activity Indexing & Monitoring System

-- 1. Create Transaction Status Type
DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('pending', 'confirmed', 'failed', 'finalized');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 2. Create Transaction Type
DO $$ BEGIN
    CREATE TYPE blockchain_transaction_type AS ENUM (
        'profile_nft_mint', 
        'skill_nft_mint', 
        'achievement_nft_mint', 
        'profile_metadata_update', 
        'job_application', 
        'hiring_decision'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 3. Blockchain Transactions Table
CREATE TABLE IF NOT EXISTS public.blockchain_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_wallet TEXT NOT NULL,
    transaction_type blockchain_transaction_type NOT NULL,
    transaction_hash TEXT UNIQUE NOT NULL,
    related_entity_id UUID, -- Link to application, skill cert, or user profile
    status transaction_status DEFAULT 'pending',
    explorer_url TEXT,
    indexed_data JSONB, -- Store full response from Helius/Shyft for auditing
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Security & RBAC
ALTER TABLE public.blockchain_transactions ENABLE ROW LEVEL SECURITY;

-- Read: Public can view verified transaction status
CREATE POLICY "Public can view blockchain activity" 
ON public.blockchain_transactions FOR SELECT 
USING (TRUE);

-- Write/Update: Restricted to System/Staff API
CREATE POLICY "System can manage transactions" 
ON public.blockchain_transactions FOR ALL 
USING (EXISTS (
    SELECT 1 FROM public.staff_assignments sa
    JOIN public.staff_roles sr ON sa.role_id = sr.id
    WHERE sa.user_id = auth.uid() AND sr.role_name IN ('admin', 'superadmin', 'system')
));

-- 5. Helper Index
CREATE INDEX idx_blockchain_tx_wallet ON public.blockchain_transactions(user_wallet);
CREATE INDEX idx_blockchain_tx_type ON public.blockchain_transactions(transaction_type);
CREATE INDEX idx_blockchain_tx_status ON public.blockchain_transactions(status);

-- 6. Trigger for updated_at
CREATE OR REPLACE FUNCTION update_blockchain_tx_time() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_blockchain_tx_time
BEFORE UPDATE ON public.blockchain_transactions
FOR EACH ROW EXECUTE FUNCTION update_blockchain_tx_time();
