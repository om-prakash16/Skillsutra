from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from core.database import get_db_session
from core.response import success_response, error_response
from modules.auth.core.service import get_current_user
from modules.feed.service import FeedService
from schemas.social import PostCreate, EnrichedPostResponse

router = APIRouter()

@router.get("/posts")
async def get_feed(
    limit: int = Query(20, ge=1, le=50),
    offset: int = Query(0, ge=0),
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    try:
        user_id = UUID(current_user["sub"])
        service = FeedService(db)
        posts = await service.get_feed_posts(user_id=user_id, limit=limit, offset=offset)
        return success_response(data=posts)
    except Exception as e:
        return error_response(str(e), status_code=500)

@router.post("/posts")
async def create_post(
    payload: PostCreate,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    try:
        user_id = UUID(current_user["sub"])
        service = FeedService(db)
        post = await service.create_post(user_id=user_id, post_data=payload)
        return success_response(data={"id": str(post.id)}, message="Post created successfully")
    except Exception as e:
        return error_response(str(e), status_code=500)

@router.post("/posts/{post_id}/like")
async def toggle_like(
    post_id: UUID,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    try:
        user_id = UUID(current_user["sub"])
        service = FeedService(db)
        result = await service.toggle_like(user_id=user_id, post_id=post_id)
        return success_response(data=result)
    except ValueError as ve:
        return error_response(str(ve), status_code=404)
    except Exception as e:
        return error_response(str(e), status_code=500)
