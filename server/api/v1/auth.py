from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db_session
from schemas.auth import UserCreate, UserLogin, Token, RefreshTokenRequest, UserResponse, OAuthCallback, GoogleAuthRequest
from services.auth_service import AuthService
from services.oauth_service import OAuthService
from modules.auth.core.service import get_current_user
import os

router = APIRouter()

def get_client_ip(request: Request) -> str:
    # Handle proxies if necessary
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0]
    return request.client.host if request.client else "unknown"

def get_device_info(request: Request) -> str:
    return request.headers.get("User-Agent", "unknown")

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db_session)):
    from sqlalchemy import select
    from sqlalchemy.orm import selectinload
    from models.user import User
    
    # current_user from token only has id, role, email. Let's fetch full user for universal apps
    query = select(User).options(selectinload(User.roles)).where(User.id == current_user["id"])
    result = await db.execute(query)
    user = result.scalars().first()
    
    if not user:
        # Fallback to token payload if DB lookup fails (e.g. testing)
        return {"status": "success", "data": current_user}
        
    if not user.username:
        # Auto-generate a username if missing
        from core.username_utils import generate_unique_username
        async def check_exists(candidate: str):
            res = await db.execute(select(User).where(User.username == candidate))
            return res.scalars().first() is not None
            
        base_name = user.email.split("@")[0] if user.email else "user"
        
        # Use the robust unique username generator
        new_username = await generate_unique_username(base_name, check_exists)
        user.username = new_username
        await db.commit()

    # Resolve roles
    roles_list = [r.name for r in user.roles] if user.roles else ["user"]
    primary_role = roles_list[0] if roles_list else "user"

    return {
        "status": "success",
        "data": {
            "id": str(user.id),
            "email": user.email,
            "name": user.username or "User",
            "role": primary_role,
            "roles": roles_list,
            "username": user.username,
        }
    }

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    user_in: UserCreate, 
    db: AsyncSession = Depends(get_db_session)
):
    service = AuthService(db)
    return await service.register_user(user_in)

@router.post("/login", response_model=Token)
async def login(
    login_data: UserLogin, 
    request: Request,
    db: AsyncSession = Depends(get_db_session)
):
    service = AuthService(db)
    ip = get_client_ip(request)
    device = get_device_info(request)
    user, access_token, refresh_token = await service.authenticate_user(login_data, ip, device)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh", response_model=Token)
async def refresh_token(
    data: RefreshTokenRequest,
    request: Request,
    db: AsyncSession = Depends(get_db_session)
):
    service = AuthService(db)
    ip = get_client_ip(request)
    device = get_device_info(request)
    
    new_access, new_refresh = await service.refresh_session(data.refresh_token, ip, device)
    return {
        "access_token": new_access,
        "refresh_token": new_refresh,
        "token_type": "bearer"
    }

@router.post("/logout")
async def logout(
    data: RefreshTokenRequest,
    request: Request,
    db: AsyncSession = Depends(get_db_session)
):
    service = AuthService(db)
    await service.logout(data.refresh_token)
    
    # Extract access token from header
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        access_token = auth_header.split(" ")[1]
        # In a real app, import the blacklist method
        from modules.auth.core.service import AuthService as CoreAuthService
        await CoreAuthService.blacklist_token(access_token, expires_in=3600)
        
    return {"message": "Logged out successfully"}

@router.get("/ws-ticket")
async def get_ws_ticket(
    current_user: dict = Depends(get_current_user)
):
    """
    Zero-Trust WebSockets: 
    Instead of sending JWTs over WSS, we generate a short-lived (10s) 
    single-use ticket in Redis that the client uses to establish the WS connection.
    """
    import uuid
    from core.redis import get_redis_client
    
    ticket = str(uuid.uuid4())
    redis_client = get_redis_client()
    
    # Store the user_id in Redis with a 15 second expiration
    user_id = current_user.get("id") or current_user.get("sub")
    await redis_client.setex(f"ws_ticket:{ticket}", 15, user_id)
    
    return {"status": "success", "ticket": ticket}

from schemas.recovery import ForgotPasswordRequest, ResetPasswordRequest

@router.post("/forgot-password")
async def forgot_password(
    data: ForgotPasswordRequest,
    db: AsyncSession = Depends(get_db_session)
):
    service = AuthService(db)
    # Always return success to prevent email enumeration
    await service.forgot_password(data.email)
    return {"message": "If an account exists with that email, a password reset link has been sent."}

@router.get("/validate-reset-token")
async def validate_reset_token(
    token: str,
    db: AsyncSession = Depends(get_db_session)
):
    service = AuthService(db)
    is_valid = await service.validate_reset_token(token)
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    return {"status": "success", "message": "Token is valid"}

@router.post("/reset-password")
async def reset_password(
    data: ResetPasswordRequest,
    db: AsyncSession = Depends(get_db_session)
):
    service = AuthService(db)
    await service.reset_password(data.token, data.new_password)
    return {"status": "success", "message": "Password has been successfully reset. Please log in with your new password."}

from schemas.auth import MagicLinkRequest, MagicLinkVerify

@router.post("/magic-link")
async def magic_link(
    data: MagicLinkRequest,
    request: Request,
    db: AsyncSession = Depends(get_db_session)
):
    service = AuthService(db)
    await service.send_magic_link(data.email, request)
    return {"message": "If an account exists with that email, a magic link has been sent."}

@router.post("/verify-magic", response_model=Token)
async def verify_magic(
    data: MagicLinkVerify,
    request: Request,
    db: AsyncSession = Depends(get_db_session)
):
    service = AuthService(db)
    ip = get_client_ip(request)
    device = get_device_info(request)
    user, access_token, refresh_token = await service.verify_magic_link(data.token, ip, device)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

# --- OAuth Routes ---

@router.post("/google", response_model=Token)
async def google_auth(
    data: GoogleAuthRequest,
    request: Request,
    db: AsyncSession = Depends(get_db_session)
):
    service = OAuthService(db)
    user, access, refresh = await service.handle_google_id_token(
        id_token=data.id_token,
        ip_address=request.client.host if request.client else "unknown",
        device_info=request.headers.get("User-Agent", "unknown"),
        role=data.role
    )
    return {
        "access_token": access,
        "refresh_token": refresh,
        "token_type": "bearer"
    }

@router.get("/oauth/github/url")
async def get_github_auth_url():
    client_id = os.getenv("GITHUB_CLIENT_ID", "YOUR_GITHUB_CLIENT_ID")
    redirect_uri = os.getenv("FRONTEND_URL", "http://localhost:3000") + "/api/auth/callback/github"
    url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={client_id}&redirect_uri={redirect_uri}&scope=user:email"
    )
    return {"url": url}

@router.post("/oauth/github/callback", response_model=Token)
async def github_callback(
    data: OAuthCallback,
    request: Request,
    db: AsyncSession = Depends(get_db_session)
):
    service = OAuthService(db)
    ip = get_client_ip(request)
    device = get_device_info(request)
    
    user, access, refresh = await service.handle_github_callback(data.code, ip, device)
    return {
        "access_token": access,
        "refresh_token": refresh,
        "token_type": "bearer"
    }
