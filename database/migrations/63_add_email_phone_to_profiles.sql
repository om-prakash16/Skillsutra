-- 63_add_email_phone_to_profiles.sql
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS email VARCHAR,
ADD COLUMN IF NOT EXISTS phone VARCHAR;
