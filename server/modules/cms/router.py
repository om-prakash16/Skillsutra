from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from modules.auth.service import require_permission, get_current_user
from core.supabase import get_supabase
from pydantic import BaseModel

router = APIRouter()

class CMSUpdateRequest(BaseModel):
    section_key: str
    content_key: str
    content_value: str
    metadata: Optional[Dict[str, Any]] = None

@router.get("/")
async def get_all_cms_content():
    """
    Public-facing endpoint to fetch all active site content.
    Used for landing page rendering and static text.
    """
    db = get_supabase()
    response = db.table("site_content").select("*").eq("is_active", True).execute()
    return response.data

@router.get("/{section}")
async def get_cms_section(section: str):
    """
    Fetch content for a specific section (e.g., 'hero').
    """
    db = get_supabase()
    response = db.table("site_content").select("*").eq("section_key", section).eq("is_active", True).execute()
    return response.data

@router.patch("/update")
async def update_cms_content(update: CMSUpdateRequest, user = Depends(require_permission("manage_cms"))):
    """
    Admin-only endpoint to update site text/metadata.
    """
    db = get_supabase()
    
    # Upsert logic for CMS content
    response = db.table("site_content").upsert({
        "section_key": update.section_key,
        "content_key": update.content_key,
        "content_value": update.content_value,
        "metadata": update.metadata or {},
        "updated_at": "now()",
        "updated_by": user["id"]
    }, on_conflict="section_key, content_key").execute()
    
    return {"status": "success", "data": response.data}

@router.delete("/{section}/{key}")
async def delete_cms_content(section: str, key: str, user = Depends(require_permission("manage_cms"))):
    """
    Deactivate a specific CMS key.
    """
    db = get_supabase()
    response = db.table("site_content").update({"is_active": False}).eq("section_key", section).eq("content_key", key).execute()
    return {"status": "success"}
