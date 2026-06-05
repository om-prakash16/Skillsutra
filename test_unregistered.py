import httpx
import asyncio

API_URL = "http://localhost:8000/api/v1"

async def test_unregistered_login():
    async with httpx.AsyncClient() as client:
        # Try to login with an unregistered email
        r_login = await client.post(f"{API_URL}/auth/login", json={
            "email_or_username": "unregistered_test@example.com",
            "password": "Password123!"
        })
        
        print(f"Login status: {r_login.status_code}")
        print(f"Login response: {r_login.text}")

if __name__ == "__main__":
    asyncio.run(test_unregistered_login())
