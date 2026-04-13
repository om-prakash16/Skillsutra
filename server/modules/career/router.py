from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from modules.auth.service import get_current_user
from modules.career.service import CareerService
from modules.career.models import CareerGoalCreate, CareerTaskCreate

router = APIRouter()
career_service = CareerService()

@router.post("/goals")
async def create_goal(goal: CareerGoalCreate, current_user = Depends(get_current_user)):
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
async def add_task(task: CareerTaskCreate, current_user = Depends(get_current_user)):
    """
    Add a milestone or specific task to a goal.
    """
    try:
        # Verification of goal ownership should be done in service or here
        return await career_service.add_task(task.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/goals")
async def get_goals(current_user = Depends(get_current_user)):
    """
    Retrieve user roadmap and progress.
    """
    try:
        return await career_service.get_user_goals(current_user.get("sub"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
