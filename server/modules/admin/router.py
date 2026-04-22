from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, Optional
import uuid
from modules.auth.service import require_permission
from modules.auth.guards import require_admin
from core.supabase import get_supabase
from modules.activity.service import record_event
from modules.admin.models import (
    SkillFlagReview,
    SupportTicketUpdate,
    FlagUserAction,
    SchemaFieldCreate,
    FeatureToggleRequest,
    PlatformSettingRequest,
    UserUpdate as AdminUserUpdate,
)
import json
import os

router = APIRouter()


# -- Internal Helpers --


async def _write_staff_audit(
    staff_id: str, action: str, target_type: str, target_id: str, metadata: dict = {}
):
    """Immutable record of administrative actions."""
    db = get_supabase()
    if not db:
        return
    db.table("staff_audit_logs").insert(
        {
            "staff_wallet": staff_id,
            "action": action,
            "target_type": target_type,
            "target_id": target_id,
            "metadata": metadata,
        }
    ).execute()

    # Also log to global activity ledger
    await record_event(
        actor_id=staff_id,
        actor_role="admin",
        event_type=f"admin_{action}",
        description=f"Admin action performed: {action} on {target_type}",
        entity_type=target_type,
        entity_id=target_id,
    )


from pydantic import BaseModel


class ReportResolveAction(BaseModel):
    report_id: str
    status: str  # RESOLVED | DISMISSED
    admin_notes: Optional[str] = None
    block_user: bool = False


# -- Users --


@router.get("/users")
async def get_all_users(
    search: Optional[str] = None,
    status: Optional[str] = None,
    user=Depends(require_permission("user.promote")),
):
    """List all registered users with their current roles and optional search filters."""
    db = get_supabase()

    query = db.table("users").select("*")
    if search:
        query = query.or_(
            f"full_name.ilike.%{search}%,wallet_address.ilike.%{search}%,email.ilike.%{search}%"
        )
    if status:
        query = query.eq("status", status)

    users_resp = query.order("created_at", desc=True).execute()
    users = users_resp.data if users_resp.data else []

    if not users:
        return []

    # 2. Fetch all roles for these users
    user_ids = [u["id"] for u in users]
    roles_resp = (
        db.table("user_roles")
        .select("user_id, roles(role_name)")
        .in_("user_id", user_ids)
        .execute()
    )

    # 3. Map roles back to users
    role_map = {}
    for r in roles_resp.data or []:
        uid = r["user_id"]
        role_name = r["roles"]["role_name"]
        if uid not in role_map:
            role_map[uid] = []
        role_map[uid].append(role_name)

    for u in users:
        u_roles = role_map.get(u["id"], ["USER"])
        # Take the most senior role for simplicity in the list view
        u["role"] = u_roles[0] if u_roles else "USER"

    return users


@router.patch("/users/{wallet}")
async def update_user(
    wallet: str, update: AdminUserUpdate, user=Depends(require_permission("user.promote"))
):
    """
    Update a user's role or active status by wallet address.

    Primarily used to promote users to COMPANY or revoke access.
    Only non-null fields in the request body are applied.
    """
    db = get_supabase()
    changes = {k: v for k, v in update.model_dump().items() if v is not None}
    result = db.table("users").update(changes).eq("wallet_address", wallet).execute()

    # Audit trail
    await _write_staff_audit(
        user.get("sub", ""), "update_user", "user", wallet, changes
    )

    return {"status": "success", "data": result.data}


@router.post("/users/flag")
async def flag_user_action(
    payload: FlagUserAction, user=Depends(require_permission("user.promote"))
):
    """Suspend or warn a user for platform violations."""
    db = get_supabase()
    if payload.action == "suspend":
        db.table("users").update({"is_active": False, "status": "suspended"}).eq(
            "wallet_address", payload.target_wallet
        ).execute()

    await _write_staff_audit(
        user.get("sub", ""),
        payload.action,
        "user",
        payload.target_wallet,
        {"notes": payload.notes},
    )
    return {"status": "success", "action": payload.action}


# -- Dynamic profile schema --


@router.get("/schema")
async def get_admin_schema(user=Depends(require_permission("manage_schema"))):
    """Return all profile schema fields in display order."""
    db = get_supabase()
    return db.table("profile_schema").select("*").order("display_order").execute().data


