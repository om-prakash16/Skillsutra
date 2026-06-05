from fastapi import APIRouter, Depends

from core.response import success_response
from core.dependencies import get_db, get_current_user_id, get_company_id
from core.redis import get_redis_client
import json
from modules.auth.schemas.models import CompanyCreate, CompanyInvite, ApiKeyCreate
from modules.activity.service import record_event
from modules.companies.enterprise_api_service import EnterpriseApiService

router = APIRouter()
enterprise_api_service = EnterpriseApiService()

@router.get("/profile")
async def get_company_profile(
    user_id: str = Depends(get_current_user_id)
):
    """Fetch the company profile for the authenticated user's company."""
    db = await get_db()
    # Find which company this user belongs to
    member_res = db.table("company_members").select("company_id, company_role").eq("user_id", user_id).execute()
    if not member_res.data:
        return success_response(data=None, message="No company profile found")
    
    company_id = member_res.data[0]["company_id"]
    company_role = member_res.data[0]["company_role"]

    # Try to get from cache first
    cache_key = f"company_profile:{company_id}"
    try:
        client = get_redis_client()
        cached = await client.get(cache_key) if client else None
        if cached:
            company_data = json.loads(cached)
            company_data["my_role"] = company_role
            return success_response(data=company_data)
    except Exception:
        pass

    # Fetch company details
    company_res = db.table("companies").select("*").eq("id", company_id).single().execute()
    
    if not company_res.data:
        return success_response(data=None, message="Company not found")

    company_data = company_res.data
    
    # Save to cache
    try:
        client = get_redis_client()
        if client:
            await client.set(cache_key, json.dumps(company_data), ex=3600)
    except Exception:
        pass
        
    company_data["my_role"] = company_role
    return success_response(data=company_data)

@router.post("/update")
async def update_company_profile(
    data: dict,
    user_id: str = Depends(get_current_user_id)
):
    """Update the company profile for the authenticated user's company."""
    db = await get_db()
    # Find which company this user belongs to
    member_res = db.table("company_members").select("company_id, company_role").eq("user_id", user_id).execute()
    if not member_res.data:
        from core.exceptions import NotFoundError
        raise NotFoundError("No company profile found")
    
    company_id = member_res.data[0]["company_id"]
    company_role = member_res.data[0]["company_role"]

    if company_role not in ["OWNER", "ADMIN"]:
        from core.exceptions import ForbiddenError
        raise ForbiddenError("You do not have permission to update the company profile")

    # Update company details
    update_data = {
        "name": data.get("name"),
        "website": data.get("website"),
        "description": data.get("description"),
        "industry": data.get("industry"),
        "company_size": data.get("company_size"),
        "location": data.get("location"),
        "about_company": data.get("about_company"),
    }
    
    if "branding_profile" in data:
        update_data["branding_profile"] = data["branding_profile"]
    if "company_metadata" in data:
        update_data["company_metadata"] = data["company_metadata"]
        
    # Remove None values
    update_data = {k: v for k, v in update_data.items() if v is not None}
    
    if update_data:
        db.table("companies").update(update_data).eq("id", company_id).execute()
        
        # Invalidate cache
        try:
            client = get_redis_client()
            if client:
                await client.delete(f"company_profile:{company_id}")
        except Exception:
            pass
        
    return success_response(message="Company profile updated")

@router.post("/create")
async def create_company(
    req: CompanyCreate, 
    user_id: str = Depends(get_current_user_id)
):
    """Set up a new company workspace."""
    db = await get_db()
    
    # 1. Create Company
    company_resp = db.table("companies").insert({
        "name": req.name,
        "created_by_user_id": user_id,
    }).execute()

    if not company_resp.data:
        from core.exceptions import ExternalServiceError
        raise ExternalServiceError("Failed to create company workspace")

    company = company_resp.data[0]

    # 2. Add OWNER membership
    db.table("company_members").insert({
        "company_id": company["id"],
        "user_id": user_id,
        "company_role": "OWNER",
    }).execute()

    # 3. Elevate Platform Role
    role_row = db.table("roles").select("id").eq("role_name", "COMPANY").single().execute()
    if role_row.data:
        db.table("user_roles").insert({
            "user_id": user_id,
            "role_id": role_row.data["id"],
        }).execute()

    await record_event(
        actor_id=user_id,
        actor_role="company",
        event_type="created_company",
        description=f"Created company workspace: {req.name}",
        entity_type="company",
        entity_id=company["id"],
    )

    return success_response(data={"company_id": company["id"]}, message="Company workspace created")

@router.post("/invite-member")
async def invite_member(
    req: CompanyInvite,
    user_id: str = Depends(get_current_user_id),
    company_id: str = Depends(get_company_id)
):
    """Invite an existing user by wallet address."""
    db = await get_db()
    
    # Check if target exists
    target = db.table("users").select("id").eq("wallet_address", req.wallet_address).execute()
    if not target.data:
        from core.exceptions import NotFoundError
        raise NotFoundError("User not found with this wallet address")

    result = db.table("company_members").insert({
        "company_id": company_id,
        "user_id": target.data[0]["id"],
        "company_role": req.role,
    }).execute()

    return success_response(data=result.data[0], message="Member invited")

@router.get("/team")
async def get_team(
    company_id: str = Depends(get_company_id)
):
    """Return all members of the company."""
    db = await get_db()
    response = db.table("company_members").select("*, users(wallet_address, full_name)").eq("company_id", company_id).execute()
    return success_response(data=response.data)

@router.get("/api-keys")
async def list_company_api_keys(
    company_id: str = Depends(get_company_id)
):
    """List all API keys for the company."""
    keys = enterprise_api_service.list_api_keys(company_id)
    return success_response(data=keys)

@router.post("/api-keys")
async def create_company_api_key(
    req: ApiKeyCreate,
    user_id: str = Depends(get_current_user_id),
    company_id: str = Depends(get_company_id)
):
    """Generate a new API key."""
    raw_key = enterprise_api_service.generate_api_key(
        company_id=company_id, label=req.label, scopes=req.scopes
    )
    return success_response(data={"api_key": raw_key}, message="API Key generated")
