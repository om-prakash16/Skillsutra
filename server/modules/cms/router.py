from fastapi import APIRouter, Depends
from typing import Dict, Any, Optional, List
from pydantic import BaseModel
import uuid

from core.response import success_response
from modules.auth.core.guards import require_admin
from core.db import get_db

router = APIRouter()

# --- Pydantic Models ---

class SiteContentCreate(BaseModel):
    section_key: str
    content_key: str
    content_value: str
    metadata: Optional[Dict[str, Any]] = {}
    is_active: bool = True

class SiteContentUpdate(BaseModel):
    content_value: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None

class CMSArticleCreate(BaseModel):
    title: str
    slug: str
    excerpt: str
    content: str
    category: str = "General"
    featured_image: Optional[str] = None
    read_time: str = "5 min"
    is_published: bool = False

class CMSArticleUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    featured_image: Optional[str] = None
    is_published: Optional[bool] = None

# --- Pages & Banners API (site_content) ---

@router.get("")
async def get_all_cms_content():
    """Fetch all active CMS Site Content (Public)."""
    db = get_db()
    res = db.table("site_content").select("*").eq("is_active", True).execute()
    return success_response(data=res.data if res.data else [])

@router.get("/pages")
async def get_cms_pages(admin=Depends(require_admin)):
    """Fetch all CMS Site Content (excluding banners)."""
    db = get_db()
    res = db.table("site_content").select("*").neq("section_key", "banner").order("updated_at", desc=True).execute()
    return success_response(data=res.data if res.data else [])

@router.get("/banners")
async def get_cms_banners(admin=Depends(require_admin)):
    """Fetch all CMS Banners."""
    db = get_db()
    res = db.table("site_content").select("*").eq("section_key", "banner").order("updated_at", desc=True).execute()
    return success_response(data=res.data if res.data else [])

@router.get("/content/{content_id}")
async def get_site_content(content_id: str, admin=Depends(require_admin)):
    db = get_db()
    res = db.table("site_content").select("*").eq("id", content_id).single().execute()
    return success_response(data=res.data)

@router.post("/content")
async def create_site_content(payload: SiteContentCreate, admin=Depends(require_admin)):
    db = get_db()
    data = payload.model_dump()
    data["updated_by"] = admin["id"]
    res = db.table("site_content").insert(data).execute()
    return success_response(data=res.data[0] if res.data else {}, message="Content created successfully")

@router.put("/content/{content_id}")
async def update_site_content(content_id: str, payload: SiteContentUpdate, admin=Depends(require_admin)):
    db = get_db()
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    update_data["updated_at"] = "now()"
    update_data["updated_by"] = admin["id"]
    res = db.table("site_content").update(update_data).eq("id", content_id).execute()
    return success_response(data=res.data[0] if res.data else {}, message="Content updated successfully")

@router.delete("/content/{content_id}")
async def delete_site_content(content_id: str, admin=Depends(require_admin)):
    db = get_db()
    db.table("site_content").delete().eq("id", content_id).execute()
    return success_response(data=None, message="Content deleted successfully")

# --- Articles API (blog_posts) ---

@router.get("/articles")
async def get_cms_articles(admin=Depends(require_admin)):
    """Fetch all CMS Articles."""
    db = get_db()
    res = db.table("blog_posts").select("*").order("created_at", desc=True).execute()
    return success_response(data=res.data if res.data else [])

@router.get("/articles/{article_id}")
async def get_cms_article(article_id: str, admin=Depends(require_admin)):
    db = get_db()
    res = db.table("blog_posts").select("*").eq("id", article_id).single().execute()
    return success_response(data=res.data)

@router.post("/articles")
async def create_cms_article(payload: CMSArticleCreate, admin=Depends(require_admin)):
    db = get_db()
    data = payload.model_dump()
    data["author_id"] = admin["id"]
    data["author_name"] = admin.get("full_name", admin.get("username", "Admin"))
    if data.get("is_published"):
        data["published_at"] = "now()"
    res = db.table("blog_posts").insert(data).execute()
    return success_response(data=res.data[0] if res.data else {}, message="Article created successfully")

@router.put("/articles/{article_id}")
async def update_cms_article(article_id: str, payload: CMSArticleUpdate, admin=Depends(require_admin)):
    db = get_db()
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    update_data["updated_at"] = "now()"
    if update_data.get("is_published"):
        update_data["published_at"] = "now()"
    res = db.table("blog_posts").update(update_data).eq("id", article_id).execute()
    return success_response(data=res.data[0] if res.data else {}, message="Article updated successfully")

@router.delete("/articles/{article_id}")
async def delete_cms_article(article_id: str, admin=Depends(require_admin)):
    db = get_db()
    db.table("blog_posts").delete().eq("id", article_id).execute()
    return success_response(data=None, message="Article deleted successfully")

@router.get("/taxonomy")
async def get_cms_taxonomy(admin=Depends(require_admin)):
    return success_response(data=[])