@router.post("/schema")
async def create_schema_field(
    field: SchemaFieldCreate, user=Depends(require_permission("manage_schema"))
):
    """Add a new field to the dynamic profile schema."""
    db = get_supabase()
    result = db.table("profile_schema").insert(field.model_dump()).execute()
    return {"status": "success", "data": result.data}


@router.patch("/schema/{field_id}")
async def update_schema_field(
    field_id: str,
    field: Dict[str, Any],
    user=Depends(require_permission("manage_schema")),
):
    """Patch a schema field — useful for renaming labels or tightening validation."""
    db = get_supabase()
    result = db.table("profile_schema").update(field).eq("id", field_id).execute()
    return {"status": "success", "data": result.data}


@router.delete("/schema/{field_id}")
async def delete_schema_field(
    field_id: str,
    user=Depends(require_permission("manage_schema")),
):
    """Delete a schema field."""
    db = get_supabase()
    db.table("profile_schema").delete().eq("id", field_id).execute()
    return {"status": "success"}


# -- Skill taxonomy --


@router.get("/skills")
async def get_skill_taxonomy(user=Depends(require_admin)):
    """Return the platform's canonical skill category list."""
    db = get_supabase()
    return db.table("skill_categories").select("*").execute().data


@router.post("/skills")
async def create_skill_category(
    category: Dict[str, Any], user=Depends(require_permission("manage_schema"))
):
    """Append a new skill category to the taxonomy."""
    db = get_supabase()
    result = db.table("skill_categories").insert(category).execute()
    return {"status": "success", "data": result.data}


# -- Feature flags --


@router.get("/features")
async def get_feature_flags(user=Depends(require_admin)):
    """Return all feature flags and their current enabled state."""
    db = get_supabase()
    return db.table("feature_flags").select("*").execute().data


@router.post("/features/update")
async def update_feature_flag(
    feature: FeatureToggleRequest, user=Depends(require_permission("manage_flags"))
):
    """Toggle a named feature flag. Takes effect immediately without a deploy."""
    db = get_supabase()
    result = (
        db.table("feature_flags")
        .update(
            {
                "is_enabled": feature.is_enabled,
                "description": feature.description,
            }
        )
        .eq("feature_name", feature.feature_name)
        .execute()
    )
    return {"status": "success", "data": result.data}


# -- Platform settings --


@router.get("/settings")
async def get_platform_settings(user=Depends(require_admin)):
    """Return all key/value platform configuration entries."""
    db = get_supabase()
    return db.table("platform_settings").select("*").execute().data


@router.post("/settings")
async def update_settings(
    setting: PlatformSettingRequest, user=Depends(require_permission("manage_flags"))
):
    """Update a single platform setting by key."""
    db = get_supabase()
    result = (
        db.table("platform_settings")
        .update(
            {
                "setting_value": setting.setting_value,
            }
        )
        .eq("setting_key", setting.setting_key)
        .execute()
    )
    return {"status": "success", "data": result.data}


# -- Company moderation --


@router.get("/companies")
async def admin_get_companies(user=Depends(require_permission("admin.access"))):
    """List all companies on the platform."""
    db = get_supabase()
    return db.table("companies").select("*").execute().data


@router.delete("/companies/{company_id}")
async def admin_delete_company(
    company_id: str, user=Depends(require_permission("admin.access"))
):
    """Hard-delete a company. This cascades to jobs and applications."""
    db = get_supabase()
    db.table("companies").delete().eq("id", company_id).execute()
    return {"status": "deleted"}


@router.patch("/companies/{company_id}/verify")
async def admin_verify_company(
    company_id: str, user=Depends(require_permission("admin.access"))
):
    """
    Mark a company as verified.

    Verified companies get a badge on their listings and unlock higher job
    visibility in search results. Requires manual admin review before approval.
    """
    db = get_supabase()
    result = (
        db.table("companies").update({"verified": True}).eq("id", company_id).execute()
    )

    await record_event(
        actor_id=user.get("sub", ""),
        actor_role="admin",
        event_type="verified_company",
        description="Verified a company entity",
        entity_type="company",
        entity_id=company_id,
    )

    return {"status": "verified", "data": result.data}


# -- Job & application oversight --


