from pydantic import BaseModel
from typing import List, Optional
from datetime import date, time, datetime

# --- Career Vision ---
class CareerVisionBase(BaseModel):
    title: str
    description: Optional[str] = None
    timeline_type: str = "1_YEAR"
    status: str = "ACTIVE"
    target_date: Optional[date] = None

class CareerVisionCreate(CareerVisionBase):
    pass

class CareerVision(CareerVisionBase):
    id: str
    user_id: str
    created_at: datetime

# --- Daily Planner ---
class DailyPlannerBase(BaseModel):
    title: str
    description: Optional[str] = None
    scheduled_date: date
    time_start: Optional[time] = None
    time_end: Optional[time] = None
    status: str = "TODO"

class DailyPlannerCreate(DailyPlannerBase):
    pass

class DailyPlanner(DailyPlannerBase):
    id: str
    user_id: str
    created_at: datetime

# --- Habits ---
class HabitBase(BaseModel):
    name: str
    frequency: str = "DAILY"

class HabitCreate(HabitBase):
    pass

class Habit(HabitBase):
    id: str
    user_id: str
    current_streak: int = 0
    longest_streak: int = 0
    created_at: datetime

# --- Achievements ---
class AchievementBase(BaseModel):
    title: str
    category: str = "SKILL"
    earned_date: date
    icon_url: Optional[str] = None

class AchievementCreate(AchievementBase):
    pass

class Achievement(AchievementBase):
    id: str
    user_id: str
    created_at: datetime

# --- Onboarding ---
class OnboardingPayload(BaseModel):
    # Step 1: Current
    current_role: str
    experience: str
    skills: List[str]
    # Step 2: Future
    target_role: str
    target_salary: Optional[str] = None
    target_timeline: str
    # Step 3: Learning
    skills_to_learn: List[str]
    career_challenge: Optional[str] = None
    # Step 4: Lifestyle
    daily_study_hours: int
    work_preference: str
    weekly_goals: List[str]
