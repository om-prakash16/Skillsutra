from fastapi import APIRouter, HTTPException, Depends
from uuid import UUID
from modules.auth.core.service import get_current_user
from modules.competitions.schemas import CompetitionCreate, UserPreferenceUpdate
from modules.competitions.service import CompetitionService

router = APIRouter()
competition_service = CompetitionService()

@router.get("/")
async def get_competitions():
    """List all active competitions."""
    try:
        data = await competition_service.get_competitions()
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/")
async def create_competition(req: CompetitionCreate, user=Depends(get_current_user)):
    """Create a new competition."""
    user_id = UUID(user.get("sub"))
    try:
        data = await competition_service.create_competition(req.model_dump(), user_id)
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/preferences")
async def get_preferences(user=Depends(get_current_user)):
    """Get user's competition preferences."""
    user_id = UUID(user.get("sub"))
    try:
        data = await competition_service.get_preferences(user_id)
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/preferences")
async def update_preferences(req: UserPreferenceUpdate, user=Depends(get_current_user)):
    """Update user's competition preferences."""
    user_id = UUID(user.get("sub"))
    try:
        data = await competition_service.update_preferences(user_id, req.model_dump())
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{comp_id}/notify-matches")
async def notify_matches(comp_id: UUID, user=Depends(get_current_user)):
    """Trigger notifications for users matching the competition."""
    # In a real app, this might be restricted to admins or creators
    try:
        result = await competition_service.notify_matches(comp_id)
        return {"status": "success", "notified_count": result.get("notified_count", 0)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
