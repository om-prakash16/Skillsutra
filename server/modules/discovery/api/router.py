from fastapi import APIRouter, Depends
from typing import Optional

from core.response import success_response
from modules.auth.core.guards import get_current_user

router = APIRouter(prefix="/discovery", tags=["Discovery & Intelligence"])

@router.get("/matches/talent")
async def get_talent_matches(
    job_id: Optional[str] = None,
    user = Depends(get_current_user)
):
    """
    Returns AI-generated talent matches for a recruiter based on their active Jobs.
    Calculates a 0-100 match score dynamically.
    """
    # Mocking AI Match logic based on Proof Scores and Knowledge Graph
    data = [
        {
            "candidate_id": "c1",
            "name": "Alex Mercer",
            "headline": "Senior Backend Engineer",
            "match_score": 94,
            "match_reasons": [
                "Has a verified Proof Score of 890 in Backend Systems (Top 5%).",
                "Knowledge Graph indicates strong AWS experience which matches job requirements.",
                "Candidate recently solved a distributed locking assessment."
            ],
            "status": "OPEN_TO_WORK",
            "proof_score_avg": 875
        },
        {
            "candidate_id": "c2",
            "name": "Sarah Jenkins",
            "headline": "Full Stack Developer",
            "match_score": 82,
            "match_reasons": [
                "Strong React skills match Frontend requirements.",
                "Slight gap in Postgres experience, but high aptitude score suggests fast learning."
            ],
            "status": "PASSIVE",
            "proof_score_avg": 810
        }
    ]
    return success_response(data=data, message="Talent matches generated.")

@router.get("/trending")
async def get_trending_insights(
    user = Depends(get_current_user)
):
    """
    Returns trending skills, companies, and jobs based on recent search volume.
    """
    data = {
        "trending_skills": [
            {"name": "Rust", "growth": "+45%", "demand_level": "HIGH"},
            {"name": "FastAPI", "growth": "+32%", "demand_level": "HIGH"},
            {"name": "LLM Ops", "growth": "+120%", "demand_level": "CRITICAL"}
        ],
        "trending_companies": [
            {"name": "OpenAI", "hiring_velocity": "Very High"},
            {"name": "Stripe", "hiring_velocity": "High"}
        ]
    }
    return success_response(data=data, message="Trending insights fetched.")
