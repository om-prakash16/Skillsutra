from typing import Dict, Any
import os
import json
import logging
import google.generativeai as genai

logger = logging.getLogger(__name__)

class SkillGapAnalyzer:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel("gemini-1.5-flash-latest")
        else:
            self.model = None

    async def analyze_gap(
        self, profile_data: Dict[str, Any], target_role: str
    ) -> Dict[str, Any]:
        """
        AI-driven skill gap analysis.
        """
        current_skills = profile_data.get("skills", [])
        
        if self.model:
            prompt = f"""You are an expert tech recruiter and career coach.
The candidate currently has these skills: {', '.join(current_skills) if current_skills else 'None listed'}.
The candidate's target role is: "{target_role}".

Analyze the gap between their current skills and the requirements for the target role.
Return ONLY a valid JSON object with the following structure:
{{
  "current_skills": ["List", "of", "skills", "they", "have"],
  "missing_skills": ["List", "of", "key", "skills", "they", "need", "to", "learn"],
  "recommendations": ["Actionable recommendation 1", "Actionable recommendation 2"],
  "readiness_score": <number between 0 and 100 representing how ready they are>
}}
"""
            try:
                response = self.model.generate_content(
                    prompt,
                    generation_config={"response_mime_type": "application/json"}
                )
                content = response.text.strip()
                result = json.loads(content)
                result["target_role"] = target_role
                return result
            except Exception as e:
                logger.error(f"AI Gap Analysis failed: {e}")

        # Fallback to simple logic
        role_lower = target_role.lower()
        required_skills = []
        if "data" in role_lower or "machine learning" in role_lower:
            required_skills = ["Python", "SQL", "Machine Learning", "Data Analysis", "Statistics"]
        elif "frontend" in role_lower or "ui" in role_lower:
            required_skills = ["JavaScript", "React", "CSS", "HTML", "TypeScript"]
        elif "backend" in role_lower:
            required_skills = ["Python", "Java", "Node.js", "SQL", "Docker", "AWS"]
        else:
            required_skills = ["Communication", "Problem Solving", "Project Management"]
            
        missing_skills = [s for s in required_skills if s.lower() not in [cs.lower() for cs in current_skills]]

        recommendations = []
        for ms in missing_skills:
            recommendations.append(f"Consider learning {ms} to better align with the {target_role} role.")

        if not recommendations:
            recommendations.append("Your skills align perfectly. Keep building projects to demonstrate your expertise.")

        readiness_score = int(((len(required_skills) - len(missing_skills)) / len(required_skills)) * 100) if required_skills else 100

        return {
            "current_skills": current_skills,
            "target_role": target_role,
            "missing_skills": missing_skills,
            "recommendations": recommendations,
            "readiness_score": readiness_score
        }
