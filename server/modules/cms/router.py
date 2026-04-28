from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, Optional
from modules.auth.core.service import require_permission
from modules.cms.service import CMSService
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
    """
    return await CMSService.get_all_active()


@router.get("/{section}")
async def get_cms_section(section: str):
    """
    Fetch content for a specific section (e.g., 'hero').
    """
    return await CMSService.get_by_section(section)


@router.patch("/update")
async def update_cms_content(
    update: CMSUpdateRequest, user=Depends(require_permission("manage_cms"))
):
    """
    Admin-only endpoint to update site text/metadata.
    """
    try:
        data = await CMSService.upsert_content(update.model_dump(), user["id"])
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{section}/{key}")
async def delete_cms_content(
    section: str, key: str, user=Depends(require_permission("manage_cms"))
):
    """
    Deactivate a specific CMS key.
    """
    await CMSService.deactivate_key(section, key)
    return {"status": "success"}
