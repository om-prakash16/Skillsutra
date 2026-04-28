from fastapi import APIRouter, Depends
from portal.apps.ai.controller import AIController
from portal.core.security import get_current_user

router = APIRouter()
controller = AIController()

@router.post("/analyze-resume")
async def analyze_resume(data: dict, user=Depends(get_current_user)):
    return await controller.analyze_user_resume(data)

@router.post("/parse-jd")
async def parse_jd(data: dict, user=Depends(get_current_user)):
    return await controller.parse_jd(data)

@router.post("/generate-mcqs")
async def generate_mcqs(data: dict, user=Depends(get_current_user)):
    return await controller.get_mcqs(data)
