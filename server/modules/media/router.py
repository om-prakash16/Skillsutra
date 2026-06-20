import os
import uuid
import shutil
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from database.core import get_db
from models.media import MediaAsset, MediaFolder
from api.v1.auth_router import get_current_user

router = APIRouter()

UPLOAD_DIR = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/assets", tags=["Media DAM"])
async def get_media_assets(folder_id: Optional[str] = None, db: Session = Depends(get_db)):
    """Fetch all media assets, optionally filtered by folder."""
    query = db.query(MediaAsset)
    if folder_id:
        query = query.filter(MediaAsset.folder_id == folder_id)
    else:
        query = query.filter(MediaAsset.folder_id == None)
        
    assets = query.all()
    return {"success": True, "data": [{"id": a.id, "name": a.name, "url": a.url, "mime_type": a.mime_type, "size_bytes": a.size_bytes} for a in assets]}

@router.post("/upload", tags=["Media DAM"])
async def upload_media(
    file: UploadFile = File(...),
    folder_id: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    """Upload a new media asset (Standard Local Storage strategy)."""
    file_ext = file.filename.split(".")[-1] if "." in file.filename else ""
    safe_filename = f"{uuid.uuid4()}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)
    
    # Save file locally
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    size_bytes = os.path.getsize(file_path)
    
    # In a real app, this URL would point to a CDN or a static file route
    public_url = f"/uploads/{safe_filename}"
    
    asset = MediaAsset(
        name=file.filename,
        file_name=safe_filename,
        mime_type=file.content_type or "application/octet-stream",
        size_bytes=size_bytes,
        url=public_url,
        folder_id=folder_id
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)
    
    return {"success": True, "data": {"id": asset.id, "url": asset.url, "name": asset.name}}

@router.get("/folders", tags=["Media DAM"])
async def get_folders(parent_id: Optional[str] = None, db: Session = Depends(get_db)):
    """Fetch media folders."""
    query = db.query(MediaFolder)
    if parent_id:
        query = query.filter(MediaFolder.parent_id == parent_id)
    else:
        query = query.filter(MediaFolder.parent_id == None)
        
    folders = query.all()
    return {"success": True, "data": [{"id": f.id, "name": f.name} for f in folders]}
