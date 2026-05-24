-- 00_auth_mock.sql
-- Create the auth schema for local database compatibility with PostgreSQL RLS

CREATE SCHEMA IF NOT EXISTS auth;

-- Mock auth.uid() function
CREATE OR REPLACE FUNCTION auth.uid() 
RETURNS UUID AS $$
    SELECT COALESCE(
        NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')::UUID,
        NULLIF(current_setting('request.jwt.claim.sub', true), '')::UUID,
        NULL
    );
$$ LANGUAGE sql STABLE;

-- Mock auth.role() function
CREATE OR REPLACE FUNCTION auth.role() 
RETURNS TEXT AS $$
    SELECT COALESCE(
        NULLIF(current_setting('request.jwt.claims', true)::json->>'role', ''),
        NULLIF(current_setting('request.jwt.claim.role', true), ''),
        'authenticated'
    );
$$ LANGUAGE sql STABLE;

-- Mock auth.email() function
CREATE OR REPLACE FUNCTION auth.email() 
RETURNS TEXT AS $$
    SELECT COALESCE(
        NULLIF(current_setting('request.jwt.claims', true)::json->>'email', ''),
        NULLIF(current_setting('request.jwt.claim.email', true), ''),
        ''
    );
$$ LANGUAGE sql STABLE;

-- Mock roles for RLS grants and compatibility
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'authenticated') THEN
        CREATE ROLE authenticated;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'anon') THEN
        CREATE ROLE anon;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'service_role') THEN
        CREATE ROLE service_role;
    END IF;
END $$;

