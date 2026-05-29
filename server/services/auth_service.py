from typing import Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from datetime import datetime
from models.user import User
from schemas.auth import UserCreate, UserLogin
from core.security import verify_password, get_password_hash, create_access_token, create_refresh_token
from fastapi import HTTPException, status

class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def register_user(self, user_in: UserCreate) -> User:
        # Check if user exists by email or username
        query = select(User).where(
            or_(User.email == user_in.email, User.username == user_in.username)
        )
        result = await self.db.execute(query)
        existing_user = result.scalars().first()
        
        if existing_user:
            if existing_user.email == user_in.email:
                raise HTTPException(status_code=400, detail="Email already registered")
            raise HTTPException(status_code=400, detail="Username already taken")

        from core.username_utils import is_valid_username, generate_unique_username
        if not is_valid_username(user_in.username):
            # If the user provided a bad username (e.g. spaces, dots), we can generate a valid one for them
            # or we can reject it. Since it's an explicit signup form, let's slugify it for them safely.
            async def check_username_exists(uname: str) -> bool:
                u_res = await self.db.execute(select(User).where(User.username == uname))
                return u_res.scalars().first() is not None
            final_username = await generate_unique_username(user_in.username, check_username_exists)
        else:
            final_username = user_in.username

        hashed_pwd = await get_password_hash(user_in.password)
        new_user = User(
            username=final_username,
            email=user_in.email,
            password_hash=hashed_pwd,
        )
        self.db.add(new_user)
        await self.db.flush()
        
        # Create default Profile
        from models.profile import Profile
        new_profile = Profile(
            user_id=new_user.id,
            headline=new_user.username,
            visibility_mode="PUBLIC"
        )
        self.db.add(new_profile)
        
        await self.db.commit()
        await self.db.refresh(new_user)
        
        # Enqueue welcome email
        try:
            from workers.notifications import send_email_alert
            send_email_alert.delay(str(new_user.id), "Welcome to SkillSutra!", "welcome_template", {"username": new_user.username})
        except Exception as e:
            print(f"DEBUG: Failed to enqueue welcome email: {e}")
            
        return new_user

    async def authenticate_user(self, login_data: UserLogin, ip_address: str, device_info: str) -> Tuple[User, str, str]:
        print("DEBUG: Inside authenticate_user", flush=True)
        query = select(User).where(
            or_(User.email == login_data.email_or_username, User.username == login_data.email_or_username)
        )
        print("DEBUG: Executing query", flush=True)
        result = await self.db.execute(query)
        print("DEBUG: Query executed", flush=True)
        user = result.scalars().first()
        print("DEBUG: User fetched", flush=True)

        if not user or not user.password_hash:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
            
        if not await verify_password(login_data.password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account disabled")

        access_token = create_access_token(subject=user.id, role="user")
        refresh_token = create_refresh_token(subject=user.id)

        # Store session in Redis
        from core.security import REFRESH_TOKEN_EXPIRE_DAYS
        from datetime import timedelta
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

    async def refresh_session(self, refresh_token: str, ip_address: str, device_info: str) -> Tuple[str, str]:
        from core.redis import redis_get, redis_set, redis_delete
        
        session_data = await redis_get(f"session:{refresh_token}")
        if not session_data:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token")

        expires_at = datetime.fromisoformat(session_data["expires_at"])
        if expires_at < datetime.utcnow():
            await redis_delete(f"session:{refresh_token}")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token")

        # Get user
        user_query = select(User).where(User.id == session_data["user_id"])
        u_result = await self.db.execute(user_query)
        user = u_result.scalars().first()

        if not user or not user.is_active:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not active")

        # Generate new tokens
        new_access = create_access_token(subject=user.id, role="user")
        new_refresh = create_refresh_token(subject=user.id)

        from core.security import REFRESH_TOKEN_EXPIRE_DAYS
        from datetime import timedelta
        
        new_expires_at = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        new_session_data = {
            "user_id": str(user.id),
            "device_info": device_info,
            "ip_address": ip_address,
            "expires_at": new_expires_at.isoformat()
        }
        
        # Invalidate old session
        await redis_delete(f"session:{refresh_token}")
        # Store new session
        await redis_set(f"session:{new_refresh}", new_session_data, ttl_seconds=REFRESH_TOKEN_EXPIRE_DAYS * 86400)
        
        return new_access, new_refresh

    async def logout(self, refresh_token: str):
        from core.redis import redis_delete
        await redis_delete(f"session:{refresh_token}")

    async def revoke_all_sessions(self, user_id: str):
        from core.redis import get_redis_client
        import json
        redis_client = get_redis_client()
        # Scan all session keys. In production with many keys, keep a set of sessions per user.
        # For simplicity, we scan.
        cursor = b"0"
        while cursor:
            cursor, keys = await redis_client.scan(cursor, match="session:*", count=100)
            for key in keys:
                data_bytes = await redis_client.get(key)
                if data_bytes:
                    session_data = json.loads(data_bytes)
                    if session_data.get("user_id") == str(user_id):
                        await redis_client.delete(key)

    async def forgot_password(self, email: str) -> bool:
        from models.recovery import PasswordResetToken
        from models.oauth import OAuthAccount
        from core.security import generate_secure_token, hash_token
        from datetime import datetime, timedelta
        
        query = select(User).where(User.email == email)
        result = await self.db.execute(query)
        user = result.scalars().first()
        
        if not user:
            # Prevent enumeration by returning True (success) anyway
            return True
            
        # Check if they are OAuth only
        oauth_query = select(OAuthAccount).where(OAuthAccount.user_id == user.id)
        oauth_res = await self.db.execute(oauth_query)
        oauth_accounts = oauth_res.scalars().all()
        
        if oauth_accounts and not user.password_hash:
            # They use OAuth. Send them an email reminding them.
            # (Email sending logic placeholder)
            print(f"DEBUG Email: User {email} uses OAuth. Please login with {oauth_accounts[0].provider}")
            return True
            
        # Generate token
        raw_token = generate_secure_token(64)
        hashed_token = hash_token(raw_token)
        
        # Save token to DB with 15 mins expiry
        expires_at = datetime.utcnow() + timedelta(minutes=15)
        reset_entry = PasswordResetToken(
            user_id=user.id,
            token_hash=hashed_token,
            expires_at=expires_at
        )
        self.db.add(reset_entry)
        await self.db.commit()
        
        # Dispatch email
        reset_link = f"https://app.skillsutra.com/auth/reset-password?token={raw_token}"
        print(f"DEBUG Email: Password reset link for {email}: {reset_link}")
        return True

    async def validate_reset_token(self, token: str) -> bool:
        from models.recovery import PasswordResetToken
        from core.security import hash_token
        from datetime import datetime
        
        hashed_token = hash_token(token)
        query = select(PasswordResetToken).where(PasswordResetToken.token_hash == hashed_token)
        result = await self.db.execute(query)
        entry = result.scalars().first()
        
        if not entry:
            return False
            
        if entry.expires_at < datetime.utcnow():
            return False
            
        return True

    async def reset_password(self, token: str, new_password: str) -> bool:
        from models.recovery import PasswordResetToken
        from core.security import hash_token, get_password_hash
        from datetime import datetime
        
        hashed_token = hash_token(token)
        query = select(PasswordResetToken).where(PasswordResetToken.token_hash == hashed_token)
        result = await self.db.execute(query)
        entry = result.scalars().first()
        
        if not entry or entry.expires_at < datetime.utcnow():
            raise HTTPException(status_code=400, detail="Invalid or expired token")
            
        # Update user password
        user_query = select(User).where(User.id == entry.user_id)
        user_res = await self.db.execute(user_query)
        user = user_res.scalars().first()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        user.password_hash = await get_password_hash(new_password)
        
        # Delete token
        await self.db.delete(entry)
        await self.db.commit()
        
        # Revoke all sessions
        await self.revoke_all_sessions(user.id)
        
        return True

    async def send_magic_link(self, email: str, request) -> bool:
        from models.oauth import MagicLink
        from core.security import generate_secure_token, hash_token
        from datetime import datetime, timedelta
        import os
        
        # Generate token
        raw_token = generate_secure_token(64)
        hashed_token = hash_token(raw_token)
        
        # Save token to DB with 15 mins expiry
        expires_at = datetime.utcnow() + timedelta(minutes=15)
        magic_entry = MagicLink(
            email=email,
            token_hash=hashed_token,
            expires_at=expires_at
        )
        self.db.add(magic_entry)
        await self.db.commit()
        
        # Dispatch email
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
        magic_link = f"{frontend_url}/auth/verify-magic?token={raw_token}"
        # (Email sending logic using Resend placeholder)
        print(f"DEBUG Email: Magic login link for {email}: {magic_link}", flush=True)
        return True

    async def verify_magic_link(self, token: str, ip_address: str, device_info: str) -> Tuple[User, str, str]:
        from models.oauth import MagicLink
        from core.security import hash_token, create_access_token, create_refresh_token
        from datetime import datetime
        import uuid
        
        hashed_token = hash_token(token)
        query = select(MagicLink).where(MagicLink.token_hash == hashed_token)
        result = await self.db.execute(query)
        entry = result.scalars().first()
        
        if not entry or entry.expires_at < datetime.utcnow():
            raise HTTPException(status_code=400, detail="Invalid or expired magic link token")
            
        # Get or create user
        email = entry.email
        user_query = select(User).where(User.email == email)
        user_res = await self.db.execute(user_query)
        user = user_res.scalars().first()
        
        if not user:
            from core.username_utils import generate_unique_username
            async def check_username_exists(uname: str) -> bool:
                u_res = await self.db.execute(select(User).where(User.username == uname))
                return u_res.scalars().first() is not None

            raw_name = email.split("@")[0]
            username = await generate_unique_username(raw_name, check_username_exists)

            user = User(
                username=username,
                email=email,
                is_active=True
            )
            self.db.add(user)
            await self.db.flush()
            
            # Create default Profile
            from models.profile import Profile
            new_profile = Profile(
                user_id=user.id,
                headline=user.username,
                visibility_mode="PUBLIC"
            )
            self.db.add(new_profile)
            
            # Enqueue welcome email
            try:
                from workers.notifications import send_email_alert
                send_email_alert.delay(str(user.id), "Welcome to SkillSutra!", "welcome_template", {"username": user.username})
            except Exception as e:
                print(f"DEBUG: Failed to enqueue welcome email: {e}")

        # Delete token
        await self.db.delete(entry)
        await self.db.commit()
        await self.db.refresh(user)

        # Generate tokens
        access_token = create_access_token(subject=user.id, role="user")
        refresh_token = create_refresh_token(subject=user.id)
        
        from core.security import REFRESH_TOKEN_EXPIRE_DAYS
        from datetime import timedelta
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