@router.get("/all-jobs")
async def admin_get_all_jobs(user=Depends(require_permission("admin.access"))):
    """Return every job listing across all companies with engagement telemetry."""
    db = get_supabase()
    jobs = db.table("jobs").select("*, companies(name)").execute().data

    if not jobs:
        return []

    # Enrich with application and save counts
    # In a production app, this should be done via a view or an aggregation query
    for job in jobs:
        apps = (
            db.table("applications")
            .select("id", count="exact")
            .eq("job_id", job["id"])
            .execute()
        )
        saves = (
            db.table("saved_jobs")
            .select("id", count="exact")
            .eq("job_id", job["id"])
            .execute()
        )
        job["application_count"] = apps.count or 0
        job["save_count"] = saves.count or 0

    return jobs


@router.delete("/jobs/{job_id}")
async def admin_delete_job(
    job_id: str, user=Depends(require_permission("admin.access"))
):
    """Remove a job listing."""
    db = get_supabase()
    db.table("jobs").delete().eq("id", job_id).execute()
    return {"status": "deleted"}


@router.get("/all-applications")
async def admin_get_all_applications(user=Depends(require_permission("admin.access"))):
    """Return all applications platform-wide with job title and applicant wallet."""
    db = get_supabase()
    return (
        db.table("applications")
        .select("*, jobs(title), users(wallet_address)")
        .execute()
        .data
    )


# -- Skill Verification Review --


@router.get("/skill-flags")
async def get_skill_flags(
    status: Optional[str] = None, user=Depends(require_permission("admin.access"))
):
    """View flagged skill NFTs awaiting review."""
    db = get_supabase()
    query = db.table("skill_verification_flags").select(
        "*, users!candidate_wallet(full_name)"
    )
    if status:
        query = query.eq("status", status)
    return query.execute().data


@router.post("/skill-flags/review/{flag_id}")
async def review_skill_flag(
    flag_id: str,
    payload: SkillFlagReview,
    user=Depends(require_permission("admin.access")),
):
    """Approve or reject a flagged skill verification."""
    db = get_supabase()
    (
        db.table("skill_verification_flags")
        .update(
            {
                "status": payload.status,
                "reviewed_by": user.get("sub", ""),
                "review_notes": payload.review_notes,
                "updated_at": "now()",
            }
        )
        .eq("id", flag_id)
        .execute()
    )

    await _write_staff_audit(
        user.get("sub", ""), f"skill_review_{payload.status}", "skill_flag", flag_id
    )
    return {"status": payload.status}


# -- Support Tickets --


@router.get("/tickets")
async def get_admin_tickets(
    status: Optional[str] = None, user=Depends(require_permission("admin.access"))
):
    """Monitor incoming support tickets across categories."""
    db = get_supabase()
    query = db.table("support_tickets").select("*")
    if status:
        query = query.eq("status", status)
    return query.order("created_at", desc=True).execute().data


@router.patch("/tickets/{ticket_id}")
async def resolve_ticket(
    ticket_id: str,
    payload: SupportTicketUpdate,
    user=Depends(require_permission("admin.access")),
):
    """Update ticket resolution status."""
    db = get_supabase()
    db.table("support_tickets").update(
        {
            "status": payload.status,
            "assigned_to": payload.assigned_to or user.get("sub", ""),
            "resolution_notes": payload.resolution_notes,
            "updated_at": "now()",
        }
    ).eq("id", ticket_id).execute()

    await _write_staff_audit(
        user.get("sub", ""), f"ticket_{payload.status}", "ticket", ticket_id
    )
    return {"status": "success"}


# -- Subscriptions --


@router.get("/subscriptions")
async def get_subscriptions(user=Depends(require_permission("admin.access"))):
    """Get all platform subscriptions."""
    db = get_supabase()
    return db.table("platform_subscriptions").select("*").order("monthly_price").execute().data


@router.patch("/subscriptions/{subscription_id}")
async def update_subscription(
    subscription_id: str,
    payload: Dict[str, Any],
    user=Depends(require_permission("admin.access")),
):
    """Update subscription details."""
    db = get_supabase()
    result = db.table("platform_subscriptions").update(payload).eq("id", subscription_id).execute()
    return {"status": "success", "data": result.data}


# -- Staff Activity Logs --


