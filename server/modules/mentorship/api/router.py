from fastapi import APIRouter, Depends
from typing import Optional
from pydantic import BaseModel
from datetime import datetime

from core.response import success_response
from modules.auth.core.guards import get_current_user

router = APIRouter(prefix="/mentorship", tags=["Mentorship"])

class BookingRequest(BaseModel):
    session_type: str # CAREER_GUIDANCE, MOCK_INTERVIEW, PORTFOLIO_REVIEW
    preferred_time: datetime
    message: Optional[str] = None

@router.get("/mentors")
async def get_mentors(
    domain: Optional[str] = None,
    user = Depends(get_current_user)
):
    """
    Search and filter the mentor directory.
    """
    # Mocking the Mentor search results
    data = [
        {
            "id": "m1",
            "name": "Sarah Jenkins",
            "headline": "Ex-Meta Staff Engineer | System Design Expert",
            "rating": 4.9,
            "reviews": 124,
            "hourly_rate": 150,
            "domains": ["Backend", "System Design"],
            "availability": "High"
        },
        {
            "id": "m2",
            "name": "David Chen",
            "headline": "Engineering Manager @ Stripe | Resume Reviewer",
            "rating": 4.8,
            "reviews": 89,
            "hourly_rate": 100,
            "domains": ["Frontend", "Career Guidance"],
            "availability": "Medium"
        }
    ]
    
    if domain:
        data = [m for m in data if domain in m["domains"]]
        
    return success_response(data=data)

@router.post("/mentors/{mentor_id}/book")
async def book_mentor_session(
    mentor_id: str,
    payload: BookingRequest,
    user = Depends(get_current_user)
):
    """
    Book a mentorship session. Handles calendaring and billing integration.
    """
    # In reality, this would deduct credits from Wallet and create a CalendarEvent
    data = {
        "booking_id": "book-777",
        "mentor_id": mentor_id,
        "mentee_id": user.get("id"),
        "status": "CONFIRMED",
        "session_link": "https://meet.skillsutra.com/book-777",
        "scheduled_for": payload.preferred_time
    }
    
    return success_response(data=data, message="Mentorship session booked successfully")
