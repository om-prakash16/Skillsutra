-- Migration 49: Remove Blockchain references and tables
-- Decommissions Web3 credentials tracking and transaction monitoring

BEGIN;

-- Drop tables that store Blockchain-specific transactions or NFTs
DROP TABLE IF EXISTS public.blockchain_transactions CASCADE;
DROP TABLE IF EXISTS public.nft_credentials CASCADE;
DROP TABLE IF EXISTS public.sync_status CASCADE;

-- Optional: Clean up reputation history by removing on-chain score logs
ALTER TABLE public.reputation_history DROP COLUMN IF EXISTS web3_score;

COMMIT;
