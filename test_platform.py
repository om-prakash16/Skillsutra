import httpx
import asyncio
import asyncpg
import time

API_URL = "http://localhost:8000/api/v1"
DB_URL = "postgresql://postgres:postgres@localhost:5433/skillsutra"

async def activate_user(email: str):
    print(f"Activating user {email} in DB...")
    # Add a small delay to ensure DB transaction from signup is committed
    await asyncio.sleep(1)
    try:
        conn = await asyncpg.connect(DB_URL)
        await conn.execute("UPDATE users SET is_active = true WHERE email = $1", email)
        await conn.close()
        print("User activated successfully.")
    except Exception as e:
        print(f"Failed to activate user: {e}")

async def test_auth_flow():
    print("Testing Registration and Login Flow...")
    # Use a unique email/username so we don't hit "already registered" errors on reruns
    test_id = str(int(time.time()))
    email = f"test_{test_id}@besthiringtool.com"
    username = f"test_engineer_{test_id}"
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        # 1. Register User
        res = await client.post(f"{API_URL}/auth/signup", json={
            "username": username,
            "email": email,
            "password": "SecurePassword123!"
        })
        print("Signup:", res.status_code)
        
        # Manually activate user since email verification is skipped
        await activate_user(email)
        
        # 2. Login User
        res = await client.post(f"{API_URL}/auth/login", json={
            "email_or_username": email,
            "password": "SecurePassword123!"
        })
        print("Login:", res.status_code)
        
        if res.status_code == 200:
            token = res.json().get("access_token")
            # 3. Get User Profile
            res = await client.get(f"{API_URL}/auth/me", headers={"Authorization": f"Bearer {token}"})
            print("Get User Profile (/auth/me):", res.status_code)
            if res.status_code == 200:
                print(" ->", res.json().get("data", {}).get("email"))
        else:
            print("Login failed:", res.text)

async def test_public_routes():
    print("\nTesting Public API Routes...")
    async with httpx.AsyncClient() as client:
        # Jobs List Test (replacing CMS since CMS /pages requires admin)
        res = await client.get(f"{API_URL}/jobs/list")
        print("Jobs List /api/v1/jobs/list:", res.status_code)

if __name__ == "__main__":
    asyncio.run(test_auth_flow())
    asyncio.run(test_public_routes())
