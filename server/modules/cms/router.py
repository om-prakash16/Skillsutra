from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified
from typing import Dict, Any, List
import uuid

from core.database import get_db_session
from models.cms import CMSCollection, CMSField, CMSEntry, ContentStatus
from api.v1.auth_router import get_current_user
from core.authz import RequirePermission
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

router = APIRouter()

from core.response import success_response

@router.get("", tags=["CMS Content"])
@router.get("/", tags=["CMS Content"], include_in_schema=False)
async def get_all_legacy_cms():
    """Stub for legacy CMSContext to prevent 404 errors on the frontend."""
    return success_response(data=[])

# --- Collections API ---

@router.get("/collections", tags=["CMS Schema"])
async def get_collections(db: AsyncSession = Depends(get_db_session)):
    """Get all registered dynamic CMS collections."""
    result = await db.execute(select(CMSCollection))
    cols = result.scalars().all()
    return {
        "success": True, 
        "data": [{"id": c.id, "name": c.name, "slug": c.slug, "description": c.description, "is_singleton": c.is_singleton} for c in cols]
    }

@router.post("/collections", tags=["CMS Schema"])
async def create_collection(payload: Dict[str, Any], db: AsyncSession = Depends(get_db_session), user: dict = Depends(RequirePermission("manage_cms"))):
    """Create a new dynamic CMS collection."""
    col = CMSCollection(
        name=payload["name"],
        slug=payload["slug"],
        description=payload.get("description", ""),
        is_singleton=payload.get("is_singleton", False)
    )
    db.add(col)
    await db.commit()
    await db.refresh(col)
    return {"success": True, "data": {"id": col.id, "name": col.name, "slug": col.slug}}

# --- Fields API ---

@router.get("/collections/{collection_id}/fields", tags=["CMS Schema"])
async def get_collection_fields(collection_id: str, db: AsyncSession = Depends(get_db_session)):
    """Get fields for a specific collection."""
    result = await db.execute(select(CMSField).filter(CMSField.collection_id == collection_id))
    fields = result.scalars().all()
    return {
        "success": True, 
        "data": [{"id": f.id, "name": f.name, "machine_name": f.machine_name, "field_type": f.field_type, "settings": f.settings} for f in fields]
    }

@router.post("/collections/{collection_id}/fields", tags=["CMS Schema"])
async def create_collection_field(collection_id: str, payload: Dict[str, Any], db: AsyncSession = Depends(get_db_session), user: dict = Depends(RequirePermission("manage_cms"))):
    """Add a new field to a collection."""
    field = CMSField(
        collection_id=collection_id,
        name=payload["name"],
        machine_name=payload["machine_name"],
        field_type=payload["field_type"],
        settings=payload.get("settings", {}),
        is_required=payload.get("is_required", False),
        is_unique=payload.get("is_unique", False)
    )
    db.add(field)
    await db.commit()
    return {"success": True, "data": {"id": field.id, "machine_name": field.machine_name}}

# --- Generic Headless Entries API ---

@router.get("/entries/{collection_slug}", tags=["CMS Content"])
async def get_entries(collection_slug: str, db: AsyncSession = Depends(get_db_session)):
    """Fetch all entries for a given dynamic collection slug."""
    col_result = await db.execute(select(CMSCollection).filter(CMSCollection.slug == collection_slug))
    col = col_result.scalars().first()
    if not col:
        raise HTTPException(status_code=404, detail="Collection not found")
        
    entries_result = await db.execute(select(CMSEntry).filter(CMSEntry.collection_id == col.id))
    entries = entries_result.scalars().all()
    
    # We flatten the response so `data` properties are top-level for standard API consumption
    results = []
    for e in entries:
        flat = {"id": e.id, "status": e.status, "author_id": e.author_id, **(e.data or {})}
        results.append(flat)
        
    return {"success": True, "data": results}

@router.post("/entries/{collection_slug}", tags=["CMS Content"])
async def create_entry(collection_slug: str, payload: Dict[str, Any] = Body(...), db: AsyncSession = Depends(get_db_session), user: dict = Depends(RequirePermission("manage_cms"))):
    """Create a new dynamic entry."""
    col_result = await db.execute(select(CMSCollection).filter(CMSCollection.slug == collection_slug))
    col = col_result.scalars().first()
    if not col:
        raise HTTPException(status_code=404, detail="Collection not found")
        
    # TODO: Add dynamic validation against CMSField definitions here
    
    entry = CMSEntry(
        collection_id=col.id,
        status=payload.pop("status", ContentStatus.DRAFT.value),
        author_id=user["id"],
        data=payload
    )
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    
    return {"success": True, "data": {"id": entry.id, "status": entry.status, **(entry.data or {})}}

@router.put("/entries/{collection_slug}/{entry_id}", tags=["CMS Content"])
async def update_entry(collection_slug: str, entry_id: str, payload: Dict[str, Any] = Body(...), db: AsyncSession = Depends(get_db_session), user: dict = Depends(RequirePermission("manage_cms"))):
    """Update a dynamic entry."""
    entry_result = await db.execute(select(CMSEntry).filter(CMSEntry.id == entry_id))
    entry = entry_result.scalars().first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
        
    if "status" in payload:
        entry.status = payload.pop("status")
        
    # Merge JSONB
    current_data = entry.data or {}
    current_data.update(payload)
    entry.data = current_data
    
    # Force SQLAlchemy to detect JSON mutation
    flag_modified(entry, "data")
    
    await db.commit()
    return {"success": True, "data": {"id": entry.id, "status": entry.status, **(entry.data or {})}}
