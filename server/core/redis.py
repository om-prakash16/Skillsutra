import json
import logging
import redis.asyncio as redis
from typing import Any, Optional
from core.config import settings

logger = logging.getLogger(__name__)

_redis_client = None

def get_redis_client() -> redis.Redis:
    global _redis_client
    if _redis_client is None:
        try:
            _redis_client = redis.Redis(
                host=settings.REDIS_HOST,
                port=settings.REDIS_PORT,
                db=settings.REDIS_DB,
                decode_responses=True,
                socket_timeout=2.0,
                socket_connect_timeout=2.0
            )
        except Exception as e:
            logger.error(f"Failed to connect to Redis: {e}")
    return _redis_client

async def redis_get(key: str) -> Optional[Any]:
    client = get_redis_client()
    if not client: return None
    try:
        data = await client.get(key)
        return json.loads(data) if data else None
    except Exception as e:
        logger.error(f"Redis GET error for key {key}: {e}")
        return None

import random

async def redis_set(key: str, value: Any, ttl_seconds: int = 3600, apply_jitter: bool = True) -> bool:
    client = get_redis_client()
    if not client: return False
    try:
        if apply_jitter and ttl_seconds > 60:
            jitter = int(ttl_seconds * 0.1)
            ttl_seconds += random.randint(-jitter, jitter)
            
        await client.set(key, json.dumps(value), ex=ttl_seconds)
        return True
    except Exception as e:
        logger.error(f"Redis SET error for key {key}: {e}")
        return False

async def redis_delete(key: str) -> bool:
    client = get_redis_client()
    if not client: return False
    try:
        await client.delete(key)
        return True
    except Exception as e:
        logger.error(f"Redis DELETE error for key {key}: {e}")
        return False
