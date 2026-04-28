from portal.core.supabase import get_supabase
from typing import Optional, Dict, Any, List

class UserRepository:
    def __init__(self):
        self.db = get_supabase()

    def get_full_profile(self, user_id: str) -> Dict[str, Any]:
        # Aggregate multiple tables
        res_user = self.db.table("users").select("*, profiles(*)").eq("id", user_id).execute()
        user_data = res_user.data[0] if res_user.data else {}
        
        res_skills = self.db.table("user_skills_relational").select("*, skills(name, category)").eq("user_id", user_id).execute()
        res_exp = self.db.table("experiences").select("*").eq("user_id", user_id).order("start_date").execute()
        res_proj = self.db.table("projects").select("*").eq("user_id", user_id).order("start_date").execute()
        res_edu = self.db.table("education").select("*").eq("user_id", user_id).order("start_date").execute()
        res_scores = self.db.table("ai_scores").select("*").eq("user_id", user_id).execute()

        return {
            "user": user_data,
            "skills": res_skills.data,
            "experiences": res_exp.data,
            "projects": res_proj.data,
            "education": res_edu.data,
            "ai_scores": res_scores.data[0] if res_scores.data else {}
        }

    def update_profile(self, user_id: str, data: Dict[str, Any]):
        if "profile" in data:
            self.db.table("profiles").upsert({"user_id": user_id, **data["profile"]}).execute()
        # Add other updates (experiences, etc)
        return True

    def get_by_user_code(self, user_code: str) -> Optional[Dict[str, Any]]:
        res = self.db.table("users").select("id, visibility").eq("user_code", user_code).execute()
        return res.data[0] if res.data else None
