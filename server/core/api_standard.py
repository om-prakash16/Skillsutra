from typing import Generic, TypeVar, List, Optional, Any, Dict
from pydantic import BaseModel
from fastapi import Query
from datetime import datetime, timezone
import uuid

T = TypeVar('T')

class PaginationMeta(BaseModel):
    page: int
    page_size: int
    total_items: int
    total_pages: int
    has_next: bool
    has_previous: bool
    next_cursor: Optional[str] = None
    previous_cursor: Optional[str] = None

class ApiResponse(BaseModel, Generic[T]):
    """
    Standard Enterprise API Response format.
    Every endpoint across the platform MUST return this structure.
    """
    success: bool
    message: str = ""
    data: Optional[T] = None
    meta: Optional[Dict[str, Any]] = None
    errors: Optional[List[Dict[str, Any]]] = None
    trace_id: str
    timestamp: str

    @classmethod
    def success_response(cls, data: T, message: str = "Success", meta: dict = None):
        return cls(
            success=True,
            message=message,
            data=data,
            meta=meta,
            trace_id=str(uuid.uuid4()), # In production, pull from APM middleware
            timestamp=datetime.now(timezone.utc).isoformat()
        )

    @classmethod
    def error_response(cls, message: str, errors: List[Dict[str, Any]] = None):
        return cls(
            success=False,
            message=message,
            errors=errors,
            trace_id=str(uuid.uuid4()),
            timestamp=datetime.now(timezone.utc).isoformat()
        )

class PaginationParams:
    def __init__(
        self,
        page: int = Query(1, ge=1, description="Page number"),
        page_size: int = Query(25, ge=1, le=100, description="Items per page"),
        cursor: Optional[str] = Query(None, description="Cursor for keyset pagination")
    ):
        self.page = page
        self.page_size = page_size
        self.cursor = cursor
        self.offset = (page - 1) * page_size
        self.limit = page_size

class SortParams:
    def __init__(
        self,
        sort_by: str = Query("created_at", description="Field to sort by"),
        sort_desc: bool = Query(True, description="Sort in descending order")
    ):
        self.sort_by = sort_by
        self.sort_desc = sort_desc

class FilterParams:
    """
    Base filter params. More complex filtering (like GraphQL-style nested AND/OR)
    should be passed in the request body, but simple key/value pairs can use this.
    """
    def __init__(
        self,
        search: Optional[str] = Query(None, description="Global text search"),
        status: Optional[str] = Query(None, description="Filter by exact status")
    ):
        self.search = search
        self.status = status
