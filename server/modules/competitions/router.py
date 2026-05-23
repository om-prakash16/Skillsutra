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

@router.post("/save/{comp_id}")
async def save_competition(comp_id: UUID, user=Depends(get_current_user)):
    user_id = UUID(user.get("sub"))
    try:
        res = await competition_service.save_competition(user_id, comp_id)
        return {"status": "success", "data": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/saved")
async def get_saved_competitions(user=Depends(get_current_user)):
    user_id = UUID(user.get("sub"))
    try:
        res = await competition_service.get_saved_competitions(user_id)
        return {"status": "success", "data": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/teams/create")
async def create_team(comp_id: UUID, name: str, user=Depends(get_current_user)):
    user_id = UUID(user.get("sub"))
    try:
        res = await competition_service.create_team(user_id, comp_id, name)
        return {"status": "success", "data": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/teams/join")
async def join_team(team_id: UUID, role: str = "Developer", user=Depends(get_current_user)):
    user_id = UUID(user.get("sub"))
    try:
        res = await competition_service.join_team(user_id, team_id, role)
        return {"status": "success", "data": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/teams/invite")
async def invite_member(team_id: UUID, invitee_id: UUID, role: str = "Developer", user=Depends(get_current_user)):
    leader_id = UUID(user.get("sub"))
    try:
        res = await competition_service.invite_member(leader_id, team_id, invitee_id, role)
        return {"status": "success", "data": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/teams/my")
async def get_my_teams(user=Depends(get_current_user)):
    user_id = UUID(user.get("sub"))
    try:
        res = await competition_service.get_my_teams(user_id)
        return {"status": "success", "data": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/teams/{comp_id}")
async def get_teams(comp_id: UUID):
    try:
        res = await competition_service.get_teams(comp_id)
        return {"status": "success", "data": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/teams/approve")
async def approve_member(team_id: UUID, member_id: UUID, approve: bool = True, user=Depends(get_current_user)):
    leader_id = UUID(user.get("sub"))
    try:
        res = await competition_service.approve_member(leader_id, team_id, member_id, approve)
        return {"status": "success", "approved": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

