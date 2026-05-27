from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
import logging
import hashlib

logger = logging.getLogger(__name__)

class IdempotencyMiddleware(BaseHTTPMiddleware):
    """
    Enterprise Idempotency Middleware.
    Ensures that POST/PUT/PATCH requests with an 'Idempotency-Key' header 
    are not processed multiple times.
    """
    def __init__(self, app):
        super().__init__(app)
        # Mocking a Redis cache for idempotency keys
        self.processed_keys = set()

    async def dispatch(self, request: Request, call_next):
        if request.method not in ["POST", "PUT", "PATCH"]:
            return await call_next(request)

        idempotency_key = request.headers.get("Idempotency-Key")
        if not idempotency_key:
            # If no key is provided, we just pass it through.
            # In a strict enterprise system, we might reject the request.
            return await call_next(request)

        # Hash the key + user token to ensure cross-user collision prevention
        user_token = request.headers.get("Authorization", "anonymous")
        cache_key = hashlib.sha256(f"{idempotency_key}:{user_token}".encode()).hexdigest()

        if cache_key in self.processed_keys:
            logger.warning(f"Idempotency collision detected for key: {idempotency_key}")
            return JSONResponse(
                status_code=409, 
                content={"error": "Conflict", "message": "Request already processed."}
            )

        # In production: Use Redis SETNX with a 24-hour TTL to atomically lock the key
        self.processed_keys.add(cache_key)
        
        response = await call_next(request)
        return response
