-- 57_add_missing_user_columns.sql
-- Goal: Add columns that exist in the SQLAlchemy User model but were missing from the migrations.

ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS github_data JSONB;
ALTER TABLE users ADD COLUMN IF NOT EXISTS dynamic_profile_data JSONB;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_synced_at TIMESTAMPTZ;
