from core.celery_app import celery_app
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import async_sessionmaker, engine, AsyncSessionLocal
from sqlalchemy import select
from models.social import Follow
from core.redis import get_redis_client
import asyncio
from asgiref.sync import async_to_sync
import json

@celery_app.task(bind=True, name="modules.ecosystem.tasks.fanout_post_task")
def fanout_post_task(self, post_id: str, author_id: str, post_data: dict):
    """
    Fanout-on-Write for standard users. Push the post ID to followers' Redis feeds.
    """
    async_to_sync(_fanout_post)(post_id, author_id, post_data)

async def _fanout_post(post_id: str, author_id: str, post_data: dict):
    redis_client = get_redis_client()
    if not redis_client:
        return

    # Fetch followers
    async with AsyncSessionLocal() as session:
        query = select(Follow.follower_id).where(Follow.followed_id == author_id)
        result = await session.execute(query)
        followers = result.scalars().all()
    
    # Push to followers' feeds
    pipeline = redis_client.pipeline()
    for follower_id in followers:
        feed_key = f"user:{follower_id}:feed"
        
        # Add to left of list (newest first)
        pipeline.lpush(feed_key, json.dumps(post_data))
        
        # Cap feed at 500 items
        pipeline.ltrim(feed_key, 0, 499)
        
    await pipeline.execute()
