from typing import Dict, Any

class ResumeAnalyzer:
    def __init__(self):
        pass

    async def analyze(self, resume_text: str) -> Dict[str, Any]:
        """
        Local text analysis of resume.
        """
        # Simple extraction logic
        text_lower = resume_text.lower()
        score = 82
        
        missing_skills = []
        if "docker" not in text_lower:
            missing_skills.append("Docker")
        if "system design" not in text_lower:
            missing_skills.append("System Design")
            
        suggestions = []
        if "github" not in text_lower:
            suggestions.append("Add a link to your GitHub profile")
        if "backend" not in text_lower and "api" not in text_lower:
            suggestions.append("Add a backend project to showcase full-stack skills")

        if not missing_skills:
            missing_skills = ["Cloud Deployment"]
        if not suggestions:
            suggestions = ["Optimize your bullet points to focus on impact"]

        return {
            "score": score,
            "parsed_data": {
                "extracted_info": "Local Analysis Complete",
                "length": len(resume_text)
            },
            "missing_skills": missing_skills,
            "suggestions": suggestions,
        }
