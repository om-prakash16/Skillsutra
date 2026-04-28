from portal.apps.admin.service import AdminService
from fastapi import HTTPException

class AdminController:
    def __init__(self):
        self.service = AdminService()

    async def get_stats(self):
        return await self.service.get_dashboard_stats()

    async def update_feature(self, data: dict):
        name = data.get("name")
        enabled = data.get("enabled")
        if name is None or enabled is None:
            raise HTTPException(status_code=400, detail="Missing feature name or enabled status")
        return await self.service.toggle_platform_feature(name, enabled)

    async def moderate(self, admin_id: str, data: dict):
        user_id = data.get("user_id")
        action = data.get("action")
        reason = data.get("reason", "")
        if not user_id or not action:
            raise HTTPException(status_code=400, detail="Missing user_id or action")
        return await self.service.moderate_user(admin_id, user_id, action, reason)

    async def list_settings(self):
        return await self.service.get_settings()

    async def set_config(self, data: dict):
        key = data.get("key")
        value = data.get("value")
        if not key:
            raise HTTPException(status_code=400, detail="Missing config key")
        return await self.service.update_config(key, value)
