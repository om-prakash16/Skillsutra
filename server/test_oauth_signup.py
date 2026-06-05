import asyncio
from core.database import AsyncSessionLocal
from services.oauth_service import OAuthService
from sqlalchemy import select
from models.user import User

async def run_test():
    async with AsyncSessionLocal() as session:
        service = OAuthService(session)
        profile_data = {
            "first_name": "Test",
            "last_name": "User",
            "bio": "I am a test user from GitHub",
            "followers": 100,
            "company": "Test Company",
            "location": "Internet"
        }
        
        # Test creating the user via mock oauth response
        try:
            user, _, _ = await service._handle_oauth_user(
                email="test_oauth_store@example.com",
                provider="github",
                provider_id="999999",
                profile_data=profile_data,
                ip_address="127.0.0.1",
                device_info="Test Script",
                intent="login" # if login, and not found it registers
            )
            print(f"Created/Found User: {user.email}")
            print(f"Dynamic Profile Data: {user.dynamic_profile_data}")
        except Exception as e:
            if "Account not found" in str(e):
                # Intent "login" raises error if not found, use intent="register" to create
                # Actually wait, handle_oauth_user creates new user if not found regardless if intent == register. Wait, no. If intent == login and not found -> raises 400.
                pass
            
        # Register new
        try:
            user, _, _ = await service._handle_oauth_user(
                email="test_oauth_store@example.com",
                provider="github",
                provider_id="999999",
                profile_data=profile_data,
                ip_address="127.0.0.1",
                device_info="Test Script",
                intent="register"
            )
            print(f"Registered User: {user.email}")
            print(f"Dynamic Profile Data: {user.dynamic_profile_data}")
            
            # Verify DB fetch
            result = await session.execute(select(User).where(User.email == "test_oauth_store@example.com"))
            db_user = result.scalars().first()
            print(f"DB Fetched Data: {db_user.dynamic_profile_data}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(run_test())
