"""
Skill Graph Service — Core business logic for user skill management.
Bridges taxonomy, graph engine, and user skill nodes.
"""

from typing import Dict, Any, List, Optional
from core.supabase import get_supabase
from modules.skill_graph.graph_engine import GraphEngine
from modules.skill_graph.taxonomy_service import TaxonomyService
from modules.skill_graph.ai_extractor import AISkillExtractor


class SkillGraphService:
    """
    Orchestrates all skill graph operations: CRUD, graph queries, AI extraction.
    """

    def __init__(self):
        self.graph = GraphEngine()
        self.taxonomy = TaxonomyService()
        self.extractor = AISkillExtractor()

    def _get_db(self):
        return get_supabase()

    # ── User Skill Nodes CRUD ──

    async def get_user_skill_graph(self, user_id: str) -> Dict[str, Any]:
        """Get a user's complete skill graph with taxonomy info and endorsement counts."""
        db = self._get_db()
        if not db:
            return {"nodes": [], "total": 0}

        res = db.table("user_skill_nodes").select(
            "*, skill_taxonomy(name, slug, category, icon_url)"
        ).eq("user_id", user_id).order("is_primary", desc=True).order("proof_score", desc=True).execute()

        nodes = []
        for row in (res.data or []):
            tax = row.get("skill_taxonomy", {}) or {}
            # Count endorsements
            end_res = db.table("skill_endorsements").select("id", count="exact").eq(
                "user_skill_node_id", row["id"]
            ).execute()
            endorsement_count = end_res.count or 0

            # Get linked projects
            proj_res = db.table("skill_project_links").select(
                "project_id, usage_context, project_ledger(title, github_url)"
            ).eq("user_skill_node_id", row["id"]).execute()

            projects = []
            for p in (proj_res.data or []):
                pl = p.get("project_ledger", {}) or {}
                projects.append({
                    "project_id": p["project_id"],
                    "title": pl.get("title", ""),
                    "github_url": pl.get("github_url"),
                    "usage_context": p.get("usage_context"),
                })

            nodes.append({
                "id": row["id"],
                "skill_id": row["skill_id"],
                "skill_name": tax.get("name", ""),
                "skill_slug": tax.get("slug", ""),
                "skill_category": tax.get("category", ""),
                "icon_url": tax.get("icon_url"),
                "proficiency_level": row["proficiency_level"],
                "proficiency_score": row.get("proficiency_score", 0),
                "proof_score": row.get("proof_score", 0),
                "source": row.get("source", "self_claimed"),
                "ai_confidence": row.get("ai_confidence"),
                "years_experience": row.get("years_experience", 0),
                "is_primary": row.get("is_primary", False),
                "is_verified": row.get("is_verified", False),
                "endorsement_count": endorsement_count,
                "projects": projects,
                "created_at": row.get("created_at"),
            })

        return {"nodes": nodes, "total": len(nodes)}

    async def add_skill(self, user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Add a skill node to a user's graph."""
        db = self._get_db()
        if not db:
            return {"error": "No database"}

        proficiency_map = {"beginner": 20, "intermediate": 50, "advanced": 75, "expert": 95}
        prof_level = data.get("proficiency_level", "intermediate")

        insert_data = {
            "user_id": user_id,
            "skill_id": data["skill_id"],
            "proficiency_level": prof_level,
            "proficiency_score": proficiency_map.get(prof_level, 50),
            "source": data.get("source", "self_claimed"),
            "years_experience": data.get("years_experience", 0),
            "is_primary": data.get("is_primary", False),
            "last_used_at": data.get("last_used_at"),
            "ai_confidence": data.get("ai_confidence"),
        }

        res = db.table("user_skill_nodes").upsert(insert_data, on_conflict="user_id,skill_id").execute()

        # Log usage event
        db.table("skill_usage_events").insert({
            "user_id": user_id,
            "skill_id": data["skill_id"],
            "event_type": "skill_added",
            "event_data": {"source": insert_data["source"], "proficiency": prof_level},
            "proof_delta": 5.0 if insert_data["source"] == "self_claimed" else 15.0,
        }).execute()

        return res.data[0] if res.data else {"status": "created"}

    async def update_skill(self, user_id: str, node_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Update an existing skill node."""
        db = self._get_db()
        if not db:
            return {"error": "No database"}

        update_data = {k: v for k, v in data.items() if v is not None}
        if "proficiency_level" in update_data:
            proficiency_map = {"beginner": 20, "intermediate": 50, "advanced": 75, "expert": 95}
            update_data["proficiency_score"] = proficiency_map.get(update_data["proficiency_level"], 50)

        update_data["updated_at"] = "now()"
        res = db.table("user_skill_nodes").update(update_data).eq("id", node_id).eq("user_id", user_id).execute()
        return res.data[0] if res.data else {"status": "updated"}

    async def remove_skill(self, user_id: str, node_id: str) -> Dict[str, Any]:
        """Remove a skill node."""
        db = self._get_db()
        if not db:
            return {"error": "No database"}

        db.table("user_skill_nodes").delete().eq("id", node_id).eq("user_id", user_id).execute()
        return {"status": "deleted", "id": node_id}

    async def bulk_add_skills(self, user_id: str, skills: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Bulk add/upsert skills to a user's graph."""
        results = []
        for skill_data in skills:
            res = await self.add_skill(user_id, skill_data)
            results.append(res)
        return {"status": "success", "added": len(results)}

    # ── Endorsements ──

    async def endorse_skill(self, endorser_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Endorse another user's skill."""
        db = self._get_db()
        if not db:
            return {"error": "No database"}

        node_id = data["user_skill_node_id"]

        # Don't allow self-endorsement
        node = db.table("user_skill_nodes").select("user_id, skill_id").eq("id", node_id).single().execute()
        if node.data and node.data["user_id"] == endorser_id:
            return {"error": "Cannot endorse your own skill"}

        res = db.table("skill_endorsements").upsert({
            "user_skill_node_id": node_id,
            "endorser_id": endorser_id,
            "endorser_relationship": data.get("relationship", "colleague"),
            "comment": data.get("comment"),
        }, on_conflict="user_skill_node_id,endorser_id").execute()

        # Log event for proof score
        if node.data:
            db.table("skill_usage_events").insert({
                "user_id": node.data["user_id"],
                "skill_id": node.data["skill_id"],
                "event_type": "endorsement_received",
                "event_data": {"endorser_id": endorser_id},
                "proof_delta": 10.0,
            }).execute()

        return res.data[0] if res.data else {"status": "endorsed"}

    # ── AI Extraction ──

    async def extract_skills_from_resume(self, resume_text: str) -> List[Dict[str, Any]]:
        return await self.extractor.extract_from_resume(resume_text)

    async def extract_skills_from_github(self, username: str) -> List[Dict[str, Any]]:
        return await self.extractor.extract_from_github(username)

    async def confirm_extracted_skills(self, user_id: str, confirmed: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Save AI-extracted skills after user confirmation."""
        added = 0
        for skill in confirmed:
            taxonomy_id = skill.get("matched_taxonomy_id")
            if not taxonomy_id:
                continue

            await self.add_skill(user_id, {
                "skill_id": taxonomy_id,
                "proficiency_level": skill.get("proficiency_estimate", "intermediate"),
                "source": "ai_extracted",
                "ai_confidence": skill.get("confidence", 0.5),
            })
            added += 1

        return {"status": "success", "confirmed_count": added}

    async def log_usage_event(self, user_id: str, skill_id: str, event_type: str, proof_delta: float, event_data: Dict[str, Any] = {}) -> Dict[str, Any]:
        """Logs a skill usage event to trigger proof score recalculation."""
        db = self._get_db()
        if not db:
            return {"error": "No database"}
        
        res = db.table("skill_usage_events").insert({
            "user_id": user_id,
            "skill_id": skill_id,
            "event_type": event_type,
            "event_data": event_data,
            "proof_delta": proof_delta,
        }).execute()
        
        return res.data[0] if res.data else {"status": "logged"}
