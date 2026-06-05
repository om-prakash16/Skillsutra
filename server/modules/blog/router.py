from fastapi import APIRouter, HTTPException, Depends
from typing import Any
from .schemas import BlogListResponse, BlogPostResponse, BlogPostCreate
from core.db import get_db

router = APIRouter(prefix="/blog", tags=["blog"])

@router.get("/posts", response_model=BlogListResponse)
async def list_published_posts():
    db = get_db()
    if not db:
        raise HTTPException(status_code=500, detail="Database unavailable")
        
    response = (
        db.table("blog_posts")
        .select("*")
        .eq("is_published", True)
        .order("published_at", desc=True)
        .execute()
    )
    
    data = response.data if response.data else []
    return {"data": data, "total": len(data)}

@router.get("/posts/{slug}", response_model=BlogPostResponse)
async def get_post(slug: str):
    db = get_db()
    if not db:
        raise HTTPException(status_code=500, detail="Database unavailable")
        
    response = (
        db.table("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", True)
        .execute()
    )
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Post not found")
        
    return response.data[0]

@router.post("/posts", response_model=BlogPostResponse)
async def create_post(post: BlogPostCreate):
    # For now, allow unauthenticated creation for seeding purposes
    # In production, this should have a Depends(get_admin_user)
    db = get_db()
    if not db:
        raise HTTPException(status_code=500, detail="Database unavailable")
        
    post_data = post.model_dump()
    post_data["author_name"] = "SkillSutra Editorial"
    if post_data["is_published"]:
        post_data["published_at"] = "now()"
        
    response = (
        db.table("blog_posts")
        .insert(post_data)
        .execute()
    )
    
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to create post")
        
    return response.data[0]
