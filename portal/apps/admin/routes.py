from fastapi import APIRouter, Depends
from portal.apps.admin.controller import AdminController
from portal.core.security import require_role

router = APIRouter()
controller = AdminController()

@router.get("/stats")
async def get_dashboard_stats(admin=Depends(require_role("ADMIN"))):
    return await controller.get_stats()

@router.post("/features/toggle")
async def toggle_feature(data: dict, admin=Depends(require_role("ADMIN"))):
    return await controller.update_feature(data)

@router.post("/moderate")
async def moderate_user(data: dict, admin=Depends(require_role("ADMIN"))):
    return await controller.moderate(admin["sub"], data)

@router.get("/settings")
async def list_settings(admin=Depends(require_role("ADMIN"))):
    return await controller.list_settings()

@router.post("/settings")
async def update_setting(data: dict, admin=Depends(require_role("ADMIN"))):
    return await controller.set_config(data)
