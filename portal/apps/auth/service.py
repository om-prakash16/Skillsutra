from portal.apps.auth.repository import AuthRepository
from portal.core.security import create_access_token
from portal.integrations.solana.service import verify_solana_signature
from fastapi import HTTPException

class AuthService:
    def __init__(self):
        self.repository = AuthRepository()

    async def authenticate_wallet(self, wallet_address: str, message: str, signature: str):
        is_valid = await verify_solana_signature(wallet_address, message, signature)
        if not is_valid:
            raise HTTPException(status_code=401, detail="Invalid signature")

        user = self.repository.get_user_by_wallet(wallet_address)
        if not user:
            user = self.repository.create_user(wallet_address)

        role = self.repository.get_user_role(user["id"])
        
        token = create_access_token(data={"sub": user["id"], "role": role})
        
        return {
            "access_token": token,
            "user_id": user["id"],
            "role": role
        }
