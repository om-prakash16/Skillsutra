import time
from typing import Dict, Tuple
from fastapi import Request, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from core.logging import ProtocolLogger

logger = ProtocolLogger.get_logger("middleware.rate_limit")

class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Production-grade in-memory rate limiter with leak protection.
    Uses a sliding-window algorithm.
    """
    def __init__(
        self, 
        app, 
        limit: int = 100, 
        window: int = 60,
        max_tracked_clients: int = 10000
    ):
        super().__init__(app)
        self.limit = limit
        self.window = window
        self.max_tracked_clients = max_tracked_clients
        self.storage: Dict[str, list] = {}
        self.last_cleanup = time.time()

    def _cleanup_all(self, now: float):
        """Global cleanup to prevent memory leaks from inactive clients."""
        if now - self.last_cleanup < 300: # Cleanup every 5 minutes
            return
        
        expired_keys = [
            k for k, timestamps in self.storage.items() 
            if not timestamps or now - timestamps[-1] > self.window
        ]
        for k in expired_keys:
            del self.storage[k]
        
        # If still too many, clear oldest 20%
        if len(self.storage) > self.max_tracked_clients:
            sorted_keys = sorted(self.storage.keys(), key=lambda k: self.storage[k][-1] if self.storage[k] else 0)
            for k in sorted_keys[:int(self.max_tracked_clients * 0.2)]:
                del self.storage[k]
                
        self.last_cleanup = now

    async def dispatch(self, request: Request, call_next):
        # 1. Identify Client
        request_id = getattr(request.state, "request_id", "unknown")
        user_id = getattr(request.state, "user_id", None)
        client_id = f"u_{user_id}" if user_id else f"i_{request.client.host}"
        
        # 2. Global Memory Protection
        now = time.time()
        self._cleanup_all(now)
        
        # 3. Check Limit
        if client_id not in self.storage:
            self.storage[client_id] = []
            
        # Sliding window cleanup
        self.storage[client_id] = [t for t in self.storage[client_id] if now - t < self.window]
        
        if len(self.storage[client_id]) >= self.limit:
            logger.warning(f"Rate limit exceeded [ReqID: {request_id}] for {client_id}")
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "error": {
                        "type": "invalid_request_error",
                        "code": "rate_limit_exceeded",
                        "message": "Too many requests. Please try again later.",
                        "request_id": request_id
                    }
                }
            )
            
        self.storage[client_id].append(now)
        return await call_next(request)
