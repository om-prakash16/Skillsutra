from fastapi import APIRouter, Depends, Query, HTTPException
from typing import Dict, Any

from core.response import success_response
from core.dependencies import get_db
from modules.ai.services.team_analyzer_service import team_analyzer_service
from modules.auth.core.guards import require_company_or_admin

router = APIRouter()

@router.get("/analyze")
async def analyze_team_balance(
    company_id: str = Query(..., description="The ID of the company to analyze"),
    user: Dict[str, Any] = Depends(require_company_or_admin),
    db = Depends(get_db)
):
    """
    Team Skill Balance Analyzer.
    Analyzes team vulnerabilities and skill gaps.
    """
    user_id = user.get("id")
    roles = [r.lower() for r in user.get("roles", [])]
    if "admin" not in roles and "super_admin" not in roles:
        # Check if the user is the creator of the company being analyzed
        res = await db.table("companies").select("id").eq("created_by_user_id", user_id).eq("id", company_id).limit(1).execute()
        if not res.data:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to analyze this company's team balance."
            )
    try:
        analysis = await team_analyzer_service.analyze_team_balance(company_id)
        return success_response(data=analysis)
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"Team analysis failed: {e}")
        return success_response(data={"error": "Analysis engine unavailable"}, status_code=500)

@router.get("/benchmarks/industry")
async def get_industry_team_benchmarks(
    industry: str = Query("Technology")
):
    """Get standard team skill distributions for a specific industry."""
    # These would ideally come from a database table
    benchmarks = {
        "Technology": {"Frontend": 80, "Backend": 85, "DevOps": 60, "Security": 50, "AI": 40},
        "Fintech": {"Frontend": 70, "Backend": 90, "DevOps": 80, "Security": 95, "AI": 30},
        "Web3": {"Frontend": 75, "Backend": 85, "DevOps": 50, "Security": 90, "AI": 20},
    }
    data = benchmarks.get(industry, benchmarks["Technology"])
    return success_response(data={"industry": industry, "benchmarks": data})
