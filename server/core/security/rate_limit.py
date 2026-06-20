import time
from fastapi import Request, HTTPException
from functools import wraps

# Reusing the mock structure from cache.py
class RedisRateLimitMock:
    def __init__(self):
        self.store = {}
    
    async def get_count(self, key: str, window: int) -> int:
        current_time = int(time.time())
        # Clean up old timestamps
        timestamps = [t for t in self.store.get(key, []) if current_time - t < window]
        timestamps.append(current_time)
        self.store[key] = timestamps
        return len(timestamps)

redis_client = RedisRateLimitMock()

def rate_limit(max_requests: int = 100, window_seconds: int = 60):
    """
    Dependency/Decorator to protect APIs from abuse via sliding window rate limiting.
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            request: Request = kwargs.get("request")
            if not request:
                for arg in args:
                    if isinstance(arg, Request):
                        request = arg
                        break
            
            if request:
                # Typically use IP or User ID
                client_ip = request.client.host if request.client else "unknown"
                path = request.url.path
                key = f"rate_limit:{client_ip}:{path}"
                
                count = await redis_client.get_count(key, window_seconds)
                
                if count > max_requests:
                    raise HTTPException(
                        status_code=429, 
                        detail=f"Too Many Requests. Limit {max_requests} per {window_seconds}s."
                    )
                    
            return await func(*args, **kwargs)
        return wrapper
    return decorator
