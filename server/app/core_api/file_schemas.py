from pydantic import BaseModel
from uuid import UUID
from typing import Optional, List
from datetime import datetime

class FileUploadResponse(BaseModel):
    id: UUID
    file_name: str
    file_url: str
    category: str
    ipfs_cid: Optional[str] = None
    status: str = "success"

class UserFileMetadata(BaseModel):
    id: UUID
    user_id: UUID
    category: str
    file_name: str
    storage_path: str
    ipfs_cid: Optional[str] = None
    mime_type: str
    size_bytes: int
    is_public: bool
    created_at: datetime

    class Config:
        from_attributes = True
