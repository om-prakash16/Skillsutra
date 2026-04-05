import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from core.supabase import get_supabase

class AnalyticsService:
    @staticmethod
    async def get_user_analytics(user_id: uuid.UUID) -> Dict[str, Any]:
        """
        SECTION 2: User-specific career growth analytics.
        """
        db = get_supabase()
        
        # 1. Fetch Proof Score History (Mocked as trend)
        # In real app: select from analytics_events where type='ai_scoring'
        proof_trend = [
            {"date": "2024-01", "score": 65},
            {"date": "2024-02", "score": 72},
            {"date": "2024-03", "score": 85},
            {"date": "2024-04", "score": 88}
        ]
        
        # 2. Application Stats
        apps_count = db.table("applications").select("id", count="exact").eq("candidate_id", str(user_id)).execute().count
        
        return {
            "proof_score_trend": proof_trend,
            "total_applications": apps_count or 0,
            "skill_improvement": 12.5, # Percentage increase
            "interview_rate": 40.0
        }

    @staticmethod
    async def get_company_analytics(company_id: uuid.UUID) -> Dict[str, Any]:
        """
        SECTION 3: Company-specific recruitment analytics.
        """
        db = get_supabase()
        
        # 1. Applicants per job trend
        applicant_volume = [
            {"name": "Senior Rust Dev", "applicants": 45},
            {"name": "FastAPI Eng", "applicants": 28},
            {"name": "UI Designer", "applicants": 12}
        ]
        
        # 2. Global averages
        avg_match = db.table("applications").select("ai_match_score").execute()
        scores = [r["ai_match_score"] for r in avg_match.data] if avg_match.data else [0]
        
        return {
            "applicant_volume": applicant_volume,
            "avg_match_score": sum(scores) / len(scores) if scores else 0,
            "top_skills_demanded": ["Rust", "Solana", "Tailwind"],
            "time_to_hire": 14 # Days
        }

    @staticmethod
    async def get_admin_analytics() -> Dict[str, Any]:
        """
        SECTION 4: Global platform growth metrics.
        """
        db = get_supabase()
        
        # 1. System-wide totals
        user_count = db.table("users").select("id", count="exact").execute().count
        job_count = db.table("jobs").select("id", count="exact").execute().count
        nft_count = db.table("nft_records").select("id", count="exact").execute().count
        
        # 2. Growth metrics from aggregated_metrics table
        growth_data = db.table("aggregated_metrics") \
            .select("*") \
            .eq("metric_name", "daily_new_users") \
            .order("period_start", desc=False) \
            .limit(30) \
            .execute()
            
        return {
            "totals": {
                "users": user_count or 0,
                "jobs": job_count or 0,
                "nfts": nft_count or 0
            },
            "growth_trend": growth_data.data if growth_data.data else [],
            "skill_distribution": [
                {"name": "Python", "value": 400},
                {"name": "JavaScript", "value": 300},
                {"name": "Rust", "value": 200}
            ]
        }
