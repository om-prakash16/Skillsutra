import jwt
import httpx
import logging
import time
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from fastapi import Security, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWKClient

from core.config import settings
from core.logging import ProtocolLogger
from core.exceptions import AuthorizationError

logger = ProtocolLogger.get_logger("auth")
security = HTTPBearer()

# ─── JWKS Key Cache ────────────────────────────────────────────────────────────
# Caches Keycloak's public signing keys to avoid fetching on every request.
_jwks_client: Optional[PyJWKClient] = None
_jwks_last_refresh: float = 0
_JWKS_REFRESH_INTERVAL = 21600  # 6 hours


def _get_jwks_client() -> PyJWKClient:
    """Returns a cached PyJWKClient for Keycloak's JWKS endpoint."""
    global _jwks_client, _jwks_last_refresh
    now = time.time()
    if _jwks_client is None or (now - _jwks_last_refresh) > _JWKS_REFRESH_INTERVAL:
        _jwks_client = PyJWKClient(settings.KEYCLOAK_JWKS_URL)
        _jwks_last_refresh = now
        logger.info(f"JWKS keys refreshed from {settings.KEYCLOAK_JWKS_URL}")
    return _jwks_client


class AuthService:
    @staticmethod
    def verify_keycloak_token(token: str) -> Dict[str, Any]:
        """
        Verifies a Keycloak-issued JWT using RS256 public key from JWKS.
        Returns the decoded token payload.
        """
        try:
            jwks_client = _get_jwks_client()
            signing_key = jwks_client.get_signing_key_from_jwt(token)
            
            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256"],
                audience="account",
                options={
                    "verify_iss": True,
                    "verify_aud": True,
                    "verify_exp": True,
                },
                issuer=settings.KEYCLOAK_ISSUER,
            )
            return payload
        except jwt.ExpiredSignatureError:
            raise AuthorizationError(message="Token has expired")
        except jwt.InvalidAudienceError:
            # Keycloak tokens may have different audience configs — retry without strict aud
            try:
                jwks_client = _get_jwks_client()
                signing_key = jwks_client.get_signing_key_from_jwt(token)
                payload = jwt.decode(
                    token,
                    signing_key.key,
                    algorithms=["RS256"],
                    options={
                        "verify_iss": True,
                        "verify_aud": False,
                        "verify_exp": True,
                    },
                    issuer=settings.KEYCLOAK_ISSUER,
                )
                return payload
            except Exception as e:
                logger.error(f"Token verification failed (audience retry): {e}")
                raise AuthorizationError(message="Token is invalid or has expired")
        except Exception as e:
            logger.error(f"Token verification failed: {e}")
            raise AuthorizationError(message="Token is invalid or has expired")

    @staticmethod
    async def get_current_user(
        credentials: HTTPAuthorizationCredentials = Security(security),
    ) -> Dict[str, Any]:
        """
        Validates a Keycloak JWT and returns the verified user payload.
        
        The returned dict has the same shape used by all existing guards:
        {
            "id": "<keycloak-user-uuid>",
            "sub": "<keycloak-user-uuid>",
            "email": "user@example.com",
            "name": "Full Name",
            "roles": ["user", "company", ...],
            "realm_access": {...},
            ...all other Keycloak claims
        }
        """
        token = credentials.credentials
        payload = AuthService.verify_keycloak_token(token)
        
        # Extract user ID
        user_id = payload.get("sub")
        if not user_id:
            raise AuthorizationError(message="Token missing subject claim")
        
        # Extract roles from Keycloak's realm_access.roles
        realm_access = payload.get("realm_access", {})
        roles = realm_access.get("roles", [])
        
        # Filter out Keycloak internal roles
        internal_roles = {
            "offline_access", "uma_authorization", "default-roles-skillsutra",
        }
        user_roles = [r for r in roles if r not in internal_roles]
        if not user_roles:
            user_roles = ["user"]
        
        # Normalize payload to match the shape expected by guards.py
        payload["id"] = user_id
        payload["roles"] = user_roles
        payload["email"] = payload.get("email", "")
        payload["name"] = payload.get("name", payload.get("preferred_username", ""))
        
        return payload

    @staticmethod
    async def get_admin_token() -> Optional[str]:
        """
        Gets a service account token for Keycloak Admin REST API calls.
        Used for operations like assigning roles to users.
        """
        if not settings.KEYCLOAK_API_CLIENT_SECRET:
            logger.warning("KEYCLOAK_API_CLIENT_SECRET not set — admin operations unavailable")
            return None
            
        async with httpx.AsyncClient() as client:
            response = await client.post(
                settings.KEYCLOAK_TOKEN_URL,
                data={
                    "grant_type": "client_credentials",
                    "client_id": settings.KEYCLOAK_API_CLIENT_ID,
                    "client_secret": settings.KEYCLOAK_API_CLIENT_SECRET,
                },
            )
            if response.status_code == 200:
                return response.json().get("access_token")
            logger.error(f"Failed to get admin token: {response.status_code} {response.text}")
            return None

    @staticmethod
    async def assign_realm_role(user_id: str, role_name: str) -> bool:
        """
        Assigns a realm role to a user via Keycloak Admin REST API.
        """
        admin_token = await AuthService.get_admin_token()
        if not admin_token:
            return False
        
        headers = {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}
        
        async with httpx.AsyncClient() as client:
            # 1. Get the role representation
            role_resp = await client.get(
                f"{settings.KEYCLOAK_ADMIN_URL}/roles/{role_name}",
                headers=headers,
            )
            if role_resp.status_code != 200:
                logger.error(f"Role '{role_name}' not found in Keycloak")
                return False
            role_data = role_resp.json()
            
            # 2. Assign role to user
            assign_resp = await client.post(
                f"{settings.KEYCLOAK_ADMIN_URL}/users/{user_id}/role-mappings/realm",
                headers=headers,
                json=[role_data],
            )
            return assign_resp.status_code in (200, 204)


# Global instances for dependency injection
auth_service = AuthService()


async def get_current_user(user=Depends(auth_service.get_current_user)):
    """Module-level dependency wrapper — used by all guards and routers."""
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

    import db.engine as engine
    if not engine.pool:
        return []

    try:
        from core.db import get_db
        db = get_db()
        # Optimized query
        response = await (
            db.table("user_roles")
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
