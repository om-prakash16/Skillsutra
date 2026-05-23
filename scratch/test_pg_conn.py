import asyncio
import asyncpg

async def test_conn():
    db_url = "postgresql://postgres@127.0.0.1:5432/skillsutra"
    print(f"Connecting to skillsutra database on port 5432 to recreate trigger function...")
    try:
        conn = await asyncpg.connect(db_url)
        print("Connected! Recreating function sync_search_candidate()...")
        await conn.execute("""
CREATE OR REPLACE FUNCTION sync_search_candidate() RETURNS trigger AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Resolve user_id based on table and operation
  IF TG_OP = 'DELETE' THEN
    v_user_id := OLD.user_id;
  ELSIF TG_TABLE_NAME = 'users' THEN
    v_user_id := NEW.id;
  ELSE
    v_user_id := NEW.user_id;
  END IF;

  IF v_user_id IS NULL THEN
    RETURN NULL;
  END IF;

  INSERT INTO public.search_candidates (user_id, full_name, skills, proof_score, location, experience_level, search_vector)
  SELECT 
    u.id, 
    u.full_name,
    COALESCE((SELECT array_agg(skill_name) FROM public.user_skills WHERE user_id = u.id), '{}'),
    COALESCE((SELECT proof_score FROM public.ai_scores WHERE user_id = u.id), 0.0),
    p.location,
    'Mid-Level', -- Placeholder, could be mapped from profile_data
    setweight(to_tsvector('english', coalesce(u.full_name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(u.bio, '')), 'B') ||
    setweight(to_tsvector('english', array_to_string(COALESCE((SELECT array_agg(skill_name) FROM public.user_skills WHERE user_id = u.id), '{}'), ' ')), 'A')
  FROM public.users u 
  LEFT JOIN public.profiles p ON p.user_id = u.id
  WHERE u.id = v_user_id
  ON CONFLICT (user_id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    skills = EXCLUDED.skills,
    proof_score = EXCLUDED.proof_score,
    location = EXCLUDED.location,
    search_vector = EXCLUDED.search_vector,
    updated_at = NOW();
  RETURN NULL;
END
$$ LANGUAGE plpgsql SECURITY DEFINER;
        """)
        print("Successfully recreated function sync_search_candidate()!")
        await conn.close()
        return True
    except Exception as e:
        print(f"FAILED: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(test_conn())
