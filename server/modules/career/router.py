from fastapi import APIRouter, HTTPException, Depends, Body
from pydantic import BaseModel
from modules.auth.core.service import get_current_user
from modules.career.service import CareerService
from modules.career.models import CareerGoalCreate, CareerTaskCreate

class RoadmapGenerateRequest(BaseModel):
    target_role: str
    current_state: str = ""
    timeline: str = ""
    daily_routine: str = ""

router = APIRouter()
career_service = CareerService()


@router.post("/goals")
async def create_goal(goal: CareerGoalCreate, current_user=Depends(get_current_user)):
    """
    Start a new career growth roadmap.
    """
    try:
        # sub is the user_id in our token
        data = goal.model_dump()
        data["user_id"] = current_user.get("sub")
        return await career_service.create_goal(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/tasks")
async def add_task(task: CareerTaskCreate, current_user=Depends(get_current_user)):
    """
    Add a milestone or specific task to a goal.
    """
    try:
        # Verification of goal ownership should be done in service or here
        return await career_service.add_task(task.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/goals")
async def get_goals(current_user=Depends(get_current_user)):
    """
    Retrieve user roadmap and progress.
    """
    try:
        return await career_service.get_user_goals(current_user.get("sub"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/roadmap/generate")
async def generate_roadmap(req: RoadmapGenerateRequest, current_user=Depends(get_current_user)):
    user_id = current_user.get("sub")
    try:
        from modules.users.core.service import UserService
        profile = await UserService.get_full_profile(user_id)
        user_skills = [s["name"] for s in profile.get("skills", [])] if profile else []
        
        data = await career_service.generate_roadmap(
            user_id, 
            req.target_role, 
            user_skills, 
            req.current_state, 
            req.timeline, 
            req.daily_routine
        )
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/roadmap")
async def get_roadmap(current_user=Depends(get_current_user)):
    user_id = current_user.get("sub")
    try:
        data = await career_service.get_roadmap(user_id)
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/roadmap/milestone")
async def update_roadmap_milestone(
    roadmap_id: str = Body(..., embed=True),
    new_index: int = Body(..., embed=True),
    current_user=Depends(get_current_user)
):
    user_id = current_user.get("sub")
    try:
        data = await career_service.update_roadmap_milestone(user_id, roadmap_id, new_index)
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/gap-analysis")
async def get_gap_analysis(target_role: str, current_user=Depends(get_current_user)):
    user_id = current_user.get("sub")
    try:
        from modules.users.core.service import UserService
        from modules.ai.services.gap_analyzer import SkillGapAnalyzer
        profile = await UserService.get_full_profile(user_id)
        user_skills = [s["name"] for s in profile.get("skills", [])] if profile else []
        
        analyzer = SkillGapAnalyzer()
        data = await analyzer.analyze_gap({"skills": user_skills}, target_role)
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/badges")
async def get_user_badges(current_user=Depends(get_current_user)):
    """Retrieve the badges and certifications earned by the user."""
    user_id = current_user.get("sub") or current_user.get("id")
    # Placeholder: fetch badges from db
    badges = [
        {"name": "React Master", "type": "SKILL_VERIFIED"},
        {"name": "System Design Complete", "type": "COURSE_COMPLETED"}
    ]
    return {"status": "success", "data": badges}

