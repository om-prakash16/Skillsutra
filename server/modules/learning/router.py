from fastapi import APIRouter, Depends, HTTPException, Body, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Dict, Any, List
import uuid
from datetime import datetime

from database.core import get_db
from models.learning import LearningCourse, LearningModule, LearningLesson, LearningEnrollment, LearningAssessment, LearningAssessmentAttempt
from models.talent import TalentProfile, TalentSkill, SkillTaxonomy
from api.v1.auth_router import get_current_user

router = APIRouter()

@router.get("/courses", tags=["Learning Platform"])
async def get_courses(db: Session = Depends(get_db)):
    """Fetch the Course Catalog."""
    courses = db.query(LearningCourse).all()
    return {
        "success": True,
        "data": [
            {
                "id": c.id,
                "title": c.title,
                "slug": c.slug,
                "difficulty": c.difficulty,
                "estimated_duration_minutes": c.estimated_duration_minutes,
                "granted_skills": c.granted_skills
            } for c in courses
        ]
    }

@router.post("/courses/{course_id}/enroll", tags=["Learning Platform"])
async def enroll_course(course_id: str, payload: Dict[str, Any], db: Session = Depends(get_db)):
    """Enroll a user in a course."""
    profile_id = payload.get("talent_profile_id", "mock-profile-id")
    
    # Check if already enrolled
    existing = db.query(LearningEnrollment).filter(
        LearningEnrollment.course_id == course_id,
        LearningEnrollment.talent_profile_id == profile_id
    ).first()
    if existing:
        return {"success": True, "data": {"enrollment_id": existing.id, "status": existing.status}}
        
    enrollment = LearningEnrollment(
        course_id=course_id,
        talent_profile_id=profile_id,
        status="in_progress"
    )
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    
    return {"success": True, "data": {"enrollment_id": enrollment.id}}

@router.post("/assessments/{assessment_id}/submit", tags=["Learning Assessments"])
async def submit_assessment(assessment_id: str, payload: Dict[str, Any], db: Session = Depends(get_db)):
    """Submit an assessment. If passed, automatically update the Talent Identity Skills Graph."""
    profile_id = payload.get("talent_profile_id", "mock-profile-id")
    score = payload.get("score", 0.0)
    
    assessment = db.query(LearningAssessment).filter(LearningAssessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
        
    passed = score >= assessment.passing_score_percentage
    
    attempt = LearningAssessmentAttempt(
        assessment_id=assessment_id,
        talent_profile_id=profile_id,
        score=score,
        passed=passed,
        submitted_answers=payload.get("answers", {}),
        started_at=datetime.utcnow()
    )
    db.add(attempt)
    
    if passed and assessment.course_id:
        course = db.query(LearningCourse).filter(LearningCourse.id == assessment.course_id).first()
        if course and course.granted_skills:
            # Automatic Skill Verification Pipeline
            for skill_name in course.granted_skills:
                # 1. Find global skill
                taxonomy_skill = db.query(SkillTaxonomy).filter(SkillTaxonomy.name == skill_name).first()
                if taxonomy_skill:
                    # 2. Check if user already has it
                    existing_skill = db.query(TalentSkill).filter(
                        TalentSkill.profile_id == profile_id,
                        TalentSkill.skill_id == taxonomy_skill.id
                    ).first()
                    
                    if existing_skill:
                        # Upgrade proficiency or confidence
                        existing_skill.ai_confidence_score = 1.0
                    else:
                        # Add new verified skill
                        new_skill = TalentSkill(
                            profile_id=profile_id,
                            skill_id=taxonomy_skill.id,
                            proficiency_level="intermediate",
                            ai_confidence_score=1.0
                        )
                        db.add(new_skill)
    
    db.commit()
    return {"success": True, "passed": passed, "score": score}
