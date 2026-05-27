from fastapi import APIRouter, Depends
from typing import Optional
import uuid
import logging

from core.response import success_response
from core.exceptions import AuthorizationError, ExternalServiceError
from modules.auth.core.service import get_current_user, AuthService
from modules.auth.schemas.models import UserSyncRequest, RoleAssignRequest

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/sync")
async def sync_user(
    req: Optional[UserSyncRequest] = None,
    user=Depends(get_current_user),
):
    """
    Sync a Keycloak-authenticated user into the local PostgreSQL users table.
    Called by the frontend after every successful Keycloak login.
    Creates the user record if it doesn't exist, updates if it does.
    """
    from core.db import get_db
    db = get_db()
    if not db:
        raise ExternalServiceError("Database unavailable")

    keycloak_id = user.get("sub") or user.get("id")
    email = user.get("email", "")
    name = user.get("name") or user.get("preferred_username") or email.split("@")[0] or "User"
    roles = user.get("roles", ["user"])
    requested_role = req.requested_role if req else None

    # Check if user already exists by keycloak_id
    existing = await db.table("users").select("*").eq("keycloak_id", keycloak_id).execute()

    if existing.data:
        db_user = existing.data[0]
        # Update name/email if changed
        await db.table("users").update({
            "full_name": name,
            "email": email,
        }).eq("keycloak_id", keycloak_id).execute()
    else:
        # Also check by email for pre-existing records
        email_check = await db.table("users").select("*").eq("email", email).execute()
        
        if email_check.data:
            db_user = email_check.data[0]
            # Link existing user to keycloak
            await db.table("users").update({
                "keycloak_id": keycloak_id,
                "full_name": name,
            }).eq("id", str(db_user["id"])).execute()
        else:
            # Create new user
            uid = str(uuid.uuid4())
            try:
                created = await db.table("users").insert({
                    "id": uid,
                    "keycloak_id": keycloak_id,
                    "email": email,
                    "full_name": name,
                    "auth_provider": "keycloak",
                    "profile_data": {"skills": [], "proof_score": 0},
                }).execute()
                if not created.data:
                    raise ExternalServiceError("Failed to create user record")
                db_user = created.data[0]
            except Exception as e:
                logger.error(f"User creation failed: {e}")
                raise ExternalServiceError("User registration failed")

    # Assign requested role in Keycloak if specified
    if requested_role and requested_role not in roles:
        success = await AuthService.assign_realm_role(keycloak_id, requested_role)
        if success:
            roles.append(requested_role)

    # Sync roles to local user_roles table
    try:
        for role_name in roles:
            role_row = await db.table("roles").select("id").eq("role_name", role_name.upper()).execute()
            if role_row.data:
                # Upsert to avoid duplicate errors
                await db.table("user_roles").upsert({
                    "user_id": str(db_user["id"]),
                    "role_id": role_row.data[0]["id"],
                }, on_conflict="user_id, role_id").execute()
    except Exception as e:
        logger.warning(f"Role sync failed (non-fatal): {e}")

    data = {
        "user_id": str(db_user["id"]),
        "keycloak_id": keycloak_id,
        "email": email,
        "name": name,
        "roles": roles,
        "user_code": db_user.get("user_code"),
    }
    return success_response(data=data, message="User synced successfully")


@router.get("/me")
async def get_me(user=Depends(get_current_user)):
    """Return the current user's session data from Keycloak JWT."""
    from core.db import get_db
    db = get_db()
    
    keycloak_id = user.get("sub") or user.get("id")
    
    # Enrich with local DB data
    if db:
        try:
            local_user = await db.table("users").select("*").eq("keycloak_id", keycloak_id).single().execute()
            if local_user.data:
                user["local_id"] = str(local_user.data["id"])
                user["user_code"] = local_user.data.get("user_code")
                user["profile_data"] = local_user.data.get("profile_data", {})
                user["dynamic_profile_data"] = local_user.data.get("dynamic_profile_data", {})
                user["wallet_address"] = local_user.data.get("wallet_address", "")
        except Exception as e:
            logger.warning(f"Failed to enrich user data: {e}")
    
    return success_response(data=user)


@router.post("/assign-role")
async def assign_role(req: RoleAssignRequest, user=Depends(get_current_user)):
    """
    Admin-only: Assign a realm role to a user in Keycloak.
    """
    # Check caller is admin
    caller_roles = [r.lower() for r in user.get("roles", [])]
    if "admin" not in caller_roles and "super_admin" not in caller_roles:
        raise AuthorizationError("Admin access required to assign roles")
    
    success = await AuthService.assign_realm_role(req.user_id, req.role)
    if not success:
        raise ExternalServiceError("Failed to assign role in Keycloak")
    
    return success_response(message=f"Role '{req.role}' assigned successfully")
