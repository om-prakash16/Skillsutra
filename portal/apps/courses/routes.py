from fastapi import APIRouter, Depends
from portal.apps.courses.service import CourseService
from portal.core.security import get_current_user
from typing import List

router = APIRouter()
service = CourseService()

@router.post("/recommend")
async def recommend_courses(missing_skills: List[str], user=Depends(get_current_user)):
    """
    Suggest courses based on a list of missing skills.
    """
    return await service.get_bridge_recommendations(missing_skills)

@router.get("/")
async def list_all_courses():
    return service.repository.get_all_courses().data
