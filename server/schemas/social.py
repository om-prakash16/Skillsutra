from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime

# ==============================================================================
# CONNECTION SCHEMAS
# ==============================================================================

class ConnectionBase(BaseModel):
    receiver_id: UUID
    note: Optional[str] = None

class ConnectionCreate(ConnectionBase):
    pass

class ConnectionResponse(BaseModel):
    id: UUID
    sender_id: UUID
    receiver_id: UUID
    status: str
    note: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ==============================================================================
# POST SCHEMAS
# ==============================================================================

class PostMediaCreate(BaseModel):
    media_url: str
    media_type: str # IMAGE, VIDEO
    sort_order: Optional[int] = 0

class PostMediaResponse(PostMediaCreate):
    id: UUID
    post_id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True

class PostBase(BaseModel):
    content_markdown: str
    visibility: Optional[str] = "PUBLIC"

class PostCreate(PostBase):
    media: Optional[List[PostMediaCreate]] = []

class PostResponse(PostBase):
    id: UUID
    author_id: UUID
    likes_count: int
    comments_count: int
    reposts_count: int
    created_at: datetime
    updated_at: datetime
    media: List[PostMediaResponse] = []

    class Config:
        from_attributes = True

# ==============================================================================
# MESSAGE SCHEMAS
# ==============================================================================

class MessageCreate(BaseModel):
    content: str
    conversation_id: UUID

class MessageResponse(BaseModel):
    id: UUID
    conversation_id: UUID
    sender_id: UUID
    content: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ConversationCreate(BaseModel):
    participant_ids: List[UUID]
    type: Optional[str] = "DIRECT"
    title: Optional[str] = None

class ConversationResponse(BaseModel):
    id: UUID
    type: str
    title: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
