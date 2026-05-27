from fastapi import APIRouter, Depends, HTTPException, Query
from core.response import success_response
from modules.auth.core.service import get_current_user

router = APIRouter()

@router.get("/topics")
async def list_topics():
    """List all available discussion topics."""
    # Placeholder
    topics = [{"id": "uuid-1", "name": "React.js"}, {"id": "uuid-2", "name": "Interview Prep"}]
    return success_response(data=topics)

@router.post("/topics/{topic_id}/posts")
async def create_post(
    topic_id: str,
    payload: dict,
    current_user=Depends(get_current_user)
):
    """Create a new post in a specific topic."""
    post = {
        "id": "uuid-post-1",
        "topic_id": topic_id,
        "title": payload.get("title"),
        "content": payload.get("content"),
        "user_id": current_user.get("sub")
    }
    return success_response(data=post, message="Post created successfully")

@router.get("/topics/{topic_id}/posts")
async def get_posts_by_topic(
    topic_id: str,
    limit: int = Query(20, ge=1, le=100)
):
    """Retrieve posts for a topic."""
    posts = []
    return success_response(data=posts)

@router.post("/mentors/book")
async def book_mentor(
    payload: dict,
    current_user=Depends(get_current_user)
):
    """Book a session with a mentor."""
    booking = {
        "id": "uuid-booking-1",
        "mentor_id": payload.get("mentor_id"),
        "mentee_id": current_user.get("sub"),
        "status": "REQUESTED"
    }
    return success_response(data=booking, message="Mentor booking requested")

@router.get("/groups")
async def list_community_groups():
    """List networking groups (e.g., AI/ML Startups, Backend Devs)."""
    groups = [
        {"id": "uuid-g1", "name": "AI/ML Developers", "industry": "AI"},
        {"id": "uuid-g2", "name": "System Design Masters", "industry": "Software Engineering"}
    ]
    return success_response(data=groups)

@router.post("/groups/{group_id}/join")
async def join_community_group(
    group_id: str,
    current_user=Depends(get_current_user)
):
    """Join a specific networking group."""
    return success_response(data={"group_id": group_id, "joined": True}, message="Successfully joined the group")

@router.get("/events")
async def list_industry_events():
    """List upcoming AMAs, webinars, and hackathons."""
    events = [
        {"id": "uuid-e1", "title": "System Design AMA with FAANG Engineers", "is_virtual": True},
        {"id": "uuid-e2", "title": "AI Hackathon Spring 2026", "is_virtual": False}
    ]
    return success_response(data=events)
