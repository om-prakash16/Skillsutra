from portal.core.supabase import get_supabase
from typing import Optional, Dict, Any

class AuthRepository:
    def __init__(self):
        self.db = get_supabase()

    def get_user_by_wallet(self, wallet_address: str) -> Optional[Dict[str, Any]]:
        res = self.db.table("users").select("*").eq("wallet_address", wallet_address).execute()
        return res.data[0] if res.data else None

    def create_user(self, wallet_address: str, email: Optional[str] = None) -> Dict[str, Any]:
        data = {"wallet_address": wallet_address}
        if email:
            data["email"] = email
        res = self.db.table("users").insert(data).execute()
        return res.data[0]

    def get_user_role(self, user_id: str) -> str:
        res = self.db.table("user_roles").select("roles(role_name)").eq("user_id", user_id).execute()
        if res.data:
            return res.data[0]["roles"]["role_name"]
        return "USER"
