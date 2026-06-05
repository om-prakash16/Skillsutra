-- 58_add_search_vector_to_users.sql
-- Goal: Add missing search_vector computed column to the users table which is expected by the SQLAlchemy model.

ALTER TABLE users ADD COLUMN IF NOT EXISTS search_vector tsvector GENERATED ALWAYS AS (to_tsvector('english', coalesce(username, '') || ' ' || coalesce(email, ''))) STORED;
