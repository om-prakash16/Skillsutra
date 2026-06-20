import functools
import logging
import json
from typing import Any, Callable, TypeVar
from cachetools import TTLCache
from core.redis import redis_get, redis_set, get_redis_client

logger = logging.getLogger(__name__)

T = TypeVar("T")

# In-memory TTL cache fallback for expensive operations
# Default: 1000 items max, 5 minutes expiry
_AI_CACHE = TTLCache(maxsize=1000, ttl=300)

def cache_result(ttl: int = 300, maxsize: int = 1000):
    """
    TTL cache decorator for async functions using Redis.
    Falls back to TTLCache if Redis fails.
    Uses function name and arguments as the cache key.
    """
    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        @functools.wraps(func)
        async def wrapper(*args: Any, **kwargs: Any) -> Any:
            # Create a simple cache key from func name and args
            key = f"cache:{func.__module__}:{func.__name__}:{str(args)}:{str(kwargs)}"
            
            # 1. Try Redis
            try:
                cached_val = await redis_get(key)
                if cached_val is not None:
                    logger.debug(f"Redis cache hit for {func.__name__}")
                    return cached_val
            except Exception as e:
                logger.warning(f"Redis cache get failed: {e}")

            # 2. Try In-Memory Fallback
            if key in _AI_CACHE:
                logger.debug(f"Memory cache hit for {func.__name__}")
                return _AI_CACHE[key]
            
            logger.debug(f"Cache miss for {func.__name__}")
            result = await func(*args, **kwargs)

            # Save to Redis
            try:
                await redis_set(key, result, ttl_seconds=ttl)
            except Exception as e:
                logger.warning(f"Redis cache set failed: {e}")
                
            # Save to Memory Fallback
            try:
                _AI_CACHE[key] = result
            except ValueError:
                pass # Unhashable or too large

            return result
        return wrapper
    return decorator

async def clear_ai_cache():
    """Manually clear the global AI cache and Redis cache prefix."""
    _AI_CACHE.clear()
    
    client = get_redis_client()
    if client:
        try:
            # Note: in a large production system, keys * is dangerous, 
            # but since this is an explicit clear, we do a scan
            cursor = '0'
            while cursor != 0:
                cursor, keys = await client.scan(cursor=cursor, match="cache:*", count=100)
                if keys:
                    await client.delete(*keys)
        except Exception as e:
            logger.error(f"Failed to clear Redis cache: {e}")

    logger.info("Cache cleared.")
