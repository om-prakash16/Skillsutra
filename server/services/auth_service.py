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

        hashed_pwd = await get_password_hash(user_in.password)
        new_user = User(
            first_name=user_in.first_name,
            last_name=user_in.last_name,
            username=user_in.username,
            email=user_in.email,
            hashed_password=hashed_pwd,
            auth_provider="local"
        )
        self.db.add(new_user)
        await self.db.commit()
        await self.db.refresh(new_user)
        return new_user

    async def authenticate_user(self, login_data: UserLogin, ip_address: str, device_info: str) -> Tuple[User, str, str]:
        query = select(User).where(
            or_(User.email == login_data.email_or_username, User.username == login_data.email_or_username)
        )
        result = await self.db.execute(query)
        user = result.scalars().first()

        if not user or not user.hashed_password:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
            
        if not await verify_password(login_data.password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account disabled")

        access_token = create_access_token(subject=user.id, role=user.role)
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
        new_access = create_access_token(subject=user.id, role=user.role)
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
