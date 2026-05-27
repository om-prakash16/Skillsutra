from core.celery_app import celery_app
from modules.ai.services.resume_service import resume_service
from asgiref.sync import async_to_sync

@celery_app.task(bind=True, name="modules.ai.tasks.analyze_resume_task")
def analyze_resume_task(self, user_id: str, resume_text: str):
    """
    Background task to analyze a resume using AI.
    """
    try:
        # We must run the async resume_service inside our sync celery wrapper
        result = async_to_sync(resume_service.analyze_resume)(user_id=user_id, resume_text=resume_text)
        
        frontend_data = {
            "skills": result.get("extracted_skills", []),
            "soft_skills": result.get("soft_skills", []),
            "experience_years": result.get("experience_years", 0),
            "roles": [result.get("primary_role", "Developer")],
            "education": result.get("education", []),
            "forensic_confidence": result.get("forensic_confidence", 85)
        }
        return frontend_data
    except Exception as e:
        self.retry(exc=e, countdown=5, max_retries=3)
