from typing import List, Dict, Any
from modules.ai.models import AIAnalysisResponse, SkillGapResponse, AIScoreResponse
from core.db import get_db

class EvaluationService:
    def __init__(self):
        pass

    async def analyze_resume(self, profile_data: Dict[str, Any]) -> AIAnalysisResponse:
        """
        Resume Analysis based on local rule sets.
        Extracts strengths, gaps, and recommendations from structured profile data.
        """
        skills = profile_data.get("skills", [])
        strengths = skills[:3] if skills else ["General Professional Experience"]
        
        missing_skills = []
        if "docker" not in [s.lower() for s in skills]:
            missing_skills.append("Docker")
        if "cloud" not in [s.lower() for s in skills] and "aws" not in [s.lower() for s in skills]:
            missing_skills.append("Cloud Computing (AWS/GCP)")
            
        recommendations = ["Build a complete end-to-end project"]
        if missing_skills:
            recommendations.append(f"Focus on learning {missing_skills[0]} to improve your backend infrastructure knowledge.")

        return AIAnalysisResponse(
            strengths=strengths,
            missing_skills=missing_skills,
            recommendations=recommendations,
        )

    async def calculate_skill_score(self, skills: List[str]) -> float:
        """
        Skill Score Calculation (0-100).
        """
        if not skills:
            return 0.0
        score = min(len(skills) * 8, 100)
        return float(score)

    async def calculate_proof_score(
        self, user_id: str, profile_data: Dict[str, Any]
    ) -> AIScoreResponse:
        """
        Proof Score.
        Formula: 0.4 * skill_score + 0.3 * project_score + 0.3 * experience_score.
        """
        skill_score = await self.calculate_skill_score(profile_data.get("skills", []))

        projects = profile_data.get("projects", [])
        project_score = min(len(projects) * 20, 100) if projects else 0.0

        experience = profile_data.get("experience", [])
        experience_score = min(len(experience) * 15, 100) if experience else 0.0

        proof_score = (
            (0.4 * skill_score) + (0.3 * project_score) + (0.3 * experience_score)
        )
        proof_score = round(proof_score, 2)

        db = get_db()
        if db:
            db.table("ai_scores").upsert(
                {
                    "user_id": user_id,
                    "skill_score": skill_score,
                    "project_score": project_score,
                    "experience_score": experience_score,
                    "proof_score": proof_score,
                    "updated_at": "now()",
                }
            ).execute()

            db.table("ai_score_history").insert(
                {
                    "user_id": user_id,
                    "skill_score": skill_score,
                    "project_score": project_score,
                    "experience_score": experience_score,
                    "proof_score": proof_score,
                }
            ).execute()

        return AIScoreResponse(
            user_id=user_id,
            skill_score=skill_score,
            project_score=project_score,
            experience_score=experience_score,
            proof_score=proof_score,
        )

    async def skill_gap_analysis(
        self, profile_data: Dict[str, Any], target_role: str
    ) -> SkillGapResponse:
        """
        Skill Gap Analysis via local mappings.
        """
        role_lower = target_role.lower()
        required_skills = ["Communication"]
        if "data" in role_lower:
            required_skills = ["Python", "SQL", "Statistics"]
        elif "frontend" in role_lower:
            required_skills = ["React", "CSS", "JavaScript"]
        elif "backend" in role_lower:
            required_skills = ["Python", "Docker", "Database Design"]
            
        current_skills = [s.lower() for s in profile_data.get("skills", [])]
        missing = [s for s in required_skills if s.lower() not in current_skills]
        
        roadmap = [f"Complete a short tutorial on {s}" for s in missing]
        if not roadmap:
            roadmap = ["Apply for the role immediately, you are highly qualified."]

        return SkillGapResponse(
            missing_skills=missing,
            learning_roadmap=roadmap
        )
