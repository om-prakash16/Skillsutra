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
import asyncio

async def perform_github_deep_analysis(user_id: str, github_handle: str):
    from core.database import AsyncSessionLocal
    from modules.ai.services.github_service import github_scanner
    from models.user import User
    from sqlalchemy import select
    import logging
    
    await asyncio.sleep(2)
    async with AsyncSessionLocal() as session:
        try:
            data = await github_scanner.analyze_repositories(github_handle)
            result = await session.execute(select(User).where(User.id == user_id))
            user = result.scalars().first()
            if user:
                current_data = dict(user.dynamic_profile_data or {})
                if "github" not in current_data:
                    current_data["github"] = {}
                current_data["github"]["analysis"] = data
                user.dynamic_profile_data = current_data
                
                # Add skills to graph
                from models.skills import UserSkillNode, SkillTaxonomy
                from sqlalchemy.dialects.postgresql import insert
                import re
                
                skills_dict = data.get("ai_insights", {}).get("skills", {})
                for skill_name, level in skills_dict.items():
                    # Upsert skill taxonomy
                    slug = re.sub(r'[^a-z0-9]+', '-', skill_name.lower()).strip('-')
                    stmt = insert(SkillTaxonomy).values(name=skill_name, slug=slug, category="Technical").on_conflict_do_nothing(index_elements=['name'])
                    await session.execute(stmt)
                    
                    skill_res = await session.execute(select(SkillTaxonomy).where(SkillTaxonomy.name == skill_name))
                    skill_node = skill_res.scalars().first()
                    
                    if skill_node:
                        # Add to UserSkillNode
                        user_skill = UserSkillNode(
                            user_id=user.id,
                            skill_id=skill_node.id,
                            experience_level="INTERMEDIATE" # Defaulting for now
                        )
                        session.add(user_skill)
                
                await session.commit()
                logging.info(f"Successfully processed background GitHub analysis for {github_handle}")
        except Exception as e:
            logging.error(f"Failed to perform background GitHub analysis: {e}")

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

    async def _handle_oauth_user(self, email: str, provider: str, provider_id: str, profile_data: Dict[str, Any], ip_address: str, device_info: str, role: str = "user", intent: str = "login") -> Tuple[User, str, str]:
        from models.oauth import OAuthAccount
        from models.core import Role
        
        from sqlalchemy.orm import selectinload
        
        # 1. Check if user exists by email
        query = select(User).options(selectinload(User.roles)).where(User.email == email)
        result = await self.db.execute(query)
        user = result.scalars().first()

        if user:
            if intent == "register":
                raise HTTPException(status_code=400, detail="User already registered. Please sign in.")
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
            if not user.first_name and profile_data.get("first_name"):
                user.first_name = profile_data.get("first_name")
            if not user.last_name and profile_data.get("last_name"):
                user.last_name = profile_data.get("last_name")
            if not user.is_verified and profile_data.get("email_verified"):
                user.is_verified = True
            if provider == "google" and not user.google_id:
                user.google_id = provider_id
            if provider == "github" and not user.github_id:
                user.github_id = provider_id
            
            # Auto-fill profile fields if missing
            if user.profile:
                profile = user.profile[0] if isinstance(user.profile, list) else user.profile
                if not profile.location and profile_data.get("location"):
                    profile.location = profile_data.get("location")
                if not profile.about and profile_data.get("bio"):
                    profile.about = profile_data.get("bio")
                if provider == "github" and profile_data.get("username") and not profile.github_url:
                    profile.github_url = f"https://github.com/{profile_data['username']}"
                if not profile.portfolio_url and profile_data.get("blog"):
                    profile.portfolio_url = profile_data.get("blog")
                if profile_data.get("company") and not profile.headline:
                    profile.headline = f"Software Engineer at {profile_data.get('company')}"
            
            if not user.locale and profile_data.get("locale"):
                user.locale = profile_data.get("locale")
                
            # Update sync times
            user.last_login_at = datetime.utcnow()
            user.profile_synced_at = datetime.utcnow()
        else:
            # Removed strict login intent check to allow seamless OAuth sign-up/sign-in
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
                avatar_url=profile_data.get("avatar_url"),
                first_name=profile_data.get("first_name"),
                last_name=profile_data.get("last_name"),
                is_verified=profile_data.get("email_verified", False),
                auth_provider=provider,
                google_id=provider_id if provider == "google" else None,
                github_id=provider_id if provider == "github" else None,
                last_login_at=datetime.utcnow(),
                profile_synced_at=datetime.utcnow(),
                locale=profile_data.get("locale"),
                account_creation_method=f"oauth_{provider}"
            )
            
            # Find the requested role in DB
            role_query = select(Role).where(Role.role_name == role)
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
            
            # Map rich data if available
            headline = profile_data.get("bio") or (f"{profile_data.get('first_name', '')} {profile_data.get('last_name', '')}".strip() or username)
            full_name = f"{profile_data.get('first_name', '')} {profile_data.get('last_name', '')}".strip() or username
            
            github_url = f"https://github.com/{profile_data['username']}" if provider == 'github' and profile_data.get('username') else None
            company = profile_data.get("company")
            if company and not profile_data.get("bio"):
                headline = f"Software Engineer at {company}"
            
            new_profile = Profile(
                user_id=user.id,
                full_name=full_name,
                headline=headline,
                email=email,
                about=profile_data.get("bio", ""),
                portfolio_url=profile_data.get("blog", ""),
                location=profile_data.get("location", ""),
                github_url=github_url,
                visibility_mode="PUBLIC"
            )
            self.db.add(new_profile)
            
            # Add dynamic profile data
            user.dynamic_profile_data = {
                provider: {
                    "followers": profile_data.get("followers", 0),
                    "following": profile_data.get("following", 0),
                    "company": profile_data.get("company", ""),
                    "created_at": profile_data.get("created_at", ""),
                    "email_verified": profile_data.get("email_verified", False)
                }
            }
            
            # Add in-app notification
            try:
                from models.communication import Notification
                welcome_notification = Notification(
                    user_id=user.id,
                    type="SYSTEM_ALERT",
                    title="Welcome to the Neural Network!",
                    message=f"Welcome aboard, {full_name or username}. Your identity matrix has been initialized. We recommend setting up your skills node next.",
                    status="unread"
                )
                self.db.add(welcome_notification)
            except Exception as e:
                print(f"DEBUG: Failed to create welcome notification: {e}")

            # Enqueue welcome email
            try:
                from workers.notifications import send_email_alert
                send_email_alert.delay(str(user.id), "Welcome to SkillSutra!", "welcome_template", {"username": user.username})
            except Exception as e:
                print(f"DEBUG: Failed to enqueue welcome email: {e}")
                
            if provider == "github" and profile_data.get("username"):
                asyncio.create_task(perform_github_deep_analysis(str(user.id), profile_data["username"]))
        
        await self.db.commit()
        await self.db.refresh(user)

        # Check if MFA is enabled
        from models.iam import MFAMethod
        mfa_query = select(MFAMethod).where(MFAMethod.user_id == user.id, MFAMethod.is_enabled == True)
        mfa_res = await self.db.execute(mfa_query)
        mfa_method = mfa_res.scalars().first()

        if mfa_method and intent == "login":
            from core.security import create_mfa_token
            mfa_token = create_mfa_token(subject=user.id)
            return {"requires_mfa": True, "mfa_token": mfa_token}

        # Generate tokens
        # If user has multiple roles, just pick the first or fallback to default
        actual_role = user.roles[0].role_name if user.roles else role
        
        from modules.auth.core.session_service import SessionService
        from core.security import REFRESH_TOKEN_EXPIRE_DAYS
        
        jti = await SessionService.create_session(
            user_id=str(user.id),
            ip_address=ip_address,
            user_agent=device_info,
            expires_in_seconds=REFRESH_TOKEN_EXPIRE_DAYS * 86400
        )
        
        access_token = create_access_token(subject=user.id, role=actual_role, jti=jti)
        refresh_token = create_refresh_token(subject=user.id, jti=jti)

        return user, access_token, refresh_token

    async def handle_github_callback(self, code: str, ip_address: str, device_info: str, intent: str = "login") -> Tuple[User, str, str]:
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
            primary_email = next((e["email"] for e in emails if e.get("primary")), None)
            if not primary_email and emails:
                primary_email = emails[0].get("email")
            
            if not primary_email:
                raise HTTPException(status_code=400, detail="No email on GitHub account")

            profile_data = {
                "username": github_user.get("login"),
                "first_name": github_user.get("name", "").split(" ")[0] if github_user.get("name") else "",
                "last_name": " ".join(github_user.get("name", "").split(" ")[1:]) if github_user.get("name") else "",
                "avatar_url": github_user.get("avatar_url"),
                "bio": github_user.get("bio"),
                "location": github_user.get("location"),
                "locale": github_user.get("location"),
                "company": github_user.get("company"),
                "blog": github_user.get("blog"),
                "followers": github_user.get("followers", 0),
                "following": github_user.get("following", 0),
                "created_at": github_user.get("created_at")
            }

            return await self._handle_oauth_user(
                email=primary_email,
                provider="github",
                provider_id=str(github_user["id"]),
                profile_data=profile_data,
                ip_address=ip_address,
                device_info=device_info,
                intent=intent
            )

    async def link_github_account(self, code: str, user_id: str) -> dict:
        from models.oauth import OAuthAccount
        from sqlalchemy import select
        
        if not self.github_client_id:
            raise HTTPException(status_code=500, detail="GitHub OAuth not configured")

        async with httpx.AsyncClient() as client:
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
            access_token = token_response.json().get("access_token")
            if not access_token:
                raise HTTPException(status_code=400, detail="Invalid GitHub code")

            user_response = await client.get(
                "https://api.github.com/user",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            github_user = user_response.json()
            provider_id = str(github_user["id"])
            handle = github_user.get("login")

            # Link account
            result = await self.db.execute(select(User).where(User.id == user_id))
            user = result.scalars().first()
            if not user:
                raise HTTPException(status_code=404, detail="User not found")

            # Check if oauth account exists
            oauth_query = select(OAuthAccount).where(OAuthAccount.user_id == user.id, OAuthAccount.provider == "github")
            oauth_res = await self.db.execute(oauth_query)
            if not oauth_res.scalars().first():
                new_oauth = OAuthAccount(user_id=user.id, provider="github", provider_account_id=provider_id)
                self.db.add(new_oauth)
                await self.db.commit()

            # Trigger background analysis
            if handle:
                asyncio.create_task(perform_github_deep_analysis(str(user.id), handle))

            return {"status": "success", "message": "GitHub linked successfully. Deep analysis started in background."}

    async def handle_google_id_token(self, id_token: str, ip_address: str, device_info: str, role: str = "user", intent: str = "login") -> Tuple[User, str, str]:
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
                "avatar_url": idinfo.get("picture"),
                "email_verified": idinfo.get("email_verified", False),
                "locale": idinfo.get("locale")
            }
            
            return await self._handle_oauth_user(
                email=email,
                provider="google",
                provider_id=idinfo["sub"],
                profile_data=profile_data,
                ip_address=ip_address,
                device_info=device_info,
                role=role,
                intent=intent
            )
        except ValueError as e:
            # Invalid token
            raise HTTPException(status_code=400, detail=f"Invalid Google token: {str(e)}")
        except Exception as e:
            import traceback
            import logging
            logging.error(f"Error in handle_google_id_token: {str(e)}\n{traceback.format_exc()}")
            raise HTTPException(status_code=500, detail=f"Internal Google Auth Error: {str(e)}")

    async def handle_google_access_token(self, access_token: str, ip_address: str, device_info: str, role: str = "user", intent: str = "login") -> Tuple[User, str, str]:
        async with httpx.AsyncClient() as client:
            res = await client.get("https://www.googleapis.com/oauth2/v3/userinfo", headers={"Authorization": f"Bearer {access_token}"})
            if res.status_code != 200:
                raise HTTPException(status_code=400, detail="Invalid Google access token")
            
            userinfo = res.json()
            email = userinfo.get("email")
            if not email:
                raise HTTPException(status_code=400, detail="No email provided by Google")
                
            profile_data = {
                "first_name": userinfo.get("given_name", ""),
                "last_name": userinfo.get("family_name", ""),
                "avatar_url": userinfo.get("picture"),
                "email_verified": userinfo.get("email_verified", False),
                "locale": userinfo.get("locale")
            }
            
            return await self._handle_oauth_user(
                email=email,
                provider="google",
                provider_id=userinfo.get("sub"),
                profile_data=profile_data,
                ip_address=ip_address,
                device_info=device_info,
                role=role,
                intent=intent
            )
