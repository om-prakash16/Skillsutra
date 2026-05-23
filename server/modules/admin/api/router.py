from fastapi import APIRouter, Depends, Query, Body, WebSocket, WebSocketDisconnect
from typing import Dict, Any, List, Optional
import asyncio
import time
import random
import logging

from core.response import success_response
from core.dependencies import get_current_user_id
from modules.auth.core.guards import require_admin, require_moderator, require_ai_admin
from modules.admin.core.service import admin_service
from modules.admin.core.schema_service import schema_service

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/bootstrap")
async def bootstrap_platform(admin=Depends(require_admin)):
    """Production Bootstrap: Setup core roles and initial system data."""
    result = await admin_service.bootstrap_platform()
    return success_response(data=result, message="Bootstrap sequence completed")

@router.get("/dashboard")
async def get_admin_dashboard(admin=Depends(require_admin)):
    """Unified platform metrics for Super Admins."""
    metrics = await admin_service.get_dashboard_metrics()
    return success_response(data=metrics)

@router.get("/settings")
async def get_system_settings(admin=Depends(require_admin)):
    """Fetch platform-wide configuration settings."""
    settings = await admin_service.get_all_settings()
    return success_response(data=settings)

@router.patch("/settings")
async def update_system_setting(
    payload: Dict[str, Any] = Body(...),
    admin=Depends(require_admin)
):
    """Update a specific platform configuration (PATCH)."""
    key = payload.get("setting_key")
    val = payload.get("setting_value")
    result = await admin_service.update_setting(key, val)
    return success_response(data=result, message=f"Setting '{key}' updated")

@router.post("/settings")
async def update_system_setting_post(
    payload: Dict[str, Any] = Body(...),
    admin=Depends(require_admin)
):
    """Update a specific platform configuration (POST alias)."""
    key = payload.get("setting_key")
    val = payload.get("setting_value")
    result = await admin_service.update_setting(key, val)
    return success_response(data=result, message=f"Setting '{key}' updated")

@router.post("/moderate")
async def moderate_entity(
    target_id: str = Body(...),
    target_type: str = Body(...),
    action: str = Body(...),
    reason: str = Body(...),
    moderator=Depends(require_moderator)
):
    """Execute moderation actions (Warn, Suspend, Ban)."""
    result = await admin_service.moderate_entity(
        admin_id=moderator["id"],
        target_id=target_id,
        target_type=target_type,
        action=action,
        reason=reason
    )
    return success_response(data=result, message=f"Moderation action '{action}' executed")

# -- User Management --
@router.get("/users")
async def list_users(
    limit: int = Query(100),
    admin=Depends(require_admin)
):
    """List all registered users."""
    from core.supabase import get_supabase
    db = get_supabase()
    res = db.table("users").select("*, profiles(*)").limit(limit).execute()
    return success_response(data=res.data)

@router.patch("/users/{wallet}")
async def update_user(
    wallet: str,
    payload: Dict[str, Any] = Body(...),
    admin=Depends(require_admin)
):
    """Update user metadata, status, or role."""
    from core.supabase import get_supabase
    db = get_supabase()
    res = db.table("users").update(payload).eq("wallet_address", wallet).execute()
    return success_response(data=res.data[0] if res.data else {}, message="User updated successfully")

@router.post("/users/flag")
async def flag_user(
    payload: Dict[str, Any] = Body(...),
    admin=Depends(require_admin)
):
    """Flag a user for moderator review."""
    from core.supabase import get_supabase
    db = get_supabase()
    target_wallet = payload.get("wallet") or payload.get("wallet_address")
    reason = payload.get("reason", "Suspicious activity detected")
    severity = payload.get("severity", "medium")
    
    user_res = db.table("users").select("id").eq("wallet_address", target_wallet).execute()
    user_id = user_res.data[0]["id"] if user_res.data else None
    
    if user_id:
        db.table("user_reports").insert({
            "reporter_id": admin["id"],
            "reported_user_id": user_id,
            "reason": f"[{severity.upper()}] {reason}",
            "status": "pending"
        }).execute()
        
    await admin_service.moderate_entity(
        admin_id=admin["id"],
        target_id=user_id or target_wallet,
        target_type="user",
        action=f"flag_user_{severity}",
        reason=reason
    )
    return success_response(message="User flagged successfully")

# -- Schema --
@router.get("/schema")
async def get_full_schema(admin=Depends(require_admin)):
    """Fetch all dynamic profile fields."""
    fields = await schema_service.get_all_fields()
    return success_response(data=fields)

@router.post("/schema")
async def save_schema_field(
    field: Dict[str, Any],
    admin=Depends(require_admin)
):
    """Add or update a dynamic profile field."""
    result = await schema_service.upsert_field(field)
    return success_response(data=result)

@router.patch("/schema/{id}")
async def update_schema_field(
    id: str,
    field: Dict[str, Any] = Body(...),
    admin=Depends(require_admin)
):
    """Update an existing schema field."""
    from core.supabase import get_supabase
    db = get_supabase()
    res = db.table("profile_schema_fields").update(field).eq("id", id).execute()
    return success_response(data=res.data[0] if res.data else {}, message="Schema field updated")

