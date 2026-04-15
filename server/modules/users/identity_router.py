from fastapi import APIRouter, HTTPException, Depends, Body
from typing import List, Dict, Any, Optional
from modules.auth.service import get_current_user
from modules.users.identity_service import IdentityService
from modules.users.identity_proof_service import IdentityProofService

router = APIRouter()
identity_service = IdentityService()
proof_service = IdentityProofService()

@router.post("/profile/identity/submit")
async def submit_id(id_type: str = Body(..., embed=True), document_url: str = Body(..., embed=True), current_user = Depends(get_current_user)):
    """
    Submit hardware/identity proof for verification.
    """
    try:
        return await proof_service.submit_identity(current_user["sub"], id_type, document_url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/profile/identity/status")
async def get_id_status(user_id: Optional[str] = None, current_user = Depends(get_current_user)):
    """
    Check verification status.
    """
    try:
        target_uid = user_id or current_user["sub"]
        # Standard implementation would fetch from user_identities
        from core.supabase import get_supabase
        sb = get_supabase()
        res = sb.table("user_identities").select("*").eq("user_id", target_uid).execute()
        return res.data[0] if res.data else {"id_status": "not_started"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/profile/privacy")
async def update_privacy(visibility: str = Body(..., embed=True), current_user = Depends(get_current_user)):
    """
    Control profile visibility (public, private, recruiters_only).
    """
    try:
        if visibility not in ["public", "private", "recruiters_only"]:
            raise HTTPException(status_code=400, detail="Invalid visibility level")
        return await identity_service.update_privacy_settings(current_user["sub"], visibility)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/connections/request")
async def request_connection(target_user_id: str = Body(..., embed=True), current_user = Depends(get_current_user)):
    """
    Send a connection request to another professional.
    """
    try:
        return await identity_service.request_connection(current_user["sub"], target_user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/connections/list")
async def get_connections(current_user = Depends(get_current_user)):
    """
    Fetch your professional network.
    """
    try:
        return await identity_service.list_connections(current_user["sub"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/connections/timeline/{user_id}")
async def get_timeline(user_id: str, current_user = Depends(get_current_user)):
    """
    Fetch education and work history timeline.
    """
    try:
        return await identity_service.get_user_timeline(user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
