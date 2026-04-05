from pydantic import BaseModel, ConfigDict
from uuid import UUID
from typing import Optional, List, Dict, Any
from datetime import datetime

class MetricPoint(BaseModel):
    label: str
    value: float
    timestamp: Optional[datetime] = None

class DashboardSummary(BaseModel):
    total_users: int
    active_jobs: int
    nfts_minted: int
    ai_analyses: int
    growth_percentage: float

class AnalyticsResponse(BaseModel):
    summary: DashboardSummary
    trends: Dict[str, List[MetricPoint]]
    last_updated: datetime

    model_config = ConfigDict(from_attributes=True)

class UserInsightResponse(BaseModel):
    proof_score: float
    skill_growth: List[MetricPoint]
    job_matches: List[MetricPoint]
    recommendations: List[str]
