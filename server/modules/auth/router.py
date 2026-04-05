from fastapi import APIRouter, HTTPException, Depends
from modules.auth.service import verify_solana_signature, create_access_token, get_current_user
from modules.auth.models import WalletLoginRequest, AuthTokenResponse
from core.supabase import get_supabase

router = APIRouter()

@router.post("/wallet-login", response_model=AuthTokenResponse)
async def wallet_login(req: WalletLoginRequest):
    """
    Entry point for Solana Wallet based authentication.
    """
    # 1. Verify Solana Sig
    is_valid = await verify_solana_signature(req.wallet_address, req.message, req.signature)
    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid Solana signature")

    # 2. Get or Create User
    db = get_supabase()
    if not db:
        raise HTTPException(status_code=500, detail="Database connection failed")

    # Fetch User
    response = db.table("users").select("*").eq("wallet_address", req.wallet_address).execute()
    user = None
    if response.data:
        user = response.data[0]
    else:
        # Create User
        create_resp = db.table("users").insert({"wallet_address": req.wallet_address}).execute()
        if not create_resp.data:
            raise HTTPException(status_code=500, detail="Failed to create user record")
        user = create_resp.data[0]
        
        # Assign default USER role
        role_resp = db.table("roles").select("id").eq("role_name", "USER").single().execute()
        if role_resp.data:
            db.table("user_roles").insert({"user_id": user["id"], "role_id": role_resp.data["id"]}).execute()

    # 3. Create Session JWT
    # Fetch roles for the JWT
    roles_resp = db.table("user_roles").select("roles(role_name)").eq("user_id", user["id"]).execute()
    roles = [r["roles"]["role_name"] for r in roles_resp.data] if roles_resp.data else ["USER"]

    access_token = create_access_token(data={"sub": user["id"], "wallet": user["wallet_address"], "roles": roles})
    
    return AuthTokenResponse(access_token=access_token, role=roles[0])

@router.get("/me")
async def get_me(user_payload = Depends(get_supabase)):
    """
    Returns current active session data.
    """
    return user_payload
