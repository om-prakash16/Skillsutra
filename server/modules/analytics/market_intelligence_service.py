from typing import Dict, Any
from datetime import datetime
from core.db import get_db

class MarketIntelligenceService:
    """
    Market Intelligence Engine.
    Analyzes supply (Candidate Skills) vs. Demand (Job Requirements).
    """

    def __init__(self):
        pass

    async def get_market_heatmap_data(self) -> Dict[str, Any]:
        """
        Aggregate live demand and supply data for the platform Heatmap.
        """
        db = get_db()
        if not db:
            raise Exception("Database unavailable")

        # 1. Aggregate Demand (Job Requirements)
        jobs_resp = db.table("jobs").select("skills_required").execute()
        demand_map = {}
        for job in jobs_resp.data or []:
            for skill in job.get("skills_required", []):
                s_lower = skill.lower()
                demand_map[s_lower] = demand_map.get(s_lower, 0) + 1

        # 2. Aggregate Supply (User Skills)
        # Using a count from user_skills table directly
        supply_resp = db.table("user_skills").select("skill_name").execute()
        supply_map = {}
        for us in supply_resp.data or []:
            s_lower = us["skill_name"].lower()
            supply_map[s_lower] = supply_map.get(s_lower, 0) + 1

        # 3. Calculate Opportunity Indices
        all_skills = set(demand_map.keys()) | set(supply_map.keys())
        heatmap_points = []

        for skill in all_skills:
            demand = demand_map.get(skill, 0)
            supply = supply_map.get(skill, 0)

            # Opportunity Index (Demand relative to supply)
            # A higher score means more opportunity (less competition for candidates)
            opportunity_index = round(demand / (supply + 0.1), 2)

            heatmap_points.append(
                {
                    "skill": skill,
                    "demand": demand,
                    "supply": supply,
                    "opportunity_index": opportunity_index,
                    "saturation": "High"
                    if supply > demand * 2
                    else "Low"
                    if demand > supply
                    else "Balanced",
                }
            )

        # Sort by opportunity most to least
        heatmap_points = sorted(
            heatmap_points, key=lambda x: x["opportunity_index"], reverse=True
        )

        return {
            "timestamp": datetime.now().isoformat(),
            "heatmap": heatmap_points[:20],  # Top 20 skills for visualization
            "summary": {
                "total_unique_skills": len(all_skills),
                "hottest_skill": heatmap_points[0]["skill"]
                if heatmap_points
                else "N/A",
            },
        }

    async def get_future_predictions(
        self, current_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Use local rule-based heuristic to predict future skill trends based on current platform heatmap.
        """
        heatmap = current_data.get("heatmap", [])
        breakout_skills = []
        saturated = "N/A"
        
        # Determine breakout (high demand, low supply)
        for h in heatmap:
            if h["saturation"] == "Low":
                breakout_skills.append(h["skill"].title())
            if len(breakout_skills) == 3:
                break
                
        # Determine saturated
        for h in reversed(heatmap):
            if h["saturation"] == "High":
                saturated = h["skill"].title()
                break
                
        if not breakout_skills:
            breakout_skills = ["Python", "React", "Cloud Computing"]
        if saturated == "N/A":
            saturated = "General Data Entry"

        return {
            "breakout_skills": breakout_skills,
            "saturated_domain": saturated,
            "predictions_summary": f"Strong demand predicted for {', '.join(breakout_skills)}, while {saturated} remains highly saturated.",
        }
