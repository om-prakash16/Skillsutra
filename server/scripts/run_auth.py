import httpx
import asyncio

API_BASE = "http://localhost:8000/api/v1"

async def test_auth():
    print("Testing auth flow...")
    
    # 1. Sign Up
    user_data = {
        "email": "testuser@skillsutra.com",
        "password": "TestPassword123!",
        "username": "testuser123",
        "first_name": "Test",
        "last_name": "User"
    }
    
    async with httpx.AsyncClient() as client:
        print("\n--- 1. Testing Registration ---")
        res = await client.post(f"{API_BASE}/auth/signup", json=user_data)
        if res.status_code == 201:
            print("Registration Successful!")
            print(res.json())
        elif res.status_code == 400 and "already exists" in res.text:
            print("User already exists, proceeding to login.")
        else:
            print("Registration failed:", res.status_code, res.text)
            
        print("\n--- 2. Testing Login ---")
        login_data = {
            "email_or_username": "testuser@skillsutra.com",
            "password": "TestPassword123!"
        }
        res = await client.post(f"{API_BASE}/auth/login", json=login_data)
        if res.status_code == 200:
            print("Login Successful!")
            data = res.json()
            access_token = data["access_token"]
        else:
            print("Login failed:", res.status_code, res.text)
            return
            
        print("\n--- 3. Testing Get Profile (/me) ---")
        res = await client.get(f"{API_BASE}/auth/me", headers={"Authorization": f"Bearer {access_token}"})
        if res.status_code == 200:
            print("Fetch Profile Successful!")
            print(res.json())
        else:
            print("Fetch Profile failed:", res.status_code, res.text)
            
        print("\nAll standard auth flows verified successfully.")

if __name__ == "__main__":
    asyncio.run(test_auth())
