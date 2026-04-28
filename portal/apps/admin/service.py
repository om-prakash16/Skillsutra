from portal.apps.admin.repository import AdminRepository
from typing import Dict, Any, List

class AdminService:
    def __init__(self):
        self.repository = AdminRepository()

    async def get_dashboard_stats(self) -> Dict[str, Any]:
        metrics = await self.repository.get_system_metrics()
        return {
            **metrics,
            "status": "Healthy",
            "timestamp": "2026-04-28T19:15:00Z"
        }

    async def toggle_platform_feature(self, name: str, enabled: bool):
        return self.repository.update_feature_flag(name, enabled)

    async def moderate_user(self, admin_id: str, user_id: str, action: str, reason: str):
        # 1. Log the moderation action
        self.repository.log_moderation({
            "admin_id": admin_id,
            "target_id": user_id,
            "target_type": "user",
            "action": action,
            "reason": reason
        })
        
        # 2. Update user status
        status = "suspended" if action == "suspend" else "banned" if action == "ban" else "active"
        return self.repository.update_user_status(user_id, status)

    async def get_settings(self):
        res = self.repository.get_all_settings()
        return res.data if res.data else []

    async def update_config(self, key: str, value: Any):
        return self.repository.update_platform_setting(key, value)
