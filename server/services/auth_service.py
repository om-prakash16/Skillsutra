from typing import Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from datetime import datetime, timezone
from models.user import User
from schemas.auth import UserCreate, UserLogin
from core.security import verify_password, get_password_hash, create_access_token, create_refresh_token
from fastapi import HTTPException, status

class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def register_user(self, user_in: UserCreate) -> User:
        username_to_check = user_in.username or (user_in.name.replace(" ", "").lower() if user_in.name else user_in.email.split("@")[0])
        
        # Check if user exists by email or username
        query = select(User).where(
            or_(User.email == user_in.email, User.username == username_to_check)
        )
        result = await self.db.execute(query)
        existing_user = result.scalars().first()
        
        if existing_user:
            if existing_user.email == user_in.email:
                raise HTTPException(status_code=400, detail="Email already registered")
            if user_in.username:
                raise HTTPException(status_code=400, detail="Username already taken")

        from core.username_utils import is_valid_username, generate_unique_username
        
        async def check_username_exists(uname: str) -> bool:
            u_res = await self.db.execute(select(User).where(User.username == uname))
            return u_res.scalars().first() is not None
            
        if not is_valid_username(username_to_check) or existing_user:
            final_username = await generate_unique_username(username_to_check, check_username_exists)
        else:
            final_username = username_to_check

        hashed_pwd = await get_password_hash(user_in.password)
        new_user = User(
            username=final_username,
            email=user_in.email,
            password_hash=hashed_pwd,
            is_active=False
        )
        self.db.add(new_user)
        await self.db.flush()
        
        # Assign Role
        requested_role = user_in.role or "user"
        from models.core import Role
        role_res = await self.db.execute(select(Role).where(Role.role_name == requested_role))
        db_role = role_res.scalars().first()
        if db_role:
            new_user.roles.append(db_role)
            
        # Create default Profile
        from models.profile import Profile
        new_profile = Profile(
            user_id=new_user.id,
            full_name=user_in.name or user_in.first_name or final_username,
            headline=user_in.headline or user_in.name or user_in.first_name or final_username,
            email=user_in.email,
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
            
        # Send Verification Magic Link
        await self.send_magic_link(new_user.email, None)
            
        return new_user

    async def send_otp(self, email: str, name: str) -> bool:
        from models.oauth import EmailOTP
        from core.security import hash_token
        from core.email import send_email_async
        from datetime import datetime, timezone, timedelta
        import secrets
        
        # Rate limit check can be done at router level
        
        otp_code = "".join(secrets.choice("0123456789") for _ in range(6))
        hashed_otp = hash_token(otp_code)
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=5)
        
        otp_entry = EmailOTP(
            email=email,
            otp_hash=hashed_otp,
            expires_at=expires_at
        )
        self.db.add(otp_entry)
        await self.db.commit()
        
        # Send Email
        subject = "Your Verification Code - Skillsutra"
        html = f"""
        <h2>Verify Your Email</h2>
        <p>Hello {name or 'there'},</p>
        <p>Your 6-digit verification code is:</p>
        <h1 style="letter-spacing: 5px; color: #4F46E5;">{otp_code}</h1>
        <p>This code will expire in 5 minutes.</p>
        """
        await send_email_async(email, subject, html)
        print(f"DEBUG Email: OTP for {email} is {otp_code}")
        return True

    async def verify_otp(self, email: str, code: str) -> str:
        from models.oauth import EmailOTP
        from core.security import hash_token, create_setup_token
        from datetime import datetime, timezone
        
        hashed = hash_token(code)
        query = select(EmailOTP).where(EmailOTP.email == email, EmailOTP.otp_hash == hashed)
        result = await self.db.execute(query)
        entry = result.scalars().first()
        
        if not entry or entry.expires_at < datetime.now(timezone.utc):
            raise HTTPException(status_code=400, detail="Invalid or expired OTP")
            
        # Clean up all OTPs for this email
        await self.db.execute(EmailOTP.__table__.delete().where(EmailOTP.email == email))
        await self.db.commit()
        
        # Return setup token
        return create_setup_token(email)

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

        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="You are not registered. Please sign up.")
            
        if not user.password_hash:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Account uses a social login. Please try logging in with Google or GitHub.")
            
        if not await verify_password(login_data.password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account disabled or unverified. Please check your email for the verification link.")

        # Fetch roles to embed in token
        user_roles = [r.role_name for r in user.roles] if getattr(user, 'roles', None) else ["user"]
        primary_role = user_roles[0] if user_roles else "user"
        if "admin" in user_roles:
            primary_role = "admin"

        access_token = create_access_token(subject=user.id, role=primary_role)
        refresh_token = create_refresh_token(subject=user.id)

        # Store session in Redis
        from core.security import REFRESH_TOKEN_EXPIRE_DAYS
        from datetime import timedelta
        from core.redis import redis_set
        
        expires_at = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
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
        if expires_at < datetime.now(timezone.utc):
            await redis_delete(f"session:{refresh_token}")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token")

        # Get user
        user_query = select(User).where(User.id == session_data["user_id"])
        u_result = await self.db.execute(user_query)
        user = u_result.scalars().first()

        if not user or not user.is_active:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not active")

        # Generate new tokens
        user_roles = [r.role_name for r in user.roles] if getattr(user, 'roles', None) else ["user"]
        primary_role = user_roles[0] if user_roles else "user"
        if "admin" in user_roles:
            primary_role = "admin"
            
        new_access = create_access_token(subject=user.id, role=primary_role)
        new_refresh = create_refresh_token(subject=user.id)

        from core.security import REFRESH_TOKEN_EXPIRE_DAYS
        from datetime import timedelta
        
        new_expires_at = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
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
        from datetime import datetime, timezone, timedelta
        
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
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)
        reset_entry = PasswordResetToken(
            user_id=user.id,
            token_hash=hashed_token,
            expires_at=expires_at
        )
        self.db.add(reset_entry)
        await self.db.commit()
        
        # Dispatch email
        import os
        from core.email import send_email_async
        
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
        reset_link = f"{frontend_url}/auth/reset-password?token={raw_token}"
        
        subject = "Reset Your Password - Skillsutra"
        html = f"""
        <h2>Password Reset Request</h2>
        <p>We received a request to reset your password. Click the link below to set a new password:</p>
        <p><a href="{reset_link}" style="padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <br>
        <p><small>{reset_link}</small></p>
        """
        
        # Run email sending in background (or await it)
        # We'll just await it directly for simplicity, it's run in a thread anyway.
        await send_email_async(email, subject, html)
        print(f"DEBUG Email: Password reset link for {email}: {reset_link}", flush=True)
        return True

    async def validate_reset_token(self, token: str) -> bool:
        from models.recovery import PasswordResetToken
        from core.security import hash_token
        from datetime import datetime, timezone
        
        hashed_token = hash_token(token)
        query = select(PasswordResetToken).where(PasswordResetToken.token_hash == hashed_token)
        result = await self.db.execute(query)
        entry = result.scalars().first()
        
        if not entry:
            return False
            
        if entry.expires_at < datetime.now(timezone.utc):
            return False
            
        return True

    async def reset_password(self, token: str, new_password: str) -> bool:
        from models.recovery import PasswordResetToken
        from core.security import hash_token, get_password_hash
        from datetime import datetime, timezone
        
        hashed_token = hash_token(token)
        query = select(PasswordResetToken).where(PasswordResetToken.token_hash == hashed_token)
        result = await self.db.execute(query)
        entry = result.scalars().first()
        
        if not entry or entry.expires_at < datetime.now(timezone.utc):
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
        from datetime import datetime, timezone, timedelta
        import os
        
        # Generate token
        raw_token = generate_secure_token(64)
        hashed_token = hash_token(raw_token)
        
        # Save token to DB with 15 mins expiry
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)
        magic_entry = MagicLink(
            email=email,
            token_hash=hashed_token,
            expires_at=expires_at
        )
        self.db.add(magic_entry)
        await self.db.commit()
        
        # Dispatch email
        from core.email import send_email_async
        
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
        magic_link = f"{frontend_url}/auth/verify-magic?token={raw_token}"
        
        subject = "Your Magic Login Link - Skillsutra"
        html = f"""
        <h2>Your Magic Login Link</h2>
        <p>Click the button below to securely sign in to your account. This link will expire in 15 minutes.</p>
        <p><a href="{magic_link}" style="padding: 12px 24px; background-color: #10B981; color: white; font-weight: bold; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 10px;">Sign In Now</a></p>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p><small>{magic_link}</small></p>
        """
        
        await send_email_async(email, subject, html)
        print(f"DEBUG Email: Magic login link for {email}: {magic_link}", flush=True)
        return True

    async def verify_magic_link(self, token: str, ip_address: str, device_info: str) -> dict:
        from models.oauth import MagicLink
        from core.security import hash_token, create_access_token, create_refresh_token, create_setup_token
        from datetime import datetime, timezone
        import uuid
        
        hashed_token = hash_token(token)
        query = select(MagicLink).where(MagicLink.token_hash == hashed_token)
        result = await self.db.execute(query)
        entry = result.scalars().first()
        
        if not entry or entry.expires_at < datetime.now(timezone.utc):
            raise HTTPException(status_code=400, detail="Invalid or expired magic link token")
            
        # Get user
        email = entry.email
        user_query = select(User).where(User.email == email)
        user_res = await self.db.execute(user_query)
        user = user_res.scalars().first()
        
        if not user:
            # Delete token
            await self.db.delete(entry)
            await self.db.commit()
            return {"needs_setup": True, "setup_token": create_setup_token(email), "email": email}
        elif not user.is_active:
            user.is_active = True

        # Delete token
        await self.db.delete(entry)
        await self.db.commit()
        await self.db.refresh(user)

        # Generate tokens
        user_roles = [r.role_name for r in user.roles] if getattr(user, 'roles', None) else ["user"]
        primary_role = user_roles[0] if user_roles else "user"
        if "admin" in user_roles:
            primary_role = "admin"
            
        access_token = create_access_token(subject=user.id, role=primary_role)
        refresh_token = create_refresh_token(subject=user.id)
        
        from core.security import REFRESH_TOKEN_EXPIRE_DAYS
        from datetime import timedelta
        from core.redis import redis_set
        
        expires_at = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        session_data = {
            "user_id": str(user.id),
            "device_info": device_info,
            "ip_address": ip_address,
            "expires_at": expires_at.isoformat()
        }
        await redis_set(f"session:{refresh_token}", session_data, ttl_seconds=REFRESH_TOKEN_EXPIRE_DAYS * 86400)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "needs_setup": False
        }

    async def complete_magic_setup(self, token: str, password: str, name: str, ip_address: str, device_info: str) -> dict:
        from core.security import decode_token, get_password_hash, create_access_token, create_refresh_token
        from core.username_utils import generate_unique_username
        
        payload = decode_token(token)
        if not payload or payload.get("type") != "setup":
            raise HTTPException(status_code=400, detail="Invalid or expired setup token")
            
        email = payload.get("sub")
        
        # Check if user already exists
        user_res = await self.db.execute(select(User).where(User.email == email))
        if user_res.scalars().first():
            raise HTTPException(status_code=400, detail="User already registered. Please sign in.")
            
        async def check_username_exists(uname: str) -> bool:
            u_res = await self.db.execute(select(User).where(User.username == uname))
            return u_res.scalars().first() is not None

        raw_name = name or email.split("@")[0]
        username = await generate_unique_username(raw_name, check_username_exists)
        hashed_pwd = await get_password_hash(password)

        user = User(
            username=username,
            email=email,
            password_hash=hashed_pwd,
            is_active=True,
            first_name=name.split(" ")[0] if name else None,
            last_name=" ".join(name.split(" ")[1:]) if name and " " in name else None,
            account_creation_method="magic_link"
        )
        self.db.add(user)
        await self.db.flush()
        
        from models.profile import Profile
        new_profile = Profile(
            user_id=user.id,
            full_name=name or username,
            headline=username,
            email=email,
            visibility_mode="PUBLIC"
        )
        self.db.add(new_profile)
        await self.db.commit()
        await self.db.refresh(user)
        
        # Try sending welcome email
        try:
            from workers.notifications import send_email_alert
            send_email_alert.delay(str(user.id), "Welcome to SkillSutra!", "welcome_template", {"username": user.username})
        except Exception as e:
            pass
            
        # Log them in
        user_roles = [r.role_name for r in user.roles] if getattr(user, 'roles', None) else ["user"]
        primary_role = user_roles[0] if user_roles else "user"
        access_token = create_access_token(subject=user.id, role=primary_role)
        refresh_token = create_refresh_token(subject=user.id)
        
        from core.security import REFRESH_TOKEN_EXPIRE_DAYS
        from datetime import datetime, timezone, timedelta
        from core.redis import redis_set
        
        expires_at = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        session_data = {
            "user_id": str(user.id),
            "device_info": device_info,
            "ip_address": ip_address,
            "expires_at": expires_at.isoformat()
        }
        await redis_set(f"session:{refresh_token}", session_data, ttl_seconds=REFRESH_TOKEN_EXPIRE_DAYS * 86400)
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "needs_setup": False
        }
