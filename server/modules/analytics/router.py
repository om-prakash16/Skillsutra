from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any, Optional
from modules.analytics.service import AnalyticsService
from modules.admin.feature_service import FeatureFlagService
from modules.nft.service import NFTService
from modules.auth.service import get_current_user
from core.supabase import get_supabase
import uuid

router = APIRouter()
analytics_service = AnalyticsService()

# --- API Endpoints ---

@router.get("/user")
async def get_user_analytics(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Personal career growth metrics and AI score trends.
    """
    return await analytics_service.get_user_analytics(uuid.UUID(current_user["id"]))

@router.get("/company")
async def get_company_analytics(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Recruitment pipeline and job performance metrics.
    """
    # In a real app: verify user belongs to a company
    return await analytics_service.get_company_analytics(uuid.UUID(current_user["id"]))

@router.get("/admin")
async def get_admin_analytics(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Global SaaS health and system-wide growth metrics.
    """
    # In a real app: check for 'admin' role
    return await analytics_service.get_admin_analytics()
