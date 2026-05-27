"""
Populate search_candidates from existing users + profiles data.
This script fills the denormalized search index that the talent page queries.
"""
import asyncio
import asyncpg
import os
import sys
from dotenv import load_dotenv

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres@localhost:5432/skillsutra")

async def populate():
    conn = await asyncpg.connect(DATABASE_URL)

    # First check what we have
    user_count = await conn.fetchval("SELECT COUNT(*) FROM users")
    profile_count = await conn.fetchval("SELECT COUNT(*) FROM profiles")
    search_count = await conn.fetchval("SELECT COUNT(*) FROM search_candidates")
    print(f"Users: {user_count}, Profiles: {profile_count}, Search Candidates: {search_count}")

    # Populate search_candidates from users + profiles
    inserted = await conn.execute("""
        INSERT INTO search_candidates (user_id, full_name, skills, proof_score, location, experience_level, search_vector)
        SELECT 
            u.id,
            COALESCE(p.full_name, u.username, 'Unknown'),
            COALESCE((SELECT array_agg(skill_name) FROM user_skills WHERE user_id = u.id), '{}'),
            COALESCE((SELECT proof_score FROM ai_scores WHERE user_id = u.id), 0.0),
            COALESCE(p.location, 'Remote'),
            'Mid-Level',
            setweight(to_tsvector('english', coalesce(p.full_name, u.username, '')), 'A') ||
            setweight(to_tsvector('english', coalesce(p.headline, '')), 'B') ||
            setweight(to_tsvector('english', coalesce(u.bio, '')), 'C')
        FROM users u
        LEFT JOIN profiles p ON p.user_id = u.id
        ON CONFLICT (user_id) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            skills = EXCLUDED.skills,
            proof_score = EXCLUDED.proof_score,
            location = EXCLUDED.location,
            search_vector = EXCLUDED.search_vector,
            updated_at = NOW()
    """)
    print(f"Result: {inserted}")

    new_search_count = await conn.fetchval("SELECT COUNT(*) FROM search_candidates")
    print(f"Search Candidates after populate: {new_search_count}")

    # Show a sample
    sample = await conn.fetch("SELECT user_id, full_name, location, proof_score FROM search_candidates LIMIT 5")
    for row in sample:
        print(f"  -> {row['full_name']} | {row['location']} | score: {row['proof_score']}")

    await conn.close()

if __name__ == "__main__":
    asyncio.run(populate())
