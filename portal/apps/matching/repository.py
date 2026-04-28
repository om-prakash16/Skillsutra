from portal.core.supabase import get_supabase
from typing import List, Dict, Any

class MatchingRepository:
    def __init__(self):
        self.db = get_supabase()

    def get_active_jobs(self, limit: int = 100) -> List[Dict[str, Any]]:
        res = self.db.table("jobs").select("*").eq("status", "open").limit(limit).execute()
        return res.data

    def get_candidate_profile(self, user_id: str) -> Dict[str, Any]:
        from portal.apps.users.repository import UserRepository
        repo = UserRepository()
        return repo.get_full_profile(user_id)

    def get_all_candidates(self, limit: int = 100) -> List[Dict[str, Any]]:
        res = self.db.table("users").select("*, profile_data:profiles(*)").limit(limit).execute()
        # Flat format for service
        return [{**c, "profile_data": c["profile_data"][0] if c["profile_data"] else {}} for c in res.data]
