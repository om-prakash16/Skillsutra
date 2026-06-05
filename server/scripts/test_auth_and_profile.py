import asyncio
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import engine
from modules.users.core.service import UserService

async def run_tests():
    await engine.init_db()
    print("--- Database initialized ---")
    
    # 1. Check if we can hit the database
    async with engine.pool.acquire() as conn:
        print("Checking users table...")
        users = await conn.fetch("SELECT id FROM users LIMIT 1")
        if users:
            user_id = str(users[0]["id"])
            print(f"Found a user to test with: {user_id}")
            
            # 2. Test the optimized profile fetch (the one we just fixed!)
            try:
                print("Testing get_full_profile (optimized async version)...")
                profile = await UserService.get_full_profile(user_id)
                print(f"Success! Fetched profile with {len(profile.get('skills', []))} skills, {len(profile.get('experiences', []))} experiences.")
            except Exception as e:
                print(f"Failed to fetch profile: {e}")
                
        else:
            print("No users in the database to test the profile fetch.")
            
    print("\n--- Testing HTTP Endpoints Locally ---")
    import httpx
    
    # 3. Test the GitHub OAuth URL endpoint (This was crashing before!)
    try:
        async with httpx.AsyncClient(base_url="http://localhost:8000/api/v1") as client:
            print("Fetching GitHub OAuth URL...")
            res = await client.get("/auth/oauth/github/url")
            print(f"Status Code: {res.status_code}")
            print(f"Response: {res.json()}")
            if res.status_code == 200:
                print("GitHub OAuth URL endpoint is working perfectly!")
    except Exception as e:
        print(f"Failed to fetch GitHub OAuth URL: {e}")
        
    # 4. Test the Blog endpoint
    try:
        async with httpx.AsyncClient(base_url="http://localhost:8000/api/v1") as client:
            print("\nFetching Blog Posts...")
            res = await client.get("/blog/posts")
            print(f"Status Code: {res.status_code}")
            if res.status_code == 200:
                print(f"Successfully fetched {res.json().get('total', 0)} blog posts!")
    except Exception as e:
        print(f"Failed to fetch Blog Posts: {e}")

if __name__ == "__main__":
    asyncio.run(run_tests())
