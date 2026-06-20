from fastapi import APIRouter, Depends, Request, HTTPException, status
from typing import List, Dict, Any
from modules.auth.core.session_service import SessionService
from modules.auth.core.service import get_current_user

router = APIRouter()

@router.get("", response_model=List[Dict[str, Any]])
async def list_sessions(current_user: dict = Depends(get_current_user)):
    """
    List all active sessions for the currently authenticated user.
    """
    user_id = current_user.get("id") or current_user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user token")
        
    sessions = await SessionService.list_active_sessions(str(user_id))
    
    # Sort sessions by most recently active
    sessions.sort(key=lambda x: x.get("last_active", ""), reverse=True)
    return sessions

@router.delete("/{jti}", status_code=status.HTTP_204_NO_CONTENT)
async def revoke_session(jti: str, current_user: dict = Depends(get_current_user)):
    """
    Revoke a specific active session by its JTI.
    """
    user_id = str(current_user.get("id") or current_user.get("sub"))
    
    # Optional: Prevent revoking the current session if it's the only one
    # Or prevent revoking the session the user is currently holding without a specific endpoint
    current_jti = current_user.get("jti")
    if current_jti == jti:
        raise HTTPException(status_code=400, detail="Cannot revoke current active session via this endpoint. Use /logout instead.")
        
    revoked = await SessionService.revoke_session(user_id, jti)
    if not revoked:
        raise HTTPException(status_code=404, detail="Session not found or already revoked")
    
    return None

@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
async def revoke_all_other_sessions(current_user: dict = Depends(get_current_user)):
    """
    Log out of all devices EXCEPT the current one.
    """
    user_id = str(current_user.get("id") or current_user.get("sub"))
    current_jti = current_user.get("jti")
    
    sessions = await SessionService.list_active_sessions(user_id)
    
    for session in sessions:
        if session.get("jti") != current_jti:
            await SessionService.revoke_session(user_id, session.get("jti"))
            
    return None
