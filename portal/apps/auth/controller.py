from portal.apps.auth.service import AuthService
from portal.apps.auth.schema import WalletAuthRequest

class AuthController:
    def __init__(self):
        self.service = AuthService()

    async def login_with_wallet(self, request: WalletAuthRequest):
        return await self.service.authenticate_wallet(
            request.wallet_address, 
            request.message, 
            request.signature
        )