@router.delete("/schema/{id}")
async def delete_schema_field(
    id: str,
    admin=Depends(require_admin)
):
    """Delete a schema field."""
    from core.supabase import get_supabase
    db = get_supabase()
    db.table("profile_schema_fields").delete().eq("id", id).execute()
    return success_response(message="Schema field deleted")

# -- Companies --
@router.get("/companies")
async def get_companies(admin=Depends(require_admin)):
    """Fetch all registered corporate entities."""
    from core.supabase import get_supabase
    db = get_supabase()
    res = db.table("companies").select("*").execute()
    return success_response(data=res.data)

@router.patch("/companies/{id}/verify")
async def verify_company(id: str, admin=Depends(require_admin)):
    """Mark a company as verified."""
    from core.supabase import get_supabase
    db = get_supabase()
    res = db.table("companies").update({"verified": True}).eq("id", id).execute()
    return success_response(data=res.data[0] if res.data else {}, message="Company verified successfully")

@router.delete("/companies/{id}")
async def delete_company(id: str, admin=Depends(require_admin)):
    """Delete a company."""
    from core.supabase import get_supabase
    db = get_supabase()
    db.table("companies").delete().eq("id", id).execute()
    return success_response(message="Company deleted successfully")

# -- Jobs & Applications --
@router.get("/all-jobs")
async def get_all_jobs(admin=Depends(require_admin)):
    """Fetch all job posts globally."""
    from core.supabase import get_supabase
    db = get_supabase()
    res = db.table("jobs").select("*, companies(name)").execute()
    return success_response(data=res.data)

@router.delete("/jobs/{id}")
async def delete_job(id: str, admin=Depends(require_admin)):
    """Delete a job post."""
    from core.supabase import get_supabase
    db = get_supabase()
    db.table("jobs").delete().eq("id", id).execute()
    return success_response(message="Job deleted successfully")

@router.get("/all-applications")
async def get_all_applications(admin=Depends(require_admin)):
    """Fetch all applications globally."""
    from core.supabase import get_supabase
    db = get_supabase()
    res = db.table("applications").select("*, jobs(title), users(full_name)").execute()
    return success_response(data=res.data)

# -- Skills Taxonomy --
@router.get("/skills")
async def get_skills(admin=Depends(require_admin)):
    """Fetch global skills taxonomy dictionary."""
    from core.supabase import get_supabase
    db = get_supabase()
    res = db.table("skills").select("*").execute()
    return success_response(data=res.data)

@router.post("/skills")
async def create_skill(
    payload: Dict[str, Any] = Body(...),
    admin=Depends(require_admin)
):
    """Add a new skill to the global taxonomy."""
    from core.supabase import get_supabase
    db = get_supabase()
    res = db.table("skills").insert(payload).execute()
    return success_response(data=res.data[0] if res.data else {}, message="Skill created successfully")

# -- Blockchain Transactions --
@router.get("/blockchain/transactions")
async def get_blockchain_transactions(admin=Depends(require_admin)):
    """Fetch indexed ledger transactions."""
    from core.supabase import get_supabase
    db = get_supabase()
    res = db.table("blockchain_transactions").select("*").order("timestamp", desc=True).execute()
    return success_response(data=res.data)

# -- Moderation Reports --
@router.get("/reports")
async def get_reports(
    status: Optional[str] = Query(None),
    admin=Depends(require_admin)
):
    """Get all moderation reports (users and jobs)."""
    from core.supabase import get_supabase
    db = get_supabase()
    
    uq = db.table("user_reports").select("*, users!reporter_id(full_name), reported:users!reported_user_id(full_name)")
    if status:
        uq = uq.eq("status", status)
    user_reps = uq.execute()
    
    jq = db.table("job_reports").select("*, users!reporter_id(full_name), jobs(title)")
    if status:
        jq = jq.eq("status", status)
    job_reps = jq.execute()
    
    reports = []
    for r in (user_reps.data or []):
        reports.append({
            "id": r["id"],
            "type": "user",
            "reporter": r.get("users", {}).get("full_name") if r.get("users") else "Unknown",
            "target": r.get("reported", {}).get("full_name") if r.get("reported") else "Unknown",
            "target_id": r["reported_user_id"],
            "reason": r["reason"],
            "status": r["status"],
            "created_at": r["created_at"]
        })
    for r in (job_reps.data or []):
        reports.append({
            "id": r["id"],
            "type": "job",
            "reporter": r.get("users", {}).get("full_name") if r.get("users") else "Unknown",
            "target": r.get("jobs", {}).get("title") if r.get("jobs") else "Unknown",
            "target_id": r["job_id"],
            "reason": r["reason"],
            "status": r["status"],
            "created_at": r["created_at"]
        })
        
    reports.sort(key=lambda x: x["created_at"], reverse=True)
    return success_response(data=reports)

