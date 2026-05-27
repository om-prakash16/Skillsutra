from datetime import datetime, timedelta
from typing import Any, Union, Optional
from jose import jwt, JWTError
import bcrypt
import os

# Use a specific JWT Secret, falling back to a default if not set
SECRET_KEY = os.getenv("JWT_SECRET", "super-secret-key-please-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

async def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a bcrypt hash using bcrypt directly."""
    def _verify():
        try:
            return bcrypt.checkpw(
                plain_password.encode("utf-8"),
                hashed_password.encode("utf-8")
            )
        except Exception:
            return False
    import asyncio
    return await asyncio.to_thread(_verify)

async def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt directly."""
    def _hash():
        return bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")
    import asyncio
    return await asyncio.to_thread(_hash)

def create_access_token(subject: Union[str, Any], role: str = "user") -> str:
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "role": role,
        "type": "access"
    }
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(subject: Union[str, Any]) -> str:
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "type": "refresh"
    }
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
