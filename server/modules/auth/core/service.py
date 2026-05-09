import jwt
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from fastapi import Security, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from core.config import settings
from core.logging import ProtocolLogger
from core.supabase import get_supabase
from core.exceptions import AuthorizationError

logger = ProtocolLogger.get_logger("auth")
security = HTTPBearer()

class AuthService:
    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """Generates a secure JWT access token with standard claims."""
        to_encode = data.copy()
        now = datetime.utcnow()
        expire = now + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
        
        to_encode.update({
            "exp": expire,
            "iat": now,
            "iss": "verified-identity-auth",
            "aud": "verified-identity-api"
        })
        
        return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

    @staticmethod
    async def get_current_user(
        credentials: HTTPAuthorizationCredentials = Security(security),
    ) -> Dict[str, Any]:
        """
        Validates the JWT and returns the verified user payload.
        Implements strict Issuer and Audience checks.
        """
        token = credentials.credentials

        # 1. Try Custom JWT
        try:
            payload = jwt.decode(
                token, 
                settings.JWT_SECRET, 
                algorithms=[settings.JWT_ALGORITHM],
                audience="verified-identity-api",
                issuer="verified-identity-auth"
            )
            user_id = payload.get("sub") or payload.get("id")
            if user_id:
                payload["id"] = user_id
                return payload
        except jwt.PyJWTError as e:
            logger.debug(f"Custom JWT decode failed: {e}")
            pass

        # 2. Try Supabase Auth Verification
        db = get_supabase()
        if db:
            try:
                user_res = db.auth.get_user(token)
                if user_res.user:
                    return {
                        "id": user_res.user.id,
                        "email": user_res.user.email,
                        "role": user_res.user.user_metadata.get("role", "USER"),
                        "metadata": user_res.user.user_metadata
                    }
            except Exception:
                pass

        raise AuthorizationError(message="Token is invalid or has expired")

# Global instances for dependency injection
auth_service = AuthService()

async def get_current_user(user=Depends(auth_service.get_current_user)):
    return user

# In-memory permission cache with memory protection
_PERMISSION_CACHE: Dict[str, tuple] = {}
MAX_CACHE_SIZE = 5000

async def get_user_permissions(user_id: str) -> List[str]:
    """Fetches permissions for a user with memory-leak protection and caching."""
    now = datetime.utcnow()
    
    # 1. Cache Lookup
    if user_id in _PERMISSION_CACHE:
        perms, expiry = _PERMISSION_CACHE[user_id]
        if now < expiry:
            return perms

    # 2. Global Cache Cleanup (if too large)
    if len(_PERMISSION_CACHE) > MAX_CACHE_SIZE:
        # Clear oldest 10%
        keys_to_clear = list(_PERMISSION_CACHE.keys())[:int(MAX_CACHE_SIZE * 0.1)]
        for k in keys_to_clear:
            del _PERMISSION_CACHE[k]

    from db.engine import db_client
    if not db_client:
        return []

    try:
        # Optimized query
        response = await (
            db_client.table("user_roles")
            .select("roles:role_id(role_permissions(permissions(permission_name)))")
            .eq("user_id", user_id)
            .execute()
        )

        permissions = set()
        for entry in response.data or []:
            role = entry.get("roles", {})
            for rp in role.get("role_permissions", []):
                perm = rp.get("permissions", {}).get("permission_name")
                if perm:
                    permissions.add(perm)

        perm_list = list(permissions)
        # Cache for 10 minutes
        _PERMISSION_CACHE[user_id] = (perm_list, now + timedelta(minutes=10))
        return perm_list
    except Exception as e:
        logger.error(f"Failed to fetch permissions for {user_id}: {e}")
        return []

def require_permission(permission: str):
    """Decorator/Dependency to enforce RBAC."""
    async def permission_checker(user=Depends(get_current_user)):
        user_id = user.get("id")
        perms = await get_user_permissions(user_id)

        if permission not in perms:
            raise AuthorizationError(
                message=f"Access denied. Required permission: {permission}"
            )
        return user
    return permission_checker
