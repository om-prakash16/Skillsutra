import json
import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta

class SessionService:
    """
    Manages active User Sessions in Redis for high-performance retrieval and revocation.
    """
    
    @staticmethod
    def _get_redis():
        # Lazy import to avoid circular dependencies
        from core.redis import get_redis_client
        return get_redis_client()

    @staticmethod
    async def create_session(user_id: str, ip_address: str, user_agent: str, expires_in_seconds: int = 86400) -> str:
        """
        Creates a new session record in Redis and returns the uniquely generated JTI.
        """
        redis = SessionService._get_redis()
        jti = str(uuid.uuid4())
        
        session_data = {
            "jti": jti,
            "user_id": str(user_id),
            "created_at": datetime.utcnow().isoformat(),
            "last_active": datetime.utcnow().isoformat(),
            "ip_address": ip_address,
            "user_agent": user_agent,
            "device": "Web Browser" # To be enriched later by User-Agent parser
        }
        
        # Store in Redis: sessions:{user_id}:{jti}
        key = f"sessions:{user_id}:{jti}"
        await redis.setex(key, expires_in_seconds, json.dumps(session_data))
        
        return jti

    @staticmethod
    async def list_active_sessions(user_id: str) -> List[Dict[str, Any]]:
        """
        Retrieves all active sessions for a given user from Redis.
        """
        redis = SessionService._get_redis()
        pattern = f"sessions:{user_id}:*"
        
        # Note: SCAN is safer than KEYS in production, but aioredis .keys() is used here for brevity
        keys = await redis.keys(pattern)
        
        sessions = []
        for key in keys:
            data = await redis.get(key)
            if data:
                sessions.append(json.loads(data))
                
        return sessions

    @staticmethod
    async def revoke_session(user_id: str, jti: str) -> bool:
        """
        Revokes a specific session by deleting it from active sessions and adding it to the blacklist.
        """
        redis = SessionService._get_redis()
        key = f"sessions:{user_id}:{jti}"
        
        # Delete the active session
        deleted = await redis.delete(key)
        
        # Add the JTI to the global blacklist to ensure the JWT is invalid even before expiry
        # Default blacklist expiry is 24 hours (max JWT lifetime)
        await redis.setex(f"blacklist:{jti}", 86400, "true")
        
        return deleted > 0
        
    @staticmethod
    async def is_session_valid(user_id: str, jti: str) -> bool:
        """
        Checks if a session is still active (not revoked or expired).
        """
        redis = SessionService._get_redis()
        
        # 1. Check if the token is explicitly blacklisted
        is_blacklisted = await redis.get(f"blacklist:{jti}")
        if is_blacklisted:
            return False
            
        # 2. Check if the session still exists in the active sessions list
        # (This handles "Logout Everywhere" which deletes all active session keys)
        key = f"sessions:{user_id}:{jti}"
        exists = await redis.exists(key)
        
        if exists:
            # Touch the last_active timestamp
            # (In a real system, you might throttle this to avoid constant writes)
            pass
            
        return bool(exists)
