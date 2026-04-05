from pydantic import BaseModel, ConfigDict
from uuid import UUID
from typing import Optional, List, Dict
from datetime import datetime

class FeatureFlag(BaseModel):
    id: UUID
    feature_name: str
    is_enabled: bool
    category: str
    description: Optional[str] = None
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class FeatureUpdate(BaseModel):
    is_enabled: bool
    updated_by: Optional[UUID] = None

class FeatureStateMap(BaseModel):
    flags: Dict[str, bool]
