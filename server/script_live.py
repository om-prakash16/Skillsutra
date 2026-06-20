import asyncio
import httpx
import uuid
from core.security import create_access_token
from core.database import AsyncSessionLocal
from models.user import User

async def main():
    uid = uuid.uuid4()
    target_uid = uuid.uuid4()
    
    # 1. Create test users directly in DB
    print(f"Creating test users {uid} and {target_uid}...")
    async with AsyncSessionLocal() as db:
        u1_username = f"e2etest{uid.hex[:8]}"
        u2_username = f"e2etest{target_uid.hex[:8]}"
        u1 = User(id=uid, email=f"{u1_username}@example.com", username=u1_username, first_name="E2E", last_name="1", password_hash="pw")
        u2 = User(id=target_uid, email=f"{u2_username}@example.com", username=u2_username, first_name="E2E", last_name="2", password_hash="pw")
        db.add(u1)
        db.add(u2)
        await db.commit()
        
    token = create_access_token(str(uid), role="user")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # The server is exposed on 8000 inside the container
    print("Testing /api/v1/feed/posts ...")
    async with httpx.AsyncClient(base_url="http://localhost:8000/api/v1") as client:
        # 2. Test Post
        res = await client.post("/feed/posts", json={"content_markdown": "Live testing!", "visibility": "PUBLIC", "media": []}, headers=headers)
        if res.status_code == 200:
            print("✅ Post creation SUCCESS:", res.json()["data"]["id"])
        else:
            print("❌ Post creation FAILED:", res.status_code, res.text)
        
        # 3. Test Messages
        print("Testing /api/v1/messages/start ...")
        res = await client.post("/messages/start", json={"receiver_id": str(target_uid), "initial_message": "Hello from e2e test"}, headers=headers)
        if res.status_code == 200:
            conv_id = res.json()["data"]["conversation_id"]
            print("✅ Start conversation SUCCESS:", conv_id)
            
            res = await client.post(f"/messages/{conv_id}/send", json={"content": "Live message", "conversation_id": conv_id}, headers=headers)
            if res.status_code == 200:
                print("✅ Send message SUCCESS:", res.json()["data"]["id"])
            else:
                print("❌ Send message FAILED:", res.status_code, res.text)
        else:
            print("❌ Start conversation FAILED:", res.status_code, res.text)

if __name__ == "__main__":
    asyncio.run(main())
