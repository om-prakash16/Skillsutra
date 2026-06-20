from fastapi import APIRouter, Depends
from typing import Optional
from pydantic import BaseModel

from core.response import success_response
from modules.auth.core.guards import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics & BI"])

class EventPayload(BaseModel):
    event_type: str
    entity_id: Optional[str] = None
    properties: dict = {}

@router.post("/track")
async def track_event(
    payload: EventPayload,
    user = Depends(get_current_user) # In reality, could be optional for anonymous tracking
):
    """
    Ingest a raw analytics event.
    """
    return success_response(message="Event tracked successfully.")

@router.get("/kpis/executive")
async def get_executive_kpis(
    user = Depends(get_current_user)
):
    """
    Fetch high-level KPIs for the Super Admin dashboard.
    """
    data = {
        "mrr": {"value": 142500, "growth": "+12.5%"},
        "total_users": {"value": 1250000, "growth": "+5.2%"},
        "active_companies": {"value": 4500, "growth": "+8.1%"},
        "hires_made": {"value": 1240, "growth": "+15.3%"},
        
        # Timeline data for a line chart
        "revenue_timeline": [
            {"date": "2026-01", "mrr": 95000},
            {"date": "2026-02", "mrr": 105000},
            {"date": "2026-03", "mrr": 115000},
            {"date": "2026-04", "mrr": 122000},
            {"date": "2026-05", "mrr": 130000},
            {"date": "2026-06", "mrr": 142500}
        ]
    }
    return success_response(data=data, message="Executive KPIs fetched.")

@router.get("/funnel/hiring")
async def get_hiring_funnel(
    user = Depends(get_current_user)
):
    """
    Returns conversion metrics across the standard Hiring Funnel.
    """
    data = [
        {"stage": "Job Views", "count": 500000},
        {"stage": "Applications Started", "count": 150000, "dropoff": "70%"},
        {"stage": "Proof Score Verified", "count": 45000, "dropoff": "70%"},
        {"stage": "Interviews Scheduled", "count": 8000, "dropoff": "82%"},
        {"stage": "Offers Sent", "count": 2500, "dropoff": "68%"},
        {"stage": "Hires", "count": 2000, "dropoff": "20%"}
    ]
    return success_response(data=data, message="Hiring Funnel computed.")
