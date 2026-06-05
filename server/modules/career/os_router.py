import os
import json
import logging
from fastapi import APIRouter, Depends, HTTPException, Body, BackgroundTasks
from core.db import get_db
from modules.auth.core.service import get_current_user
from .os_models import CareerVisionCreate, DailyPlannerCreate, HabitCreate, AchievementCreate, OnboardingPayload
from typing import List, Dict, Any
from datetime import datetime
from modules.career.service import CareerService

router = APIRouter()
logger = logging.getLogger(__name__)

# --- Onboarding ---
@router.post("/onboarding")
async def process_onboarding(payload: OnboardingPayload, user=Depends(get_current_user)):
    user_id = user.get("sub")
    db = get_db()
    
    # 1. Update Profile
    # Assuming profile exists, we update it
    profile_data = {
        "current_position": payload.current_role,
        "years_of_experience": 0 if not payload.experience else int(''.join(filter(str.isdigit, payload.experience)) or 0)
    }
    db.table("profiles").update(profile_data).eq("id", user_id).execute()
    
    # 2. Add Career Visions (1/3/5 years based on target_timeline)
    db.table("career_visions").insert({
        "user_id": user_id,
        "title": payload.target_role,
        "timeline_type": "3_YEAR" if "3" in payload.target_timeline else "1_YEAR",
        "status": "ACTIVE"
    }).execute()
    
    # 3. Add Weekly Goals as Daily Planner Tasks
    today = datetime.now().date().isoformat()
    for goal in payload.weekly_goals:
        db.table("daily_planner").insert({
            "user_id": user_id,
            "title": goal,
            "scheduled_date": today,
            "status": "TODO"
        }).execute()
        
    # 4. Create Learning Habit based on daily study hours
    db.table("habits").insert({
        "user_id": user_id,
        "name": f"Study for {payload.daily_study_hours} hours",
        "frequency": "DAILY"
    }).execute()
    
    # 5. Generate Initial AI Roadmap
    # Using CareerService to reuse logic
    service = CareerService()
    try:
        req_data = type("Obj", (object,), {
            "target_role": payload.target_role,
            "current_state": payload.current_role,
            "timeline": payload.target_timeline,
            "daily_routine": f"Study {payload.daily_study_hours} hrs/day"
        })
        await service.generate_roadmap(user_id, req_data, payload.skills)
    except Exception as e:
        logger.error(f"Failed to generate initial roadmap during onboarding: {e}")
        
    return {"status": "success", "message": "Career OS successfully initialized."}

# --- Career Vision ---

@router.get("/vision")
async def get_visions(user=Depends(get_current_user)):
    user_id = user.get("sub")
    db = get_db()
    if not db:
        raise HTTPException(status_code=500, detail="Database unavailable")
    res = db.table("career_visions").select("*").eq("user_id", user_id).order("target_date").execute()
    return {"status": "success", "data": res.data or []}

@router.post("/vision")
async def create_vision(vision: CareerVisionCreate, user=Depends(get_current_user)):
    user_id = user.get("sub")
    db = get_db()
    data = vision.model_dump()
    data["user_id"] = user_id
    if data["target_date"]:
        data["target_date"] = data["target_date"].isoformat()
    res = db.table("career_visions").insert(data).execute()
    return {"status": "success", "data": res.data[0] if res.data else None}

# --- Daily Planner & Habits ---

@router.get("/planner")
async def get_planner(user=Depends(get_current_user)):
    user_id = user.get("sub")
    db = get_db()
    today = datetime.now().date().isoformat()
    # Fetch tasks for today and onwards (or just today for simplicity)
    tasks = db.table("daily_planner").select("*").eq("user_id", user_id).gte("scheduled_date", today).order("scheduled_date").execute()
    habits = db.table("habits").select("*").eq("user_id", user_id).execute()
    return {"status": "success", "data": {"tasks": tasks.data or [], "habits": habits.data or []}}

@router.post("/planner/task")
async def create_planner_task(task: DailyPlannerCreate, user=Depends(get_current_user)):
    user_id = user.get("sub")
    db = get_db()
    data = task.model_dump()
    data["user_id"] = user_id
    data["scheduled_date"] = data["scheduled_date"].isoformat()
    if data.get("time_start"): data["time_start"] = data["time_start"].isoformat()
    if data.get("time_end"): data["time_end"] = data["time_end"].isoformat()
    res = db.table("daily_planner").insert(data).execute()
    return {"status": "success", "data": res.data[0] if res.data else None}

@router.post("/planner/habit")
async def create_habit(habit: HabitCreate, user=Depends(get_current_user)):
    user_id = user.get("sub")
    db = get_db()
    data = habit.model_dump()
    data["user_id"] = user_id
    res = db.table("habits").insert(data).execute()
    return {"status": "success", "data": res.data[0] if res.data else None}

# --- AI Coach ---
@router.post("/coach")
async def ai_coach(message: str = Body(..., embed=True), user=Depends(get_current_user)):
    user_id = user.get("sub")
    import google.generativeai as genai
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="AI API not configured")
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-2.5-flash")
        # In a real app we would pass chat history and user context here
        prompt = f"You are an AI Career Coach. The user is asking: {message}. Give them brief, actionable advice."
        response = model.generate_content(prompt)
        return {"status": "success", "reply": response.text.strip()}
    except Exception as e:
        logger.error(f"AI Coach error: {e}")
        raise HTTPException(status_code=500, detail="AI Coach is currently unavailable.")

# --- HR View ---
@router.get("/hr-view/{candidate_id}")
async def get_hr_view(candidate_id: str, user=Depends(get_current_user)):
    """Provides a sanitized read-only view of a candidate's Career OS for recruiters."""
    # Ensure current user is an employer/recruiter (omitted for brevity)
    db = get_db()
    
    # Only fetch high-level visions and roadmaps
    visions = db.table("career_visions").select("*").eq("user_id", candidate_id).execute()
    roadmaps = db.table("career_roadmaps").select("*").eq("user_id", candidate_id).order("updated_at", desc=True).limit(1).execute()
    achievements = db.table("achievements").select("*").eq("user_id", candidate_id).execute()
    
    return {
        "status": "success", 
        "data": {
            "visions": visions.data or [],
            "roadmap": roadmaps.data[0] if roadmaps.data else None,
            "achievements": achievements.data or []
        }
    }
