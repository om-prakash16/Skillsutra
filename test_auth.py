import httpx
import asyncio
import asyncpg
import time

API_URL = "http://localhost:8000/api/v1"
DB_URL = "postgresql://postgres:postgres@localhost:5433/skillsutra"

async def activate_user(email: str):
    print(f"Activating user {email} in DB...")
    await asyncio.sleep(1)
    try:
        conn = await asyncpg.connect(DB_URL)
        await conn.execute("UPDATE users SET is_active = true WHERE email = $1", email)
        await conn.close()
    except Exception as e:
        print(f"Failed to activate user: {e}")

async def test_auth():
    test_id = str(int(time.time()))
    email = f"authuser_{test_id}@example.com"
    username = f"authuser_{test_id}"
    password = "Password123!"
    
    async with httpx.AsyncClient() as client:
        # Signup
        r_signup = await client.post(f"{API_URL}/auth/signup", json={
            "username": username,
            "email": email,
            "password": password
        })
        print(f"Signup status: {r_signup.status_code}")
        
        if r_signup.status_code != 201:
            print(f"Signup failed: {r_signup.text}")
            return
            
        await activate_user(email)
        
        # Login
        r_login = await client.post(f"{API_URL}/auth/login", json={
            "email_or_username": email,
            "password": password
        })
        print(f"Login status: {r_login.status_code}")
        
        if r_login.status_code == 200:
            token = r_login.json().get("access_token")
            print(f"Token: {token[:20]}...")
            
            # Get Me
            r_me = await client.get(f"{API_URL}/auth/me", headers={"Authorization": f"Bearer {token}"})
            print(f"Me status: {r_me.status_code}")
            print(f"Me response: {r_me.text}")
        else:
            print(f"Login failed: {r_login.text}")

if __name__ == "__main__":
    asyncio.run(test_auth())
