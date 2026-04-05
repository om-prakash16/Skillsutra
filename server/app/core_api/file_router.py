import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import List, Optional
from .file_schemas import FileUploadResponse, UserFileMetadata
from app.services.notification_service import NotificationService

router = APIRouter()

@router.post("/upload", response_model=FileUploadResponse)
async def upload_file(
    category: str = Form(..., description="avatar, resume, portfolio, etc."),
    file: UploadFile = File(...),
    user_id: Optional[str] = Form(None)
):
    """
    Standardize hybrid file upload: Supabase Storage for general media + IPFS for NFTs.
    """
    # 1. Validation Logic
    content_type = file.content_type
    size = 0 # logic to calculate size from stream
    
    # 2. Storage Routing
    file_id = uuid.uuid4()
    storage_path = f"{category}/{user_id or 'anon'}/{file_id}_{file.filename}"
    
    # Placeholder for Supabase upload logic
    # response = supabase.storage.from_(category).upload(path=storage_path, file=file.file)
    
    # 3. IPFS Logic (If category is nft_metadata or certificate)
    ipfs_cid = None
    if category in ['nft_metadata', 'certificate']:
        # ipfs_cid = await pin_to_pinata(file)
        pass

    # 4. Trigger Logging/Notifications
    # await NotificationService.log_activity(...)
    
    return FileUploadResponse(
        id=file_id,
        file_name=file.filename,
        file_url=f"https://supabase-cdn-placeholder.url/{storage_path}",
        category=category,
        ipfs_cid=ipfs_cid
    )

@router.get("/user/{user_id}", response_model=List[UserFileMetadata])
async def get_user_files(user_id: str):
    """
    Retrieves all file metadata associated with a specific user profile.
    """
    # Logic to query public.files table
    return []

@router.delete("/{file_id}")
async def delete_file(file_id: str):
    """
    Orchestrates file removal from both storage bucket and metadata registry.
    """
    # Logic to remove from storage and DB
    return {"status": "deleted"}
