import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import engine
from services.auth_service import AuthService

async def main():
    await engine.init_db()
    async with engine.pool.acquire() as conn:
        print("Testing magic link flow...")
        # Since AuthService uses SQLAlchemy AsyncSession, we need to create one
        from core.database import AsyncSessionLocal
        async with AsyncSessionLocal() as db:
            service = AuthService(db)
            
            # Send magic link
            email = "magic_test_user@example.com"
            print(f"Generating magic link for {email}...")
            # Mock request object since we just need it for sending
            class MockRequest:
                pass
            await service.send_magic_link(email, MockRequest())
            
            # Find the token in the DB
            from sqlalchemy import select
            from models.oauth import MagicLink
            res = await db.execute(select(MagicLink).where(MagicLink.email == email))
            entry = res.scalars().first()
            if not entry:
                print("Failed to create magic link entry!")
                return
                
            print("Magic link created in DB.")
            
            # Since we can't unhash the token, let's just create a raw token manually, hash it, and override the entry in DB so we can test it.
            from core.security import generate_secure_token, hash_token
            raw_token = generate_secure_token(64)
            entry.token_hash = hash_token(raw_token)
            await db.commit()
            
            print(f"Overridden with test token: {raw_token}")
            print("Verifying magic link...")
            
            try:
                user, access, refresh = await service.verify_magic_link(raw_token, "127.0.0.1", "test-script")
                print(f"Success! User ID: {user.id}, Username: {user.username}")
                
                # Now test if /auth/me would succeed for this user
                roles_list = [r.name for r in user.roles] if user.roles else ["user"]
                primary_role = roles_list[0] if roles_list else "user"
                
                api_me_data = {
                    "id": str(user.id),
                    "email": user.email,
                    "name": user.username or "User",
                    "role": primary_role,
                    "roles": roles_list,
                    "username": user.username,
                }
                print(f"apiMe payload would be: {api_me_data}")
                
            except Exception as e:
                print(f"Error during verify: {e}")
                import traceback
                traceback.print_exc()

asyncio.run(main())
