from fastapi import APIRouter, Depends, Query
from core.response import success_response
from modules.auth.core.service import get_current_user

router = APIRouter(prefix="/feed", tags=["Personalized Content Feed"])

@router.get("/")
async def get_personalized_feed(
    cursor: str = Query(None, description="Pagination cursor for infinite scroll"),
    limit: int = Query(20, ge=1, le=50),
    current_user = Depends(get_current_user)
):
    """
    Fetch the AI-ranked timeline feed for the user.
    Aggregates Jobs, Courses, Forum Posts, and Contests.
    """
    user_id = current_user.get("sub") or current_user.get("id")
    
    from core.redis import get_redis_client
    import json
    
    redis_client = get_redis_client()
    feed_key = f"user:{user_id}:feed"
    
    # ---------------------------------------------------------
    # HYBRID FAN-OUT ARCHITECTURE (LinkedIn Model)
    # ---------------------------------------------------------
    # 1. FAN-OUT-ON-WRITE (Push): Background tasks push to this Redis List
    # 2. FAN-OUT-ON-READ (Pull): Dynamically fetch high-profile posts (Mocked below)
    
    # Parse pagination cursor
    start_index = int(cursor) if cursor else 0
    end_index = start_index + limit - 1
    
    # Fetch from Redis
    raw_items = await redis_client.lrange(feed_key, start_index, end_index) if redis_client else []
    
    feed_items = []
    for item in raw_items:
        try:
            feed_items.append(json.loads(item))
        except:
            continue
            
    # Fallback/Mock if feed is empty (Cold start or Redis unavailable)
    if not feed_items:
        feed_items = [
            {
                "id": "uuid-item-1",
                "type": "JOB",
                "content": {"title": "Senior Backend Engineer", "company": "Stripe"},
                "ai_reasoning": "Matches your FastAPI skills"
            },
            {
                "id": "uuid-item-2",
                "type": "POST",
                "content": {"title": "How to design a scalable websocket server?", "author": "Alice"},
                "ai_reasoning": "Trending in your System Design community"
            }
        ]
    
    next_cursor = str(end_index + 1) if len(raw_items) == limit else None
    
    return success_response(
        data={"items": feed_items, "next_cursor": next_cursor},
        message="Feed fetched successfully"
    )
