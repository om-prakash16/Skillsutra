import asyncio
import os
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import AsyncSessionLocal
from services.oauth_service import OAuthService
from models.notifications import Notification
from sqlalchemy import select

async def verify_oauth_notification():
    async with AsyncSessionLocal() as db:
        service = OAuthService(db)
        
        # Mock OAuth Data
        email = "test.oauth.notification2@example.com"
        provider = "google"
        provider_id = "test_google_id_123"
        profile_data = {
            "first_name": "Test",
            "last_name": "User",
            "email_verified": True,
            "avatar_url": "https://example.com/avatar.jpg"
        }
        ip_address = "127.0.0.1"
        device_info = "Test Script"
        
        try:
            print("Creating OAuth user and checking inbox...")
            user, access, refresh = await service._handle_oauth_user(
                email=email,
                provider=provider,
                provider_id=provider_id,
                profile_data=profile_data,
                ip_address=ip_address,
                device_info=device_info
            )
            
            # Check for notification
            print(f"User created with ID: {user.id}")
            result = await db.execute(select(Notification).where(Notification.user_id == user.id))
            notifications = result.scalars().all()
            
            print(f"Found {len(notifications)} notifications for user.")
            for n in notifications:
                print(f"Notification: {n.title} - {n.message}")
            
            if len(notifications) > 0:
                print("SUCCESS: Verification successful: In-app message created!")
            else:
                print("FAILED: Verification failed: No in-app message created.")
                
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(verify_oauth_notification())
