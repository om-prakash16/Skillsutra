from typing import List, Dict, Any, Optional
from uuid import UUID
from core.supabase import get_supabase
from modules.notifications.core.service import NotificationService

class CompetitionService:
    @staticmethod
    async def create_competition(data: Dict[str, Any], user_id: UUID) -> Dict[str, Any]:
        db = get_supabase()
        if not db:
            raise Exception("Database service unavailable")

        insert_data = {
            "title": data.get("title"),
            "description": data.get("description"),
            "comp_type": data.get("comp_type"),
            "skills_required": data.get("skills_required", []),
            "deadline": data.get("deadline"),
            "url": data.get("url"),
            "created_by": str(user_id)
        }

        response = db.table("competitions").insert(insert_data).execute()
        comp = response.data[0] if response.data else {}

        if comp:
            # Optionally trigger background matching task here
            pass

        return comp

    @staticmethod
    async def get_competitions() -> List[Dict[str, Any]]:
        db = get_supabase()
        if not db:
            return []

        response = db.table("competitions").select("*").order("created_at", desc=True).execute()
        return response.data if response.data else []

    @staticmethod
    async def update_preferences(user_id: UUID, data: Dict[str, Any]) -> Dict[str, Any]:
        db = get_supabase()
        if not db:
            raise Exception("Database service unavailable")

        response = (
            db.table("user_competition_preferences")
            .upsert(
                {
                    "user_id": str(user_id),
                    "interested_types": data.get("interested_types", []),
                    "preferred_skills": data.get("preferred_skills", []),
                    "receive_notifications": data.get("receive_notifications", True)
                },
                on_conflict="user_id"
            )
            .execute()
        )
        return response.data[0] if response.data else {}

    @staticmethod
    async def get_preferences(user_id: UUID) -> Dict[str, Any]:
        db = get_supabase()
        if not db:
            return {}

        response = db.table("user_competition_preferences").select("*").eq("user_id", str(user_id)).single().execute()
        return response.data if response.data else {}

    @staticmethod
    async def notify_matches(competition_id: UUID) -> Dict[str, Any]:
        """
        Finds users whose preferences match the competition and sends them a notification.
        """
        db = get_supabase()
        if not db:
            raise Exception("Database service unavailable")

        # 1. Fetch competition details
        comp_resp = db.table("competitions").select("*").eq("id", str(competition_id)).single().execute()
        comp = comp_resp.data
        if not comp:
            raise Exception("Competition not found")

        # 2. Fetch users who want notifications
        prefs_resp = db.table("user_competition_preferences").select("user_id, interested_types, preferred_skills").eq("receive_notifications", True).execute()
        prefs = prefs_resp.data if prefs_resp.data else []

        notified_count = 0
        comp_type = comp.get("comp_type")
        comp_skills = set(comp.get("skills_required", []))

        for pref in prefs:
            user_id = pref["user_id"]
            interested_types = pref.get("interested_types", [])
            preferred_skills = set(pref.get("preferred_skills", []))

            # Match logic: if type matches or if there's any skill intersection
            match = False
            if comp_type in interested_types:
                match = True
            elif comp_skills and preferred_skills and comp_skills.intersection(preferred_skills):
                match = True
            
            # Additional logic: if interested_types is empty, assume open to all
            if not interested_types and not preferred_skills:
                 match = True

            if match:
                await NotificationService.create_event_notification(
                    user_id=user_id,
                    type="competition_match",
                    title=f"New {comp_type.capitalize()} Match!",
                    message=f"Check out {comp.get('title')}, it aligns with your interests.",
                    link=f"/competitions"
                )
                notified_count += 1

        return {"notified_count": notified_count}

    @staticmethod
    async def save_competition(user_id: UUID, comp_id: UUID) -> Dict[str, Any]:
        db = get_supabase()
        if not db:
            raise Exception("Database unavailable")
        
        # Check if already saved
        existing = db.table("saved_competitions").select("*").eq("user_id", str(user_id)).eq("competition_id", str(comp_id)).execute()
        if existing.data:
            # Unsave (toggle)
            db.table("saved_competitions").delete().eq("user_id", str(user_id)).eq("competition_id", str(comp_id)).execute()
            return {"saved": False}
        else:
            db.table("saved_competitions").insert({"user_id": str(user_id), "competition_id": str(comp_id)}).execute()
            return {"saved": True}

    @staticmethod
    async def get_saved_competitions(user_id: UUID) -> List[Dict[str, Any]]:
        db = get_supabase()
        if not db:
            return []
        res = db.table("saved_competitions").select("*, competitions(*)").eq("user_id", str(user_id)).execute()
        return [item["competitions"] for item in res.data if item.get("competitions")] if res.data else []

    @staticmethod
    async def create_team(user_id: UUID, comp_id: UUID, name: str) -> Dict[str, Any]:
        db = get_supabase()
        if not db:
            raise Exception("Database unavailable")
        
        # Create team
        team_resp = db.table("teams").insert({
            "name": name,
            "competition_id": str(comp_id),
            "leader_id": str(user_id)
        }).execute()
        
        if not team_resp.data:
            raise Exception("Failed to create team or team name already exists")
            
        team = team_resp.data[0]
        # Auto join leader as ACCEPTED OWNER
        db.table("team_members").insert({
            "team_id": team["id"],
            "user_id": str(user_id),
            "role": "Team Leader",
            "status": "accepted"
        }).execute()
        
        return team

    @staticmethod
    async def join_team(user_id: UUID, team_id: UUID, role: str) -> Dict[str, Any]:
        db = get_supabase()
        if not db:
            raise Exception("Database unavailable")
            
        res = db.table("team_members").insert({
            "team_id": str(team_id),
            "user_id": str(user_id),
            "role": role,
            "status": "pending"
        }).execute()
        
        if res.data:
            # Notify team leader
            team_info = db.table("teams").select("*, users!leader_id(id)").eq("id", str(team_id)).single().execute()
            if team_info.data:
                leader_id = team_info.data["leader_id"]
                await NotificationService.create_event_notification(
                    user_id=leader_id,
                    type="team_join_request",
                    title="New Join Request",
                    message=f"A developer requested to join your team '{team_info.data['name']}'.",
                    link=f"/competitions/teams"
                )
            return res.data[0]
        return {}

    @staticmethod
    async def invite_member(leader_id: UUID, team_id: UUID, invitee_id: UUID, role: str) -> Dict[str, Any]:
        db = get_supabase()
        if not db:
            raise Exception("Database unavailable")
            
        # Verify leader_id is actually the leader
        team_check = db.table("teams").select("leader_id").eq("id", str(team_id)).single().execute()
        if not team_check.data or team_check.data["leader_id"] != str(leader_id):
            raise Exception("Unauthorized: Only the team leader can invite members.")
            
        res = db.table("team_members").insert({
            "team_id": str(team_id),
            "user_id": str(invitee_id),
            "role": role,
            "status": "pending"
        }).execute()
        
        if res.data:
            await NotificationService.create_event_notification(
                user_id=invitee_id,
                type="team_invite",
                title="Hackathon Team Invitation",
                message="You have been invited to join a hackathon team.",
                link="/competitions/teams"
            )
            return res.data[0]
        return {}

    @staticmethod
    async def get_teams(comp_id: UUID) -> List[Dict[str, Any]]:
        db = get_supabase()
        if not db:
            return []
        # Fetch teams and join leader full_name
        res = db.table("teams").select("*, leader:users!leader_id(full_name, user_code)").eq("competition_id", str(comp_id)).execute()
        teams = res.data or []
        for team in teams:
            # fetch members
            m_res = db.table("team_members").select("*, users(full_name, user_code)").eq("team_id", team["id"]).execute()
            team["members"] = m_res.data or []
        return teams

    @staticmethod
    async def get_my_teams(user_id: UUID) -> List[Dict[str, Any]]:
        db = get_supabase()
        if not db:
            return []
        
        # Teams user is in
        member_res = db.table("team_members").select("team_id").eq("user_id", str(user_id)).execute()
        if not member_res.data:
            return []
            
        team_ids = [m["team_id"] for m in member_res.data]
        res = db.table("teams").select("*, competitions(title), leader:users!leader_id(full_name)").in_("id", team_ids).execute()
        
        teams = res.data or []
        for team in teams:
            m_res = db.table("team_members").select("*, users(full_name, user_code)").eq("team_id", team["id"]).execute()
            team["members"] = m_res.data or []
        return teams

    @staticmethod
    async def approve_member(leader_id: UUID, team_id: UUID, member_id: UUID, approve: bool) -> bool:
        db = get_supabase()
        if not db:
            return False
            
        team_check = db.table("teams").select("leader_id, name").eq("id", str(team_id)).single().execute()
        if not team_check.data or team_check.data["leader_id"] != str(leader_id):
            return False
            
        if approve:
            db.table("team_members").update({"status": "accepted"}).eq("team_id", str(team_id)).eq("user_id", str(member_id)).execute()
            await NotificationService.create_event_notification(
                user_id=member_id,
                type="team_request_accepted",
                title="Request Approved",
                message=f"You have been accepted into the team '{team_check.data['name']}'.",
                link="/competitions/teams"
            )
        else:
            db.table("team_members").delete().eq("team_id", str(team_id)).eq("user_id", str(member_id)).execute()
            
        return True