@router.get("/audit-logs")
async def get_admin_audit_logs(user=Depends(require_permission("admin.access"))):
    """Complete administrative audit trail."""
    db = get_supabase()
    return (
        db.table("staff_audit_logs")
        .select("*, u:users!staff_wallet(full_name)")
        .order("created_at", desc=True)
        .limit(100)
        .execute()
        .data
    )


@router.get("/blockchain/transactions")
async def admin_get_blockchain_transactions(
    user=Depends(require_permission("admin.access")),
):
    """
    Fetch the complete platform-wide transaction ledger.
    Joins sync_status for pending/failed states and nft_records for successful mints.
    """
    db = get_supabase()

    # 1. Fetch Sync Status (Pending/Failed/Synced)
    syncs = (
        db.table("sync_status")
        .select("*, users(wallet_address)")
        .order("updated_at", desc=True)
        .limit(50)
        .execute()
    )

    results = []
    for s in syncs.data or []:
        results.append(
            {
                "id": s.get("id", str(uuid.uuid4())),
                "user_wallet": s.get("users", {}).get("wallet_address", "Unknown"),
                "transaction_hash": s.get("onchain_tx_hash") or "PENDING",
                "transaction_type": s.get("entity_type"),
                "status": s.get("current_state"),
                "timestamp": s.get("updated_at"),
                "explorer_url": f"https://solscan.io/tx/{s.get('onchain_tx_hash')}"
                if s.get("onchain_tx_hash")
                else "#",
            }
        )

    return results


# -- Skill Verification Moderation --

# -- Identity Verification Queue --


class IDVerifyAction(BaseModel):
    user_id: str
    status: str  # verified | rejected
    reason: Optional[str] = None


@router.get("/identity-queue")
async def get_identity_queue(
    status: str = "pending", user=Depends(require_permission("admin.access"))
):
    """List all pending/processed identity verification requests."""
    db = get_supabase()
    return (
        db.table("user_identities")
        .select("*, users(full_name, wallet_address)")
        .eq("id_status", status)
        .order("created_at", desc=True)
        .execute()
        .data
    )


@router.patch("/identity/verify")
async def verify_user_identity(
    action: IDVerifyAction, user=Depends(require_permission("admin.access"))
):
    """Approve or reject a user's identity proof."""
    from modules.users.identity_proof_service import IdentityProofService

    proof_service = IdentityProofService()

    result = await proof_service.verify_identity(
        user_id=action.user_id,
        admin_id=user.get("sub", ""),
        status=action.status,
        reason=action.reason,
    )

    await _write_staff_audit(
        user.get("sub", ""),
        f"identity_{action.status}",
        "user_identity",
        action.user_id,
        {"reason": action.reason},
    )

    return {"status": "success", "data": result}


@router.patch("/verification/{entry_id}/approve")
async def approve_verification(
    entry_id: str, user=Depends(require_permission("admin.access"))
):
    """
    Approve a verification request from the moderation queue.
    Updates the target entity (e.g., skill) as verified.
    """
    db = get_supabase()

    # 1. Fetch moderation entry
    entry = (
        db.table("moderation_queue").select("*").eq("id", entry_id).single().execute()
    )
    if not entry.data:
        raise HTTPException(status_code=404, detail="Moderation entry not found")

    entity_id = entry.data["entity_id"]
    entity_type = entry.data["entity_type"]

    # 2. Update the target entity
    if entity_type == "skill":
        db.table("user_skills").update({"is_verified": True}).eq(
            "id", entity_id
        ).execute()

        # Add to skill_verification_flags for audit
        db.table("skill_verification_flags").insert(
            {
                "user_id": db.table("user_skills")
                .select("user_id")
                .eq("id", entity_id)
                .single()
                .execute()
                .data["user_id"],
                "skill_key": db.table("user_skills")
                .select("skill_name")
                .eq("id", entity_id)
                .single()
                .execute()
                .data["skill_name"],
                "verified_by": user.get("sub", ""),
                "verification_method": "manual_review",
                "is_verified": True,
            }
        ).execute()

    # 3. Mark moderation entry as resolved
    db.table("moderation_queue").update({"status": "approved"}).eq(
        "id", entry_id
    ).execute()

    await record_event(
        actor_id=user.get("sub", ""),
        actor_role="admin",
        event_type="approved_verification",
        description=f"Approved {entity_type} verification",
        entity_type=entity_type,
        entity_id=entity_id,
    )

    return {"status": "success", "message": "Verification approved"}


