from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class BlogPostBase(BaseModel):
    slug: str
    title: str
    excerpt: str
    content: str
    category: str
    read_time: str
    featured_image: Optional[str] = None
    image_gradient: Optional[str] = None
    is_published: bool = False

class BlogPostCreate(BlogPostBase):
    pass

class BlogPostResponse(BlogPostBase):
    id: UUID
    author_id: Optional[UUID] = None
    author_name: str
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

class BlogListResponse(BaseModel):
    data: List[BlogPostResponse]
    total: int
