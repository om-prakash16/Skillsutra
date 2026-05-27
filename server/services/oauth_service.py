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

    async def _handle_oauth_user(self, email: str, provider: str, provider_id: str, profile_data: Dict[str, Any], ip_address: str, device_info: str) -> Tuple[User, str, str]:
        # 1. Check if user exists by email
        query = select(User).where(User.email == email)
        result = await self.db.execute(query)
        user = result.scalars().first()

        if user:
            # User exists, link account if not linked
            if provider == "google" and not user.google_id:
                user.google_id = provider_id
                user.auth_provider = provider
            elif provider == "github" and not user.github_id:
                user.github_id = provider_id
                user.auth_provider = provider
                
            if not user.profile_picture and profile_data.get("avatar_url"):
                user.profile_picture = profile_data.get("avatar_url")
        else:
            # Create new user
            # Username fallback
            base_username = email.split("@")[0]
            username = base_username
            
            # Very basic collision handle for username
            u_query = select(User).where(User.username == username)
            u_res = await self.db.execute(u_query)
            if u_res.scalars().first():
                username = f"{base_username}_{uuid.uuid4().hex[:6]}"

            user = User(
                first_name=profile_data.get("first_name", base_username),
                last_name=profile_data.get("last_name", ""),
                username=username,
                email=email,
                auth_provider=provider,
                is_verified=True,
                profile_picture=profile_data.get("avatar_url")
            )
            if provider == "google":
                user.google_id = provider_id
            else:
                user.github_id = provider_id

            self.db.add(user)
        
        await self.db.commit()
        await self.db.refresh(user)

        # Generate tokens
        access_token = create_access_token(subject=user.id, role=user.role)
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

    async def handle_google_callback(self, code: str, ip_address: str, device_info: str) -> Tuple[User, str, str]:
        if not self.google_client_id:
            raise HTTPException(status_code=500, detail="Google OAuth not configured")

        async with httpx.AsyncClient() as client:
            # 1. Exchange code for token
            token_response = await client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "client_id": self.google_client_id,
                    "client_secret": self.google_client_secret,
                    "code": code,
                    "redirect_uri": self.google_redirect,
                    "grant_type": "authorization_code"
                }
            )
            token_data = token_response.json()
            access_token = token_data.get("access_token")
            if not access_token:
                raise HTTPException(status_code=400, detail="Invalid Google code")

            # 2. Fetch User Info
            user_response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            google_user = user_response.json()
            email = google_user.get("email")
            if not email:
                raise HTTPException(status_code=400, detail="No email provided by Google")

            profile_data = {
                "first_name": google_user.get("given_name", ""),
                "last_name": google_user.get("family_name", ""),
                "avatar_url": google_user.get("picture")
            }

            return await self._handle_oauth_user(
                email=email,
                provider="google",
                provider_id=google_user["id"],
                profile_data=profile_data,
                ip_address=ip_address,
                device_info=device_info
            )
