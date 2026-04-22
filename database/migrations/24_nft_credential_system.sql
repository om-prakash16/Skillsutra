-- 24_nft_credential_system.sql
-- NFT Credentials for Verifiable Professional Identity and Skills

-- 1. NFT Records Table
DROP TABLE IF EXISTS public.nft_records CASCADE;
CREATE TABLE IF NOT EXISTS public.nft_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    nft_address TEXT UNIQUE NOT NULL, -- Solana Mint Address
    nft_type TEXT NOT NULL, -- 'profile', 'skill', 'achievement'
    metadata_cid TEXT NOT NULL, -- IPFS CID
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Metadata Versions Table
DROP TABLE IF EXISTS public.metadata_versions CASCADE;
CREATE TABLE IF NOT EXISTS public.metadata_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    nft_type TEXT NOT NULL,
    cid TEXT NOT NULL,
    metadata_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SaaS Data Isolation (RLS)
ALTER TABLE public.nft_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metadata_versions ENABLE ROW LEVEL SECURITY;

-- 4. Visibility Policies
-- Users can view their own credentials
CREATE POLICY "Users view own NFTs" ON public.nft_records
FOR SELECT USING (user_id = auth.uid());

-- Public: Can view verified credentials by NFT address
CREATE POLICY "Public read NFT records" ON public.nft_records
FOR SELECT USING (true);

-- Metadata history: User only
CREATE POLICY "Users view own meta versions" ON public.metadata_versions
FOR SELECT USING (user_id = auth.uid());

-- 5. Performance Indexing
CREATE INDEX IF NOT EXISTS idx_nft_user_id ON public.nft_records(user_id);
CREATE INDEX IF NOT EXISTS idx_nft_address ON public.nft_records(nft_address);
CREATE INDEX IF NOT EXISTS idx_meta_versions_user_id ON public.metadata_versions(user_id);
