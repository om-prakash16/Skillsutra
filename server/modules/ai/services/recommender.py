from typing import Dict, Any

class CareerRecommender:
    def __init__(self):
        pass

    async def recommend(self, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Suggests long-term career paths and transition strategies based on local deterministic rules.
        """
        skills = [s.lower() for s in profile_data.get("skills", [])]
        
        suggested_paths = []
        justification = "Based on standard industry mappings for your skill set."
        top_priority_skill = "System Design"

        if "python" in skills and "sql" in skills:
            suggested_paths.append("Backend Developer")
            suggested_paths.append("Data Engineer")
            top_priority_skill = "Docker"
            justification = "Your Python and SQL skills are highly sought after in Data and Backend engineering."
            
        if "react" in skills or "javascript" in skills:
            suggested_paths.append("Frontend Developer")
            suggested_paths.append("Full Stack Engineer")
            top_priority_skill = "TypeScript"
            justification = "Strong web technologies background maps well to full-stack and frontend roles."
            
        if not suggested_paths:
            suggested_paths = ["Software Engineer", "Technical Consultant"]
            justification = "A general software engineering path is recommended based on your profile."
            top_priority_skill = "Cloud Computing"

        return {
            "suggested_paths": list(set(suggested_paths))[:3],
            "justification": justification,
            "top_priority_skill": top_priority_skill,
        }