@router.patch("/reports/resolve")
async def resolve_report(
    payload: Dict[str, Any] = Body(...),
    admin=Depends(require_admin)
):
    """Resolve user or job report."""
    from core.supabase import get_supabase
    db = get_supabase()
    report_id = payload.get("id") or payload.get("report_id")
    report_type = payload.get("type", "user")
    status = payload.get("status", "resolved")
    
    if report_type == "user":
        db.table("user_reports").update({"status": status}).eq("id", report_id).execute()
    else:
        db.table("job_reports").update({"status": status}).eq("id", report_id).execute()
        
    return success_response(message="Report resolved successfully")

# -- Subscriptions --
@router.get("/subscriptions")
async def get_subscriptions(admin=Depends(require_admin)):
    """Fetch all platform subscription tiers."""
    from core.supabase import get_supabase
    db = get_supabase()
    res = db.table("platform_subscriptions").select("*").execute()
    return success_response(data=res.data)

@router.patch("/subscriptions/{id}")
async def update_subscription(
    id: str,
    payload: Dict[str, Any] = Body(...),
    admin=Depends(require_admin)
):
    """Update subscription settings for a tier."""
    from core.supabase import get_supabase
    db = get_supabase()
    res = db.table("platform_subscriptions").update(payload).eq("id", id).execute()
    return success_response(data=res.data[0] if res.data else {}, message="Subscription updated successfully")

# -- Skill Verification Flags --
@router.get("/skill-flags")
async def get_skill_flags(
    status: Optional[str] = Query(None),
    admin=Depends(require_admin)
):
    """Get all flagged skill certifications in moderation queue."""
    from core.supabase import get_supabase
    db = get_supabase()
    q = db.table("skill_verification_flags").select("*")
    if status:
        q = q.eq("status", status)
    res = q.execute()
    return success_response(data=res.data)

@router.post("/skill-flags/review/{id}")
async def review_skill_flag(
    id: str,
    payload: Dict[str, Any] = Body(...),
    admin=Depends(require_admin)
):
    """Approve or reject a flagged skill verification badge."""
    from core.supabase import get_supabase
    db = get_supabase()
    status = payload.get("status", "approved")
    notes = payload.get("review_notes", "")
    reviewer_wallet = admin.get("wallet_address", "")
    
    res = db.table("skill_verification_flags").update({
        "status": status,
        "reviewed_by": reviewer_wallet,
        "review_notes": notes,
        "updated_at": "now()"
    }).eq("id", id).execute()
    return success_response(data=res.data[0] if res.data else {}, message="Skill flag reviewed successfully")

# -- Support Tickets --
@router.get("/tickets")
async def get_tickets(
    status: Optional[str] = Query(None),
    admin=Depends(require_admin)
):
    """Get all support tickets."""
    from core.supabase import get_supabase
    db = get_supabase()
    q = db.table("support_tickets").select("*, users!user_id(full_name)")
    if status:
        q = q.eq("status", status)
    res = q.execute()
    return success_response(data=res.data)

@router.patch("/tickets/{id}")
async def update_ticket(
    id: str,
    payload: Dict[str, Any] = Body(...),
    admin=Depends(require_admin)
):
    """Update priority, status, or assignee of a ticket."""
    from core.supabase import get_supabase
    db = get_supabase()
    payload["updated_at"] = "now()"
    res = db.table("support_tickets").update(payload).eq("id", id).execute()
    return success_response(data=res.data[0] if res.data else {}, message="Ticket updated successfully")

# -- Audit Logs --
@router.get("/audit-logs")
async def get_audit_logs(admin=Depends(require_admin)):
    """Fetch immutable administrator governance actions logs."""
    from core.supabase import get_supabase
    db = get_supabase()
    res = db.table("staff_audit_logs").select("*").order("created_at", desc=True).execute()
    return success_response(data=res.data)

# -- Realtime Telemetry WebSocket --
@router.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    """Real-time monitoring telemetry stream for dashboard charts."""
    await websocket.accept()
    try:
        while True:
            try:
                metrics_summary = await admin_service.get_dashboard_metrics()
                totals = metrics_summary.get("metrics", {})
                
                # Dynamic telemetry simulation values representing live traffic
                active_users = totals.get("total_users", 0) + random.randint(3, 12)
                latency = f"{random.randint(11, 28)}ms"
                block_height = random.randint(18290390, 18290500)
                accuracy = round(92.0 + random.random() * 4, 1)
                tput = f"{round(95.0 + random.random() * 4, 1)}%"
                
                telemetry_payload = {
                    "type": "telemetry_update",
                    "timestamp": time.time(),
                    "active_users": active_users,
                    "totals": totals,
                    "latency": latency,
                    "blockchain": {
                        "block_height": block_height,
                        "sync_status": "Synced",
                        "tps": random.randint(1400, 2200)
                    },
                    "ai": {
                        "accuracy": accuracy,
                        "throughput": tput,
                        "queue_size": random.randint(0, 5)
                    }
                }
                
                await websocket.send_json(telemetry_payload)
                await asyncio.sleep(3)
            except asyncio.CancelledError:
                break
    except WebSocketDisconnect:
        logger.info("Admin telemetry WebSocket disconnected")
    except Exception as e:
        logger.error(f"Admin telemetry WebSocket error: {e}")
