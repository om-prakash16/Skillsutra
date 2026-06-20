from fastapi import APIRouter, Depends, HTTPException, Body, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Dict, Any, List
import uuid

from database.core import get_db
from models.talent import TalentProfile, SkillTaxonomy, TalentSkill, TalentExperience, TalentEducation
from api.v1.auth_router import get_current_user

router = APIRouter()

@router.get("/profile", tags=["Talent Identity"])
async def get_my_profile(db: Session = Depends(get_db)):
    """Fetch the authenticated user's unified Talent Profile."""
    # In reality, extract user_id from token: current_user.id
    # Using mock user_id for demonstration
    user_id = "mock-user-id"
    
    profile = db.query(TalentProfile).filter(TalentProfile.user_id == user_id).first()
    if not profile:
        # Auto-initialize a blank profile
        profile = TalentProfile(
            user_id=user_id,
            username=f"user-{str(uuid.uuid4())[:8]}",
            headline="",
            bio=""
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
        
    return {
        "success": True,
        "data": {
            "id": profile.id,
            "username": profile.username,
            "headline": profile.headline,
            "bio": profile.bio,
            "location": profile.location,
            "skills": [
                {"id": s.id, "name": s.skill.name, "proficiency": s.proficiency_level} 
                for s in profile.skills
            ],
            "experiences": [
                {"id": e.id, "company": e.company, "role": e.role, "start_date": e.start_date.isoformat()} 
                for e in profile.experiences
            ]
        }
    }

@router.put("/profile/experience", tags=["Talent Identity"])
async def update_experience(payload: Dict[str, Any], db: Session = Depends(get_db)):
    """Add a new experience record to the profile."""
    # In reality, fetch profile_id from current_user
    profile_id = payload.get("profile_id", "mock-profile-id")
    
    exp = TalentExperience(
        profile_id=profile_id,
        company=payload["company"],
        role=payload["role"],
        start_date=payload["start_date"],
        end_date=payload.get("end_date"),
        description=payload.get("description", "")
    )
    db.add(exp)
    db.commit()
    return {"success": True}

@router.get("/skills/taxonomy", tags=["Talent Skills Graph"])
async def get_skill_taxonomy(query: str = "", db: Session = Depends(get_db)):
    """Search the global normalized skills dictionary."""
    skills = db.query(SkillTaxonomy).filter(SkillTaxonomy.name.ilike(f"%{query}%")).limit(20).all()
    return {
        "success": True,
        "data": [{"id": s.id, "name": s.name, "category": s.category} for s in skills]
    }

@router.get("/u/{username}", tags=["Public Profile"])
async def get_public_profile(username: str, db: Session = Depends(get_db)):
    """Fetch the canonical public profile payload for Visual Builder rendering."""
    profile = db.query(TalentProfile).filter(TalentProfile.username == username, TalentProfile.is_public == True).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found or is private")
        
    return {
        "success": True,
        "data": {
            "id": profile.id,
            "headline": profile.headline,
            "bio": profile.bio,
            "location": profile.location,
            "skills": [{"name": s.skill.name} for s in profile.skills],
            "experiences": [{"company": e.company, "role": e.role, "description": e.description} for e in profile.experiences]
        }
    }
