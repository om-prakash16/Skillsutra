from portal.apps.ai.service import AIService
from fastapi import HTTPException

class AIController:
    def __init__(self):
        self.service = AIService()

    async def analyze_user_resume(self, data: dict):
        text = data.get("resume_text")
        if not text:
            raise HTTPException(status_code=400, detail="Missing resume_text")
        return await self.service.analyze_resume(text)

    async def parse_jd(self, data: dict):
        text = data.get("jd_text")
        if not text:
            raise HTTPException(status_code=400, detail="Missing jd_text")
        return await self.service.parse_job_description(text)

    async def get_mcqs(self, data: dict):
        skills = data.get("skills", [])
        count = data.get("count", 5)
        return await self.service.generate_assessment_questions(skills, count)
