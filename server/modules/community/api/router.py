from fastapi import APIRouter, Depends
from typing import Optional
from pydantic import BaseModel

from core.response import success_response
from modules.auth.core.guards import get_current_user

router = APIRouter(prefix="/communities", tags=["Communities"])

class PostCreate(BaseModel):
    title: str
    content: str
    category: Optional[str] = "GENERAL"

@router.get("/")
async def list_communities(
    user = Depends(get_current_user)
):
    """
    Fetch all active communities, including gated ones.
    """
    data = [
        {
            "id": "c1",
            "name": "React Developers",
            "description": "Discuss the latest in React, Next.js, and frontend architecture.",
            "member_count": 12450,
            "is_gated": False,
            "tags": ["Frontend", "React"]
        },
        {
            "id": "c2",
            "name": "Staff Engineers Circle",
            "description": "Exclusive community for verified Staff+ Engineers.",
            "member_count": 890,
            "is_gated": True,
            "required_proof_score": 850,
            "tags": ["Leadership", "System Design"]
        }
    ]
    return success_response(data=data)

@router.post("/{community_id}/posts")
async def create_post(
    community_id: str,
    payload: PostCreate,
    user = Depends(get_current_user)
):
    """
    Create a new discussion thread in a community.
    """
    data = {
        "post_id": "post-99",
        "community_id": community_id,
        "author_id": user.get("id"),
        "title": payload.title,
        "content": payload.content,
        "category": payload.category,
        "created_at": "2026-06-11T20:00:00Z"
    }
    return success_response(data=data, message="Post created successfully")

@router.get("/{community_id}/posts")
async def get_posts(
    community_id: str,
    user = Depends(get_current_user)
):
    """
    Fetch discussion threads for a community.
    """
    data = [
        {
            "id": "post-1",
            "author": {"name": "Alice Johnson", "role": "Frontend Lead"},
            "title": "Thoughts on React 19 Compiler?",
            "content": "Is anyone using it in production yet? Seeing some weird edge cases...",
            "upvotes": 42,
            "comments": 15,
            "created_at": "2 hours ago"
        }
    ]
    return success_response(data=data)
