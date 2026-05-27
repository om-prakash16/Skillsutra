-- 53_add_auth_fields.sql

-- Modifying the users table to allow NULL on wallet_address, 
-- and adding necessary fields for Email/Password and OAuth.

-- 1. Drop NOT NULL constraint on wallet_address
ALTER TABLE users ALTER COLUMN wallet_address DROP NOT NULL;

-- 2. Add new authentication columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS hashed_password TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider TEXT DEFAULT 'local';
ALTER TABLE users ADD COLUMN IF NOT EXISTS github_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. Create sessions table for managing refresh tokens & devices
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token TEXT NOT NULL,
    device_info TEXT,
    ip_address TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast session lookup
CREATE INDEX IF NOT EXISTS idx_sessions_refresh_token ON sessions(refresh_token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
