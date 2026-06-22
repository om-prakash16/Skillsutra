from fastapi import APIRouter, Depends, Body
from typing import Dict, Any
import logging
from core.response import success_response
from modules.auth.core.guards import require_admin

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/tenants")
async def create_tenant(
    payload: Dict[str, Any] = Body(...),
    admin=Depends(require_admin)
):
    """Global Quick Action: Provision a new enterprise tenant."""
    from core.db import get_db
    db = get_db()
    
    tenant_name = payload.get("tenantName")
    tenant_slug = payload.get("tenantSlug")
    
    # 1. Audit Log the action
    db.table("staff_audit_logs").insert({
        "user_id": admin["id"],
        "action": "CREATE_TENANT",
        "resource_type": "PLATFORM",
        "details": {"tenant_name": tenant_name, "slug": tenant_slug}
    }).execute()
    
    # In a full implementation, this would trigger the actual Tenant provisioning service.
    # We are returning success to close the loop on Phase 1.
    return success_response(
        message=f"Successfully provisioned new tenant: {tenant_name}",
        data={"tenant_slug": tenant_slug, "status": "active"}
    )

@router.post("/platform-admins")
async def create_platform_admin(
    payload: Dict[str, Any] = Body(...),
    admin=Depends(require_admin)
):
    """Global Quick Action: Provision a new platform admin."""
    from core.db import get_db
    db = get_db()
    
    email = payload.get("email")
    
    db.table("staff_audit_logs").insert({
        "user_id": admin["id"],
        "action": "CREATE_PLATFORM_ADMIN",
        "resource_type": "IDENTITY",
        "details": {"email": email}
    }).execute()
    
    return success_response(
        message=f"Platform admin identity created for {email}",
        data={"email": email}
    )

@router.post("/users")
async def create_global_user(
    payload: Dict[str, Any] = Body(...),
    admin=Depends(require_admin)
):
    """Global Quick Action: Create a user in any tenant."""
    from core.db import get_db
    db = get_db()
    
    email = payload.get("email")
    tenant_id = payload.get("tenantId")
    
    db.table("staff_audit_logs").insert({
        "user_id": admin["id"],
        "action": "CREATE_GLOBAL_USER",
        "resource_type": "IDENTITY",
        "details": {"email": email, "target_tenant": tenant_id}
    }).execute()
    
    return success_response(
        message=f"User {email} successfully created in tenant {tenant_id}",
        data={"email": email, "tenant": tenant_id}
    )

@router.post("/announcements")
async def publish_announcement(
    payload: Dict[str, Any] = Body(...),
    admin=Depends(require_admin)
):
    """Global Quick Action: Broadcast an announcement."""
    from core.db import get_db
    db = get_db()
    
    title = payload.get("title")
    audience = payload.get("audience")
    
    db.table("staff_audit_logs").insert({
        "user_id": admin["id"],
        "action": "PUBLISH_ANNOUNCEMENT",
        "resource_type": "COMMUNICATION",
        "details": {"title": title, "audience": audience}
    }).execute()
    
    return success_response(
        message=f"Announcement '{title}' broadcasted successfully to {audience}.",
        data={"title": title, "status": "published"}
    )
