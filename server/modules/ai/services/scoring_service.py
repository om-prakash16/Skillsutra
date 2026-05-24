from typing import Dict, Any, Optional


class ProofScoreService:
    weights = {"skill_score": 0.4, "github_score": 0.3, "project_score": 0.3}

    def __init__(self):
        self.weights = ProofScoreService.weights

    @classmethod
    async def calculate_proof_score(cls, arg: Any, profile_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Calculates the aggregate Proof Score from multiple signals or by user ID.
        """
        from core.db import get_db
        
        if isinstance(arg, str):
            user_id = arg
            if not profile_data:
                from modules.users.core.service import UserService
                profile_data = await UserService.get_full_profile(user_id)
            
            # Simple scoring heuristics based on profile data
            skills = profile_data.get("skills", [])
            skill_score = min(len(skills) * 8.0, 100.0)
            
            projects = profile_data.get("projects", [])
            project_score = min(len(projects) * 20.0, 100.0)
            
            experience = profile_data.get("experiences", [])
            experience_score = min(len(experience) * 15.0, 100.0)
            
            # Aggregate score
            final_score = (0.4 * skill_score) + (0.3 * 50.0) + (0.3 * project_score)
            final_score = round(final_score, 2)
            
            # Determine level
            level = "Junior"
            if final_score >= 90: level = "Platinum"
            elif final_score >= 80: level = "Gold"
            elif final_score >= 70: level = "Silver"
            elif final_score >= 50: level = "Bronze"
            
            # Persist score
            db = get_db()
            if db:
                await db.table("ai_scores").upsert({
                    "user_id": user_id,
                    "skill_score": skill_score,
                    "project_score": project_score,
                    "experience_score": experience_score,
                    "proof_score": final_score,
                }, on_conflict="user_id").execute()
            
            return {
                "total_score": final_score,
                "breakdown": {
                    "skill_contribution": skill_score * 0.4,
                    "github_contribution": 50.0 * 0.3,
                    "project_contribution": project_score * 0.3,
                },
                "level": level,
            }
        else:
            scores = arg
            final_score = 0
            for key, weight in cls.weights.items():
                final_score += scores.get(key, 0) * weight

            final_score = round(final_score, 2)

            level = "Junior"
            if final_score >= 90: level = "Platinum"
            elif final_score >= 80: level = "Gold"
            elif final_score >= 70: level = "Silver"
            elif final_score >= 50: level = "Bronze"

            return {
                "total_score": final_score,
                "breakdown": {
                    "skill_contribution": scores.get("skill_score", 0) * cls.weights["skill_score"],
                    "github_contribution": scores.get("github_score", 0) * cls.weights["github_score"],
                    "project_contribution": scores.get("project_score", 0) * cls.weights["project_score"],
                },
                "level": level,
                "weights_used": cls.weights,
            }


scoring_service = ProofScoreService()
