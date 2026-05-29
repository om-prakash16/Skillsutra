import os
import httpx
from typing import Tuple, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException
from models.user import User
from core.security import create_access_token, create_refresh_token
from datetime import datetime, timedelta
import uuid

class OAuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.google_client_id = os.getenv("GOOGLE_CLIENT_ID")
        self.google_client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
        self.github_client_id = os.getenv("GITHUB_CLIENT_ID")
        self.github_client_secret = os.getenv("GITHUB_CLIENT_SECRET")
        
        # Determine redirect URIs based on env, fallback to localhost for dev
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
        self.google_redirect = f"{frontend_url}/api/auth/callback/google"
        self.github_redirect = f"{frontend_url}/api/auth/callback/github"

    async def _handle_oauth_user(self, email: str, provider: str, provider_id: str, profile_data: Dict[str, Any], ip_address: str, device_info: str, role: str = "user") -> Tuple[User, str, str]:
        from models.oauth import OAuthAccount
        from models.core import Role
        
        from sqlalchemy.orm import selectinload
        
        # 1. Check if user exists by email
        query = select(User).options(selectinload(User.roles)).where(User.email == email)
        result = await self.db.execute(query)
        user = result.scalars().first()

        if user:
            # Check if oauth_account exists
            oauth_query = select(OAuthAccount).where(OAuthAccount.user_id == user.id, OAuthAccount.provider == provider)
            oauth_res = await self.db.execute(oauth_query)
            oauth_acc = oauth_res.scalars().first()

            if not oauth_acc:
                new_oauth = OAuthAccount(
                    user_id=user.id,
                    provider=provider,
                    provider_account_id=provider_id
                )
                self.db.add(new_oauth)

            if not user.avatar_url and profile_data.get("avatar_url"):
                user.avatar_url = profile_data.get("avatar_url")
        else:
            # Create new user
            from core.username_utils import generate_unique_username
            
            async def check_username_exists(uname: str) -> bool:
                u_res = await self.db.execute(select(User).where(User.username == uname))
                return u_res.scalars().first() is not None

            # Base name prefers the full name from OAuth, fallback to email prefix
            raw_name = f"{profile_data.get('first_name', '')} {profile_data.get('last_name', '')}".strip()
            if not raw_name:
                raw_name = email.split("@")[0]
                
            username = await generate_unique_username(raw_name, check_username_exists)

            user = User(
                username=username,
                email=email,
                is_active=True,
                avatar_url=profile_data.get("avatar_url")
            )
            
            # Find the requested role in DB
            role_query = select(Role).where(Role.name == role)
            role_res = await self.db.execute(role_query)
            db_role = role_res.scalars().first()
            if db_role:
                user.roles.append(db_role)
                
            self.db.add(user)
            await self.db.flush() # To get user.id

            new_oauth = OAuthAccount(
                user_id=user.id,
                provider=provider,
                provider_account_id=provider_id
            )
            self.db.add(new_oauth)
            
            # Create default Profile
            from models.profile import Profile
            new_profile = Profile(
                user_id=user.id,
                headline=f"{profile_data.get('first_name', '')} {profile_data.get('last_name', '')}".strip() or username,
                visibility_mode="PUBLIC"
            )
            self.db.add(new_profile)
            
            # Enqueue welcome email
            try:
                from workers.notifications import send_email_alert
                send_email_alert.delay(str(user.id), "Welcome to SkillSutra!", "welcome_template", {"username": user.username})
            except Exception as e:
                print(f"DEBUG: Failed to enqueue welcome email: {e}")
        
        await self.db.commit()
        await self.db.refresh(user)

        # Generate tokens
        # If user has multiple roles, just pick the first or fallback to default
        actual_role = user.roles[0].name if user.roles else role
        access_token = create_access_token(subject=user.id, role=actual_role)
        refresh_token = create_refresh_token(subject=user.id)
        
        from core.security import REFRESH_TOKEN_EXPIRE_DAYS
        from core.redis import redis_set
        expires_at = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

        session_data = {
            "user_id": str(user.id),
            "device_info": device_info,
            "ip_address": ip_address,
            "expires_at": expires_at.isoformat()
        }
        await redis_set(f"session:{refresh_token}", session_data, ttl_seconds=REFRESH_TOKEN_EXPIRE_DAYS * 86400)

        return user, access_token, refresh_token

    async def handle_github_callback(self, code: str, ip_address: str, device_info: str) -> Tuple[User, str, str]:
        if not self.github_client_id:
            raise HTTPException(status_code=500, detail="GitHub OAuth not configured")

        async with httpx.AsyncClient() as client:
            # 1. Exchange code for access token
            token_response = await client.post(
                "https://github.com/login/oauth/access_token",
                headers={"Accept": "application/json"},
                data={
                    "client_id": self.github_client_id,
                    "client_secret": self.github_client_secret,
                    "code": code,
                    "redirect_uri": self.github_redirect
                }
            )
            token_data = token_response.json()
            access_token = token_data.get("access_token")
            if not access_token:
                raise HTTPException(status_code=400, detail="Invalid GitHub code")

            # 2. Get User Profile
            user_response = await client.get(
                "https://api.github.com/user",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            github_user = user_response.json()
            
            # 3. Get Emails (GitHub hides emails sometimes)
            emails_response = await client.get(
                "https://api.github.com/user/emails",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            emails = emails_response.json()
            primary_email = next((e["email"] for e in emails if e["primary"]), None)
            
            if not primary_email:
                raise HTTPException(status_code=400, detail="No primary email on GitHub account")

            profile_data = {
                "first_name": github_user.get("name", "").split(" ")[0] if github_user.get("name") else "",
                "last_name": " ".join(github_user.get("name", "").split(" ")[1:]) if github_user.get("name") else "",
                "avatar_url": github_user.get("avatar_url")
            }

            return await self._handle_oauth_user(
                email=primary_email,
                provider="github",
                provider_id=str(github_user["id"]),
                profile_data=profile_data,
                ip_address=ip_address,
                device_info=device_info
            )

    async def handle_google_id_token(self, id_token: str, ip_address: str, device_info: str, role: str = "user") -> Tuple[User, str, str]:
        from google.oauth2 import id_token as google_id_token
        from google.auth.transport import requests
        
        if not self.google_client_id:
            raise HTTPException(status_code=500, detail="Google OAuth not configured")

        try:
            # Verify token
            idinfo = google_id_token.verify_oauth2_token(
                id_token, requests.Request(), self.google_client_id, clock_skew_in_seconds=60
            )
            
            # Check issuer
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise HTTPException(status_code=400, detail="Wrong issuer.")
                
            email = idinfo.get("email")
            if not email:
                raise HTTPException(status_code=400, detail="No email provided by Google")
                
            profile_data = {
                "first_name": idinfo.get("given_name", ""),
                "last_name": idinfo.get("family_name", ""),
                "avatar_url": idinfo.get("picture")
            }
            
            return await self._handle_oauth_user(
                email=email,
                provider="google",
                provider_id=idinfo["sub"],
                profile_data=profile_data,
                ip_address=ip_address,
                device_info=device_info,
                role=role
            )
        except ValueError as e:
            # Invalid token
            raise HTTPException(status_code=400, detail=f"Invalid Google token: {str(e)}")
        except Exception as e:
            import traceback
            import logging
            logging.error(f"Error in handle_google_id_token: {str(e)}\n{traceback.format_exc()}")
            raise HTTPException(status_code=500, detail=f"Internal Google Auth Error: {str(e)}")
