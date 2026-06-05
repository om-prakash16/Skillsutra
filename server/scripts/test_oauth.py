import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.database import AsyncSessionLocal
from services.oauth_service import OAuthService

async def main():
    async with AsyncSessionLocal() as db:
        print("Testing OAuth User Creation Flow...")
        service = OAuthService(db)
        try:
            user, access, refresh = await service._handle_oauth_user(
                email="github_test_user@example.com",
                provider="github",
                provider_id="99999999",
                profile_data={"first_name": "GitHub", "last_name": "Test", "avatar_url": ""},
                ip_address="127.0.0.1",
                device_info="test-script"
            )
            print(f"Success! User ID: {user.id}, Username: {user.username}")
        except Exception as e:
            print(f"Error during OAuth handle: {e}")
            import traceback
            traceback.print_exc()

asyncio.run(main())
