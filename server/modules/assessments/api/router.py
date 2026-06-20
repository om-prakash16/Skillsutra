from fastapi import APIRouter, Depends
from pydantic import BaseModel

from core.response import success_response
from modules.auth.core.guards import get_current_user

router = APIRouter(prefix="/assessments", tags=["AI Assessments"])

class AssessmentSubmit(BaseModel):
    code_submission: str
    language: str
    time_taken_seconds: int

@router.post("/start")
async def start_assessment(
    type: str = "CODING_TEST",
    difficulty: str = "MEDIUM",
    user = Depends(get_current_user)
):
    """
    Generates a dynamic technical challenge using the AI Agent Engine.
    """
    # In reality, this invokes the AIAgentProfile (e.g. Technical Interviewer)
    # to generate a unique prompt so candidates can't memorize LeetCode answers.
    data = {
        "assessment_id": "assess-999",
        "type": type,
        "difficulty": difficulty,
        "prompt": "Design a rate limiter middleware in Python or Node.js. It should use a sliding window log algorithm and support distributed nodes via Redis.",
        "time_limit_minutes": 45,
        "status": "IN_PROGRESS"
    }
    
    return success_response(data=data, message="Assessment generated successfully")

@router.post("/{assessment_id}/submit")
async def submit_assessment(
    assessment_id: str,
    payload: AssessmentSubmit,
    user = Depends(get_current_user)
):
    """
    Evaluates the submitted code via the AI Engine and returns granular feedback.
    """
    # Mocking the AI evaluation step
    # We pretend the AI Agent parsed the code, ran static analysis, and scored it.
    score = 88.5
    
    data = {
        "assessment_id": assessment_id,
        "status": "COMPLETED",
        "score": score,
        "ai_feedback": {
            "strengths": [
                "Correctly implemented sliding window logic.",
                "Excellent use of Redis sorted sets (ZADD/ZREMRANGEBYSCORE)."
            ],
            "weaknesses": [
                "Missed edge case: handling Redis connection failures gracefully.",
                "Time complexity of ZREMRANGEBYSCORE was not optimally bounded."
            ],
            "suggestions": "Consider adding a local in-memory fallback cache if Redis goes down to ensure high availability."
        },
        "proof_score_impact": "+15 points to Backend Domain"
    }
    
    return success_response(data=data, message="Assessment evaluated successfully")
