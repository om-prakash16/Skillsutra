import asyncio
import httpx
import asyncpg
import time

API_URL = "http://localhost:8000/api/v1"
DB_URL = "postgresql://postgres:postgres@localhost:5433/skillsutra"

async def test_magic_flow():
    email = f"magic_{int(time.time())}@example.com"
    
    async with httpx.AsyncClient() as client:
        # 1. Request magic link
        print(f"Requesting magic link for {email}...")
        r_req = await client.post(f"{API_URL}/auth/magic-link", json={"email": email})
        print(f"Request status: {r_req.status_code}")
        
        await asyncio.sleep(1) # wait for DB commit
        
        # 2. Get the token hash from DB
        conn = await asyncpg.connect(DB_URL)
        record = await conn.fetchrow("SELECT token_hash, expires_at FROM magic_links WHERE email = $1 ORDER BY created_at DESC", email)
        await conn.close()
        
        if not record:
            print("No magic link found in DB!")
            return
            
        print(f"Found in DB - hash: {record['token_hash']}, expires: {record['expires_at']}")
        
        # Since we only have the hash in the DB, we can't test the actual API with the raw token unless we intercept it.
        # But wait! We don't have the raw token.
        # Let's generate our own token and hash, insert it into DB, and then test the verify endpoint!

        from server.core.security import generate_secure_token, hash_token
        from datetime import datetime, timezone, timedelta
        
        raw_token = generate_secure_token(64)
        hashed = hash_token(raw_token)
        expires = datetime.now(timezone.utc) + timedelta(minutes=15)
        
        conn = await asyncpg.connect(DB_URL)
        await conn.execute("INSERT INTO magic_links (email, token_hash, expires_at) VALUES ($1, $2, $3)", "test2@example.com", hashed, expires)
        await conn.close()
        
        print(f"Inserted token: {raw_token}")
        
        # 3. Verify
        r_ver = await client.post(f"{API_URL}/auth/verify-magic", json={"token": raw_token})
        print(f"Verify status: {r_ver.status_code}")
        print(f"Verify response: {r_ver.text}")

if __name__ == "__main__":
    asyncio.run(test_magic_flow())
