"""
Skill Graph Engine — Graph traversal, matching, and gap analysis.
Replaces the hardcoded SKILL_GRAPH dict with a database-driven graph.
"""

from typing import Dict, Any, List, Optional, Tuple
from core.supabase import get_supabase


class GraphEngine:
    """
    Database-driven skill graph engine with BFS traversal,
    semantic matching, and gap analysis capabilities.
    """

    def __init__(self):
        self._cache: Dict[str, Dict[str, float]] = {}
        self._taxonomy_cache: Dict[str, str] = {}

    def _get_db(self):
        return get_supabase()

    async def get_adjacency_list(self, skill_id: str) -> Dict[str, float]:
        """Fetch all neighbors for a skill from skill_relationships."""
        if skill_id in self._cache:
            return self._cache[skill_id]

        db = self._get_db()
        if not db:
            return {}

        # Get outgoing edges
        out = db.table("skill_relationships").select(
            "target_skill_id, proximity_weight"
        ).eq("source_skill_id", skill_id).execute()

        # Get incoming bidirectional edges
        inc = db.table("skill_relationships").select(
            "source_skill_id, proximity_weight"
        ).eq("target_skill_id", skill_id).eq("is_bidirectional", True).execute()

        neighbors: Dict[str, float] = {}
        for row in (out.data or []):
            neighbors[row["target_skill_id"]] = row["proximity_weight"]
        for row in (inc.data or []):
            neighbors[row["source_skill_id"]] = row["proximity_weight"]

        self._cache[skill_id] = neighbors
        return neighbors

    async def bfs_traverse(
        self, start_skill_id: str, depth: int = 2, min_proximity: float = 0.4
    ) -> Dict[str, float]:
        """
        BFS traversal from a starting skill up to `depth` hops.
        Returns {skill_id: combined_proximity_score}.
        """
        visited: Dict[str, float] = {start_skill_id: 1.0}
        frontier: List[Tuple[str, float]] = [(start_skill_id, 1.0)]

        for _ in range(depth):
            next_frontier: List[Tuple[str, float]] = []
            for current_id, current_weight in frontier:
                neighbors = await self.get_adjacency_list(current_id)
                for neighbor_id, edge_weight in neighbors.items():
                    combined = current_weight * edge_weight
                    if combined >= min_proximity:
                        if neighbor_id not in visited or visited[neighbor_id] < combined:
                            visited[neighbor_id] = round(combined, 3)
                            next_frontier.append((neighbor_id, combined))
            frontier = next_frontier

        visited.pop(start_skill_id, None)
        return dict(sorted(visited.items(), key=lambda x: x[1], reverse=True))

    async def resolve_skill_id(self, skill_name: str) -> Optional[str]:
        """Resolve a skill name to its taxonomy ID."""
        slug = skill_name.lower().strip().replace(" ", "-").replace(".", "").replace("+", "p")
        db = self._get_db()
        if not db:
            return None

        # Try slug match first
        res = db.table("skill_taxonomy").select("id").eq("slug", slug).execute()
        if res.data:
            return res.data[0]["id"]

        # Try case-insensitive name match
        res = db.table("skill_taxonomy").select("id").ilike("name", skill_name).execute()
        if res.data:
            return res.data[0]["id"]

        return None

    async def resolve_skill_ids(self, skill_names: List[str]) -> Dict[str, str]:
        """Resolve multiple skill names to IDs. Returns {name: id}."""
        result = {}
        for name in skill_names:
            sid = await self.resolve_skill_id(name)
            if sid:
                result[name] = sid
        return result

    async def expand_job_skill_graph(
        self, job_id: Optional[str] = None, skill_names: Optional[List[str]] = None, depth: int = 2
    ) -> Dict[str, Any]:
        """
        Expand a job's required skills into a full semantic graph.
        """
        db = self._get_db()
        required_ids: List[str] = []
        explicit_skills: List[str] = []

        if job_id and db:
            res = db.table("job_skill_requirements").select(
                "skill_id, importance, skill_taxonomy(name)"
            ).eq("job_id", job_id).execute()
            if res.data:
                for row in res.data:
                    required_ids.append(row["skill_id"])
                    tax = row.get("skill_taxonomy")
                    if tax:
                        explicit_skills.append(tax["name"] if isinstance(tax, dict) else str(tax))

        if not required_ids and skill_names:
            mapping = await self.resolve_skill_ids(skill_names)
            required_ids = list(mapping.values())
            explicit_skills = list(mapping.keys())

        expanded_graph: Dict[str, float] = {}
        for sid in required_ids:
            expanded_graph[sid] = 1.0
            related = await self.bfs_traverse(sid, depth=depth)
            for rel_id, prox in related.items():
                if rel_id not in expanded_graph or expanded_graph[rel_id] < prox:
                    expanded_graph[rel_id] = prox

        return {
            "explicit_skill_ids": required_ids,
            "explicit_skills": explicit_skills,
            "expanded_skill_graph": expanded_graph,
            "total_skills_in_graph": len(expanded_graph),
        }

    async def match_candidate_to_job(
        self,
        user_id: str,
        job_id: Optional[str] = None,
        required_skill_names: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        """
        Graph-based candidate ↔ job matching with proof score weighting.
        """
        db = self._get_db()
        if not db:
            return {"match_percentage": 0, "fit_tier": "Unknown", "error": "No database"}

        # Get candidate's skill nodes
        user_nodes = db.table("user_skill_nodes").select(
            "skill_id, proficiency_score, proof_score, is_verified, skill_taxonomy(name)"
        ).eq("user_id", user_id).execute()

        candidate_skill_ids = {}
        for node in (user_nodes.data or []):
            candidate_skill_ids[node["skill_id"]] = {
                "proof": node.get("proof_score", 0),
                "proficiency": node.get("proficiency_score", 0),
                "verified": node.get("is_verified", False),
                "name": node.get("skill_taxonomy", {}).get("name", "") if isinstance(node.get("skill_taxonomy"), dict) else "",
            }

        # Expand job requirements
        job_graph = await self.expand_job_skill_graph(job_id=job_id, skill_names=required_skill_names)
        expanded = job_graph["expanded_skill_graph"]

        if not expanded:
            return {"match_percentage": 0, "fit_tier": "No Requirements", "direct_keyword_matches": [], "missing_critical_skills": []}

        # Calculate match
        direct_matches = []
        graph_matches: Dict[str, float] = {}
        total_weight = sum(expanded.values())
        matched_weight = 0.0

        for sid, prox in expanded.items():
            if sid in candidate_skill_ids:
                info = candidate_skill_ids[sid]
                # Verified skills get 1.3x bonus
                multiplier = 1.3 if info["verified"] else 1.0
                effective = prox * multiplier
                graph_matches[info["name"] or sid] = round(effective, 3)
                matched_weight += effective

                if prox >= 1.0:
                    direct_matches.append(info["name"] or sid)

        match_pct = round((matched_weight / total_weight) * 100, 1) if total_weight else 0
        match_pct = min(100, match_pct)

        # Determine fit tier
        if match_pct >= 85:
            fit_tier = "Exceptional Fit"
        elif match_pct >= 70:
            fit_tier = "Strong Fit"
        elif match_pct >= 50:
            fit_tier = "Moderate Fit"
        else:
            fit_tier = "Weak Fit"

        # Missing skills
        missing = []
        for sid in job_graph["explicit_skill_ids"]:
            if sid not in candidate_skill_ids:
                # resolve name
                tax = db.table("skill_taxonomy").select("name").eq("id", sid).execute()
                name = tax.data[0]["name"] if tax.data else sid
                missing.append(name)

        return {
            "match_percentage": match_pct,
            "fit_tier": fit_tier,
            "direct_keyword_matches": direct_matches,
            "graph_semantic_matches": graph_matches,
            "missing_critical_skills": missing,
            "total_expanded_skills": len(expanded),
            "recommendation": f"Candidate covers {len(graph_matches)}/{len(expanded)} skills in the expanded job graph.",
        }

    async def analyze_skill_gaps(self, user_id: str, job_id: str) -> Dict[str, Any]:
        """
        Identify skill gaps between a user's graph and a job's requirements.
        """
        db = self._get_db()
        if not db:
            return {"gaps": [], "gap_score": 0}

        # Job requirements
        job_reqs = db.table("job_skill_requirements").select(
            "skill_id, importance, min_proficiency, min_years, skill_taxonomy(name, category)"
        ).eq("job_id", job_id).execute()

        # User skill nodes
        user_nodes_res = db.table("user_skill_nodes").select(
            "skill_id, proficiency_level, proficiency_score, proof_score, years_experience"
        ).eq("user_id", user_id).execute()

        user_map = {n["skill_id"]: n for n in (user_nodes_res.data or [])}

        matched = []
        gaps = []
        recommendations = []

        for req in (job_reqs.data or []):
            sid = req["skill_id"]
            tax = req.get("skill_taxonomy", {})
            skill_name = tax.get("name", "") if isinstance(tax, dict) else ""
            importance = req.get("importance", "required")

            if sid in user_map:
                u = user_map[sid]
                matched.append({
                    "skill_name": skill_name,
                    "importance": importance,
                    "user_proficiency": u["proficiency_level"],
                    "required_proficiency": req.get("min_proficiency", "intermediate"),
                    "proof_score": u.get("proof_score", 0),
                })
            else:
                gaps.append({
                    "skill_name": skill_name,
                    "importance": importance,
                    "required_proficiency": req.get("min_proficiency", "intermediate"),
                    "category": tax.get("category", "") if isinstance(tax, dict) else "",
                })
                if importance == "required":
                    recommendations.append(f"Learn {skill_name} — required for this role")
                else:
                    recommendations.append(f"Consider learning {skill_name} — {importance}")

        total = len(job_reqs.data or [])
        gap_score = round((len(gaps) / total * 100), 1) if total else 0

        return {
            "required_skills": [{"skill_name": r.get("skill_taxonomy", {}).get("name", "") if isinstance(r.get("skill_taxonomy"), dict) else "", "importance": r.get("importance")} for r in (job_reqs.data or [])],
            "user_skills": [{"skill_id": s, **d} for s, d in user_map.items()],
            "matched": matched,
            "gaps": gaps,
            "gap_score": gap_score,
            "recommendations": recommendations,
        }

    def clear_cache(self):
        """Clear the adjacency list cache."""
        self._cache.clear()
        self._taxonomy_cache.clear()
