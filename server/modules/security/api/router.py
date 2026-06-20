from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
import logging

from core.database import get_db_session
from core.response import success_response
from modules.auth.core.guards import require_admin
from models.user import User
from services.auth_service import AuthService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/security/lockdown", tags=["Security Operations"])

class UserLockdownRequest(BaseModel):
    user_id: str
    reason: str

@router.post("/user", dependencies=[Depends(require_admin)])
async def lockdown_user(
    request: UserLockdownRequest,
    db: AsyncSession = Depends(get_db_session)
):
    """
    Instantly lock down a specific compromised account.
    """
    result = await db.execute(select(User).filter(User.id == request.user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # 1. Disable the account in Postgres
    user.is_active = False
    await db.commit()
    
    # 2. Invalidate all active JWT tokens for this user in Redis
    auth_service = AuthService(db)
    await auth_service.revoke_all_sessions(request.user_id)
    
    return success_response(message=f"User {user.email} has been locked down successfully.")

@router.post("/global", dependencies=[Depends(require_admin)])
async def global_kill_switch(
    db: AsyncSession = Depends(get_db_session)
):
    """
    THE KILL SWITCH.
    Use only in the event of a catastrophic, system-wide data leak.
    This purges all Redis sessions, logging all users out instantly without dropping websockets.
    """
    try:
        from core.redis import get_redis_client
        redis_client = get_redis_client()
        
        # Iterate over all session:* keys and delete them.
        # This keeps our cache and websocket data intact.
        cursor = b"0"
        while cursor:
            cursor, keys = await redis_client.scan(cursor, match="session:*", count=500)
            if keys:
                await redis_client.delete(*keys)
                
        # We also need to wipe user_sessions:* tracker sets
        cursor = b"0"
        while cursor:
            cursor, keys = await redis_client.scan(cursor, match="user_sessions:*", count=500)
            if keys:
                await redis_client.delete(*keys)
        
        logger.critical("GLOBAL KILL SWITCH ACTIVATED. All sessions purged.")
        
        return success_response(message="GLOBAL LOCKDOWN INITIATED. All sessions have been purged.")
    except Exception as e:
        logger.error(f"Kill switch failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to initiate global lockdown.")
