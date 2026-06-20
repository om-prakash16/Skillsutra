from fastapi import APIRouter, Depends, HTTPException, Body, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Dict, Any, List
import uuid

from database.core import get_db
from models.crm import CRMContact, CRMTalentCommunity, CRMMembership, CRMCampaign, CRMActivity
from api.v1.auth_router import get_current_user

router = APIRouter()

@router.get("/communities", tags=["CRM Talent Communities"])
async def get_communities(db: Session = Depends(get_db)):
    """Fetch all talent communities."""
    communities = db.query(CRMTalentCommunity).all()
    return {
        "success": True, 
        "data": [{"id": c.id, "name": c.name, "description": c.description} for c in communities]
    }

@router.post("/communities", tags=["CRM Talent Communities"])
async def create_community(payload: Dict[str, Any], db: Session = Depends(get_db)):
    """Create a new talent community."""
    community = CRMTalentCommunity(
        name=payload["name"],
        description=payload.get("description", "")
    )
    db.add(community)
    db.commit()
    db.refresh(community)
    return {"success": True, "data": {"id": community.id, "name": community.name}}

@router.post("/campaigns", tags=["CRM Campaigns"])
async def create_campaign(payload: Dict[str, Any], db: Session = Depends(get_db)):
    """Draft a new recruitment campaign."""
    campaign = CRMCampaign(
        name=payload["name"],
        type=payload.get("type", "email"),
        subject_template=payload.get("subject_template", ""),
        body_template=payload.get("body_template", ""),
        target_community_id=payload.get("target_community_id")
    )
    db.add(campaign)
    db.commit()
    db.refresh(campaign)
    return {"success": True, "data": {"id": campaign.id, "name": campaign.name}}

@router.get("/contacts/{contact_id}/timeline", tags=["CRM Activity Timeline"])
async def get_contact_timeline(contact_id: str, db: Session = Depends(get_db)):
    """Fetch the unified chronological activity timeline for a contact."""
    contact = db.query(CRMContact).filter(CRMContact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
        
    activities = db.query(CRMActivity).filter(CRMActivity.contact_id == contact_id).order_by(CRMActivity.created_at.desc()).all()
    
    return {
        "success": True, 
        "data": [
            {
                "id": a.id, 
                "activity_type": a.activity_type,
                "title": a.title,
                "created_at": a.created_at.isoformat() if a.created_at else None,
                "details": a.details
            } for a in activities
        ]
    }

@router.post("/contacts/{contact_id}/activities", tags=["CRM Activity Timeline"])
async def log_activity(contact_id: str, payload: Dict[str, Any], db: Session = Depends(get_db)):
    """Log an activity (e.g. Email Opened) manually or via webhook."""
    activity = CRMActivity(
        contact_id=contact_id,
        activity_type=payload["activity_type"],
        title=payload["title"],
        details=payload.get("details", {})
    )
    db.add(activity)
    db.commit()
    return {"success": True}
