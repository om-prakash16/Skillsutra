import asyncio
import logging
from typing import Dict, Any, List
import db.engine as engine
from core.exceptions import ExternalServiceError, NotFoundError

logger = logging.getLogger(__name__)

class AdminService:
    @staticmethod
    async def get_dashboard_metrics() -> Dict[str, Any]:
        """Aggregates real-time metrics for the Super Admin dashboard."""
        if not engine.db_client: raise ExternalServiceError("Database unavailable")
        
        # Parallel queries for performance
        tasks = [
            engine.db_client.table("users").select("id", count="exact").execute(),
            engine.db_client.table("companies").select("id", count="exact").execute(),
            engine.db_client.table("jobs").select("id", count="exact").execute(),
            engine.db_client.table("applications").select("id", count="exact").execute(),
            engine.db_client.table("activity_events").select("*").order("created_at", desc=True).limit(10).execute()
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        def get_count(res):
            if isinstance(res, Exception):
                logger.error(f"Failed to get count: {res}")
                return 0
            return res.count if hasattr(res, "count") else 0

        recent_act = []
        if len(results) > 4 and not isinstance(results[4], Exception) and hasattr(results[4], "data"):
            recent_act = results[4].data
        elif len(results) > 4 and isinstance(results[4], Exception):
            logger.error(f"Failed to get activity timeline: {results[4]}")

        metrics_dict = {
            "total_users": get_count(results[0]),
            "total_companies": get_count(results[1]),
            "total_jobs": get_count(results[2]),
            "total_applications": get_count(results[3]),
        }
        return {
            "metrics": metrics_dict,
            "recent_activity": recent_act,
            "system_health": "operational",
            "total_users": metrics_dict["total_users"],
            "total_companies": metrics_dict["total_companies"],
            "total_jobs": metrics_dict["total_jobs"],
            "total_applications": metrics_dict["total_applications"],
        }

    @staticmethod
    async def toggle_feature(feature_name: str, enabled: bool, admin_id: str = None) -> Dict[str, Any]:
        if not engine.db_client: raise ExternalServiceError("Database unavailable")
        update_data = {"is_enabled": enabled}
        if admin_id:
            update_data["updated_by"] = admin_id
            
        res = await engine.db_client.table("feature_flags").update(update_data).eq("feature_name", feature_name).execute()
        
        if not res.data:
            insert_data = {
                "feature_name": feature_name, 
                "is_enabled": enabled,
                "category": "ai",
                "description": f"Dynamic feature flag for {feature_name}"
            }
            if admin_id:
                insert_data["updated_by"] = admin_id
            res = await engine.db_client.table("feature_flags").insert(insert_data).execute()
            
        if not res.data:
            raise NotFoundError(f"Feature '{feature_name}' not found")
        return res.data[0]

    @staticmethod
    async def update_ai_weights(weights: Dict[str, float]) -> Dict[str, Any]:
        if not engine.db_client: raise ExternalServiceError("Database unavailable")
        res = await engine.db_client.table("platform_settings").update({"setting_value": weights}).eq("setting_key", "ai_score_weights").execute()
        if not res.data:
             # Try insert if not exists
             res = await engine.db_client.table("platform_settings").insert({"setting_key": "ai_score_weights", "setting_value": weights}).execute()
        return res.data[0]

    @staticmethod
    async def moderate_entity(admin_id: str, target_id: str, target_type: str, action: str, reason: str):
        if not engine.db_client: raise ExternalServiceError("Database unavailable")
        # 1. Log Action
        await engine.db_client.table("moderation_logs").insert({
            "admin_id": admin_id,
            "target_id": target_id,
            "target_type": target_type,
            "action": action,
            "reason": reason
        }).execute()
        
        # 2. Apply Action
        if target_type == "user":
            status = "suspended" if action == "suspend" else "banned" if action == "ban" else "active"
            await engine.db_client.table("users").update({"status": status}).eq("id", target_id).execute()
        elif target_type == "company":
            await engine.db_client.table("companies").update({"is_verified": False if action == "suspend" else True}).eq("id", target_id).execute()
        
        return {"action": action, "target_id": target_id}

    @staticmethod
    async def bootstrap_platform() -> Dict[str, Any]:
        """Initial platform setup and core data seeding (Production safe)."""
        if not engine.db_client: raise ExternalServiceError("Database unavailable")
        # Logic for creating base roles, core skills, and initial schemas
        # This replaces the 'dummy' seeder with a idempotent bootstrap.
        try:
            # Check for existing roles
            roles = await engine.db_client.table("roles").select("role_name").execute()
            if not roles.data:
                await engine.db_client.table("roles").insert([
                    {"role_name": "USER"},
                    {"role_name": "COMPANY"},
                    {"role_name": "ADMIN"}
                ]).execute()
            return {"status": "Platform bootstrapped successfully"}
        except Exception as e:
            logger.error(f"Bootstrap failed: {e}")
            raise ExternalServiceError("Bootstrap sequence failed")

    @staticmethod
    async def get_all_settings() -> List[Dict[str, Any]]:
        if not engine.db_client: raise ExternalServiceError("Database unavailable")
        res = await engine.db_client.table("platform_settings").select("*").execute()
        return res.data or []

    @staticmethod
    async def update_setting(key: str, value: Any) -> Dict[str, Any]:
        if not engine.db_client: raise ExternalServiceError("Database unavailable")
        res = await engine.db_client.table("platform_settings").upsert({"setting_key": key, "setting_value": value}).execute()
        return res.data[0] if res.data else {}

# Singleton
admin_service = AdminService()
