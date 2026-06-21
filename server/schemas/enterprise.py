from typing import Generic, TypeVar, List, Optional, Any, Dict
from pydantic import BaseModel, Field
import uuid
from datetime import datetime

T = TypeVar("T")

class PaginationParams(BaseModel):
    page: int = Field(default=1, ge=1)
    size: int = Field(default=50, ge=1, le=100)
    
class SortingParams(BaseModel):
    sort_by: Optional[str] = None
    sort_desc: bool = False
    
class BaseFilterParams(BaseModel):
    search: Optional[str] = None
    tenant_id: Optional[uuid.UUID] = None
    created_by: Optional[uuid.UUID] = None
    is_active: Optional[bool] = None

class EnterpriseResponseEnvelope(BaseModel, Generic[T]):
    object: str = "item"
    data: T
    request_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    api_version: str = "1.0.0"
    message: Optional[str] = None
    meta: Optional[Dict[str, Any]] = None

class PaginationMeta(BaseModel):
    total: int
    page: int
    size: int
    has_more: bool

class EnterprisePaginatedResponse(BaseModel, Generic[T]):
    object: str = "list"
    data: List[T]
    request_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    api_version: str = "1.0.0"
    meta: Dict[str, Any] # Must contain pagination meta

class BulkOperationRequest(BaseModel):
    ids: List[uuid.UUID]
    operation: str # e.g. delete, archive, approve, export
    payload: Optional[Dict[str, Any]] = None

class AuditLogSchema(BaseModel):
    action: str
    actor_id: Optional[uuid.UUID]
    timestamp: datetime
    changes: Optional[Dict[str, Any]]
