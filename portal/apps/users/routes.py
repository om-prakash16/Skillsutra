from fastapi import APIRouter, Depends
from portal.apps.users.controller import UserController
from portal.core.security import get_current_user

router = APIRouter()
controller = UserController()

@router.get("/me")
async def get_me(user=Depends(get_current_user)):
    return await controller.get_my_profile(user["sub"])

@router.get("/portfolio/{user_code}")
async def get_portfolio(user_code: str):
    return await controller.get_portfolio(user_code)

@router.post("/update")
async def update_me(data: dict, user=Depends(get_current_user)):
    return await controller.update_profile(user["sub"], data)
