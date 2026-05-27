from fastapi import APIRouter, Depends, Query, Body
from core.response import success_response
from modules.auth.core.service import get_current_user
from modules.auth.core.guards import require_company_or_admin

router = APIRouter(prefix="/gigs", tags=["Freelance Gigs"])

@router.get("/")
async def list_gigs(
    limit: int = Query(20)
):
    """List available side gigs and freelance contracts."""
    gigs = [
        {
            "id": "uuid-gig-1",
            "title": "Build a Redis caching layer",
            "budget": {"min": 500, "max": 800, "currency": "USD"},
            "company_id": "uuid-company"
        }
    ]
    return success_response(data=gigs)

@router.post("/")
async def create_gig(
    payload: dict = Body(...),
    auth_guard = Depends(require_company_or_admin)
):
    """Company posts a new freelance gig."""
    # Production: Extract skills and generate AI embedding for matching.
    return success_response(data=payload, message="Gig posted successfully")

@router.post("/{gig_id}/proposals")
async def submit_gig_proposal(
    gig_id: str,
    payload: dict = Body(...),
    current_user = Depends(get_current_user)
):
    """Freelancer applies to a gig with a proposal."""
    proposal = {
        "gig_id": gig_id,
        "freelancer_id": current_user.get("sub"),
        "cover_letter": payload.get("cover_letter"),
        "proposed_budget": payload.get("proposed_budget"),
        "status": "SUBMITTED"
    }
    return success_response(data=proposal, message="Proposal submitted successfully")
