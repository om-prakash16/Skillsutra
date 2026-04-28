from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
import logging
import traceback

logger = logging.getLogger(__name__)

async def global_exception_handler(request: Request, exc: Exception):
    """
    Catch-all exception handler to prevent stack trace leaks and standardize error responses.
    """
    if isinstance(exc, HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail, "type": "HTTPException"}
        )
    
    # Log the full error for internal debugging
    logger.error(f"GLOBAL_ERROR: {str(exc)}")
    logger.error(traceback.format_exc())
    
    # Return a clean message to the user
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An internal server error occurred. Our engineers have been notified.",
            "type": "InternalServerError"
        }
    )
