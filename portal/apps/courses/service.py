from portal.apps.courses.repository import CourseRepository
from typing import List, Dict, Any

class CourseService:
    def __init__(self):
        self.repository = CourseRepository()

    async def get_bridge_recommendations(self, missing_skills: List[str]) -> List[Dict[str, Any]]:
        """
        Logic to suggest courses that bridge the skill gap identified by AI.
        """
        if not missing_skills:
            return []
            
        courses = self.repository.get_courses_by_skills(missing_skills)
        
        # Add metadata about why it was recommended
        for course in courses:
            matched = set(course.get("skills_taught", [])) & set(missing_skills)
            course["reason"] = f"Bridges your gap in: {', '.join(matched)}"
            
        return courses
