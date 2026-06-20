from fastapi import APIRouter, Depends, Query
from typing import Optional

from core.response import success_response
from modules.auth.core.guards import get_current_user

router = APIRouter(prefix="/audit", tags=["Audit & Compliance"])

@router.get("/logs")
async def get_audit_logs(
    action_type: Optional[str] = None,
    actor_id: Optional[str] = None,
    scope: str = "GLOBAL", # GLOBAL or COMPANY
    limit: int = Query(50, le=100),
    user = Depends(get_current_user)
):
    """
    Fetch system audit logs. 
    In production, SUPER_ADMIN sees GLOBAL. COMPANY_ADMIN sees COMPANY.
    """
    # Mocking Audit Logs
    data = [
        {
            "id": "log-1",
            "actor": {"id": "u-99", "name": "System Admin", "email": "admin@skillsutra.com"},
            "action_type": "ROLE_GRANTED",
            "resource_type": "USER",
            "resource_id": "u-42",
            "metadata": {"role_assigned": "PLATFORM_MODERATOR"},
            "ip_address": "192.168.1.104",
            "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
            "timestamp": "2026-06-11T14:00:00Z"
        },
        {
            "id": "log-2",
            "actor": {"id": "u-rec-1", "name": "David Chen", "email": "david@stripe.com"},
            "action_type": "PORTFOLIO_DOWNLOADED",
            "resource_type": "PROOF_SCORE",
            "resource_id": "ps-777",
            "metadata": {"candidate_name": "Alice Johnson", "domain": "System Design"},
            "ip_address": "203.0.113.42",
            "user_agent": "Chrome/114.0.0.0",
            "timestamp": "2026-06-11T13:45:00Z"
        },
        {
            "id": "log-3",
            "actor": {"id": "u-ai-sys", "name": "SkillSutra AI", "email": "system@skillsutra.com"},
            "action_type": "ASSESSMENT_GRADED",
            "resource_type": "ASSESSMENT",
            "resource_id": "assess-12",
            "metadata": {"score": 88.5, "passed": True},
            "ip_address": "127.0.0.1",
            "user_agent": "internal/ai-engine",
            "timestamp": "2026-06-11T13:30:00Z"
        }
    ]
    
    if action_type:
        data = [log for log in data if log["action_type"] == action_type]
        
    return success_response(data=data, message="Audit logs retrieved successfully.")

@router.post("/export")
async def export_audit_logs(
    start_date: str,
    end_date: str,
    user = Depends(get_current_user)
):
    """
    Export audit logs to a secure CSV or JSON payload for SOC2 reporting.
    """
    data = {
        "export_id": "exp-2026-06-11",
        "status": "PROCESSING",
        "download_url": "https://storage.skillsutra.com/exports/audit_exp_2026_06_11.csv.gz",
        "expires_in": "24h"
    }
    return success_response(data=data, message="Audit export job started.")