# -- Community Moderation (Reports) --


@router.get("/reports")
async def admin_get_reports(
    status: Optional[str] = None, user=Depends(require_permission("admin.access"))
):
    """List all community-submitted reports with optional status filtering."""
    db = get_supabase()
    query = (
        db.table("reports")
        .select("*, users!reporter_id(username, id)")
        .order("created_at", desc=True)
    )
    if status:
        query = query.eq("status", status.upper())
    return query.execute().data


@router.patch("/reports/resolve")
async def admin_resolve_report(
    action: ReportResolveAction, user=Depends(require_permission("admin.access"))
):
    """
    Resolve a report and optionally block the target user.
    """
    db = get_supabase()

    # 1. Update report status
    db.table("reports").update(
        {
            "status": action.status,
            "admin_notes": action.admin_notes,
            "resolved_by": user.get("sub", ""),
            "updated_at": "now()",
        }
    ).eq("id", action.report_id).execute()

    # 2. Block user if requested
    if action.block_user:
        # Fetch report to get target
        report = (
            db.table("reports")
            .select("target_id")
            .eq("id", action.report_id)
            .single()
            .execute()
        )
        if report.data and report.data["target_id"]:
            db.table("users").update({"is_active": False}).eq(
                "id", report.data["target_id"]
            ).execute()

            await record_event(
                actor_id=user.get("sub", ""),
                actor_role="admin",
                event_type="user_blocked",
                description=f"Blocked user {report.data['target_id']} via moderation protocol",
                entity_type="user",
                entity_id=report.data["target_id"],
            )

    return {"status": "success", "resolved": True}

@router.post("/seed-platform")
async def seed_platform_data(user=Depends(require_permission("admin.access"))):
    """
    Mass-seeds 110 identities (100 candidates, 10 companies) into the platform.
    Uses the system manifest generated by the seeding script.
    """
    db = get_supabase()
    manifest_path = os.path.join("scripts", "test_accounts.json")
    
    if not os.path.exists(manifest_path):
        raise HTTPException(status_code=404, detail="Seed manifest (test_accounts.json) not found in scripts directory")
        
    try:
        with open(manifest_path, "r") as f:
            manifest = json.load(f)
            
        summary = {"users": 0, "companies": 0, "errors": []}
        
        # 1. Prep Roles IDs
        roles = {}
        r_resp = db.table("roles").select("id, role_name").execute()
        for r in r_resp.data or []:
            roles[r["role_name"]] = r["id"]

        # 2. Seed Companies
        for c in manifest.get("companies", []):
            try:
                uid = str(uuid.uuid4())
                db.table("users").insert({
                    "id": uid,
                    "wallet_address": c["wallet"],
                    "full_name": c["name"],
                    "email": c["email"],
                    "role": "company",
                    "status": "active"
                }).execute()
                
                # Assign internal role
                if "COMPANY" in roles:
                    db.table("user_roles").insert({"user_id": uid, "role_id": roles["COMPANY"]}).execute()
                
                # Create company object
                c_resp = db.table("companies").insert({"name": c["company"], "created_by_user_id": uid}).execute()
                if c_resp.data:
                    comp_id = c_resp.data[0]["id"]
                    db.table("company_members").insert({"company_id": comp_id, "user_id": uid, "company_role": "OWNER"}).execute()
                
                summary["companies"] += 1
                summary["users"] += 1
            except Exception as e:
                summary["errors"].append(f"Company {c['name']} failed: {str(e)}")

        # 3. Seed Candidates
        for u in manifest.get("candidates", []):
            try:
                uid = str(uuid.uuid4())
                db.table("users").insert({
                    "id": uid,
                    "wallet_address": u["wallet"],
                    "full_name": u["name"],
                    "email": u["email"],
                    "role": "talent",
                    "status": "active"
                }).execute()
                
                if "USER" in roles:
                    db.table("user_roles").insert({"user_id": uid, "role_id": roles["USER"]}).execute()
                    
                summary["users"] += 1
            except Exception as e:
                summary["errors"].append(f"User {u['name']} failed: {str(e)}")

        # Audit log
        await _write_staff_audit(user.get("sub", ""), "mass_seed", "platform", "system", summary)
        
        return {"status": "success", "summary": summary}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Seeding failed: {str(e)}")
