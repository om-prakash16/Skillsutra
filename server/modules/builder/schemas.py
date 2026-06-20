from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime

class BuilderPageBase(BaseModel):
    name: str
    slug: str
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    og_image: Optional[str] = None
    component_tree: Optional[List[Dict[str, Any]]] = []

class BuilderPageCreate(BuilderPageBase):
    site_id: UUID

class BuilderPageUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    og_image: Optional[str] = None
    component_tree: Optional[List[Dict[str, Any]]] = None

class BuilderPageResponse(BuilderPageBase):
    id: UUID
    site_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class BuilderSiteBase(BaseModel):
    name: str
    domain: Optional[str] = None
    custom_domain: Optional[str] = None
    global_styles: Optional[Dict[str, Any]] = {}
    is_active: bool = True

class BuilderSiteCreate(BuilderSiteBase):
    tenant_id: Optional[UUID] = None

class BuilderSiteResponse(BuilderSiteBase):
    id: UUID
    tenant_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
