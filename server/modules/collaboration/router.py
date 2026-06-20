from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any, List
import uuid

from database.core import get_db
from models.collaboration import CollabComment, CommentThread
from api.v1.auth_router import get_current_user

router = APIRouter()

@router.get("/threads/{entity_type}/{entity_id}", tags=["Collaboration"])
async def get_comments(entity_type: str, entity_id: str, db: Session = Depends(get_db)):
    """Fetch all comments for a specific entity (e.g., a specific ATS job or a CMS article)."""
    thread = db.query(CommentThread).filter(
        CommentThread.entity_type == entity_type,
        CommentThread.entity_id == entity_id
    ).first()
    
    if not thread:
        return {"success": True, "data": []}
        
    comments = db.query(Comment).filter(Comment.thread_id == thread.id).order_by(Comment.created_at.asc()).all()
    
    # Simple flat return; frontend can build tree if needed
    return {"success": True, "data": [{"id": c.id, "content": c.content, "author_id": c.author_id, "parent_id": c.parent_id} for c in comments]}

@router.post("/threads/{entity_type}/{entity_id}", tags=["Collaboration"])
async def add_comment(
    entity_type: str, 
    entity_id: str, 
    payload: Dict[str, Any], 
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    """Add a new comment to an entity."""
    thread = db.query(CommentThread).filter(
        CommentThread.entity_type == entity_type,
        CommentThread.entity_id == entity_id
    ).first()
    
    if not thread:
        thread = CommentThread(entity_type=entity_type, entity_id=entity_id)
        db.add(thread)
        db.commit()
        db.refresh(thread)
        
    comment = Comment(
        thread_id=thread.id,
        author_id=user["id"],
        content=payload["content"],
        parent_id=payload.get("parent_id")
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    
    return {"success": True, "data": {"id": comment.id, "content": comment.content, "author_id": comment.author_id}}
