from typing import Any, Dict, Optional, List
from datetime import datetime
from fastapi.responses import JSONResponse
from fastapi.responses import ORJSONResponse
from core.config import settings

def success_response(
    data: Any = None,
    meta: Optional[Dict[str, Any]] = None,
    status_code: int = 200,
    request_id: Optional[str] = None,
    message: Optional[str] = None
) -> ORJSONResponse:
    """
    Standardized success response envelope using fast ORJSON serialization.
    Follows Stripe/Airbnb patterns for observability.
    """
    response = {
        "object": "list" if isinstance(data, list) else "item",
        "data": data,
        "request_id": request_id,
        "timestamp": datetime.utcnow().isoformat(),
        "api_version": settings.PROJECT_VERSION
    }
    
    if message is not None:
        response["message"] = message
        if meta is None:
            meta = {}
        meta["message"] = message
        
    if meta:
        response["meta"] = meta
        
    return ORJSONResponse(content=response, status_code=status_code)

def error_response(
    message: str,
    code: str = "internal_error",
    details: Any = None,
    status_code: int = 500,
    request_id: Optional[str] = None
) -> JSONResponse:
    """Standardized error response envelope."""
    content = {
        "error": {
            "type": "api_error" if status_code >= 500 else "invalid_request_error",
            "code": code,
            "message": message,
            "details": details,
            "request_id": request_id
        },
        "timestamp": datetime.utcnow().isoformat()
    }
    return ORJSONResponse(status_code=status_code, content=content)

def paginated_response(
    data: List[Any],
    total: int,
    page: int,
    size: int,
    request_id: Optional[str] = None
) -> ORJSONResponse:
    """Standardized paginated response envelope."""
    meta = {
        "pagination": {
            "total": total,
            "page": page,
            "size": size,
            "has_more": (page * size) < total
        }
    }
    return success_response(data=data, meta=meta, request_id=request_id)
