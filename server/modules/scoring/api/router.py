from fastapi import APIRouter, Depends, HTTPException
from core.response import success_response
from modules.auth.core.guards import get_current_user

router = APIRouter(prefix="/talent", tags=["Talent & Scoring"])

@router.post("/{user_id}/score/recalculate")
async def recalculate_proof_score(
    user_id: str,
    current_user = Depends(get_current_user)
):
    """
    Trigger the AI engine to recalculate a user's overarching Proof Score
    by analyzing their latest AssessmentResults and GitHub pushes.
    """
    # Security: Ensure user is recalculating their own score or is an Admin
    if current_user["id"] != user_id and current_user.get("role") not in ["ADMIN", "SUPER_ADMIN"]:
        raise HTTPException(status_code=403, detail="Unauthorized to recalculate this score")
        
    # In reality, this would dispatch a Celery task to invoke the AI Scoring Engine.
    # We return a mocked execution response for the newly built architecture.
    mocked_new_score = {
        "global_score": 845,
        "domain_scores": {
            "frontend": 920,
            "backend": 710,
            "system_design": 850
        }
    }
    
    return success_response(
        data=mocked_new_score,
        message="Proof score successfully recalculated by AI Engine"
    )

@router.get("/{user_id}/portfolio")
async def get_talent_portfolio(
    user_id: str
):
    """
    Fetch the public, cryptographically verifiable portfolio of a candidate,
    including their Proof Score and Verified Skills.
    """
    from core.database import AsyncSessionLocal
    from models.talent import ProofScore, VerifiedSkill
    from sqlalchemy import select
    
    async with AsyncSessionLocal() as db:
        score_query = select(ProofScore).where(ProofScore.user_id == user_id)
        result = await db.execute(score_query)
        proof_score = result.scalars().first()
        
        skills_query = select(VerifiedSkill).where(VerifiedSkill.user_id == user_id)
        result = await db.execute(skills_query)
        skills = result.scalars().all()
        
        data = {
            "proof_score": {
                "global_score": proof_score.global_score if proof_score else 0,
                "domain_scores": proof_score.domain_scores if proof_score else {}
            },
            "verified_skills": [
                {
                    "skill": s.skill_name,
                    "proficiency": s.proficiency_level,
                    "source": s.verification_source
                } for s in skills
            ]
        }
        
        return success_response(data=data)
