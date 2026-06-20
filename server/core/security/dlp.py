import re
import logging
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response, JSONResponse

logger = logging.getLogger(__name__)

# Basic Regex patterns for critical system secrets
# In production, this would use a robust scanning library like Google Cloud DLP
SECRET_PATTERNS = {
    "Stripe Secret Key": re.compile(r"sk_live_[a-zA-Z0-9]{24,}"),
    "Stripe Test Key": re.compile(r"sk_test_[a-zA-Z0-9]{24,}"),
    "Google Cloud Key": re.compile(r"AIza[0-9A-Za-z-_]{35}"),
    "AWS Access Key": re.compile(r"AKIA[0-9A-Z]{16}"),
    "Generic RSA Private Key": re.compile(r"-----BEGIN PRIVATE KEY-----")
}

class DLPMiddleware(BaseHTTPMiddleware):
    """
    Data Leak Prevention Middleware.
    Inspects all outgoing JSON responses for accidentally leaked API keys.
    """
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # We only want to inspect JSON payloads, not massive binary files or streams
        if response.headers.get("content-type") == "application/json":
            # Extract the response body
            # Note: Consuming the response body in Starlette middleware requires a specific approach
            # because the body is an asynchronous iterator.
            
            body = b""
            async for chunk in response.body_iterator:
                body += chunk
                
            body_str = body.decode('utf-8', errors='ignore')
            
            # Scan for leaks
            for secret_name, pattern in SECRET_PATTERNS.items():
                if pattern.search(body_str):
                    logger.critical(f"DLP VIOLATION: Blocked outgoing response containing {secret_name}")
                    # Block the response and return a generic 500 error
                    return JSONResponse(
                        status_code=500,
                        content={"error": "A security policy violation was detected in the response payload. The request has been blocked."}
                    )
            
            # Reconstruct the response since we consumed the iterator
            return Response(
                content=body,
                status_code=response.status_code,
                headers=dict(response.headers),
                media_type=response.media_type
            )
            
        return response
