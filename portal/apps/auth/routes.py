from fastapi import APIRouter, Depends
from portal.apps.auth.controller import AuthController
from portal.apps.auth.schema import WalletAuthRequest, AuthResponse

router = APIRouter()
controller = AuthController()

@router.post("/wallet", response_model=AuthResponse)
async def login_wallet(request: WalletAuthRequest):
    return await controller.login_with_wallet(request)
