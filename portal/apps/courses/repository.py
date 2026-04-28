from portal.core.supabase import get_supabase
from typing import List, Dict, Any

class CourseRepository:
    def __init__(self):
        self.db = get_supabase()

    def get_courses_by_skills(self, skills: List[str]) -> List[Dict[str, Any]]:
        """
        Find courses that teach any of the provided missing skills.
        Uses Postgres GIN index for overlap check.
        """
        # Using .overlaps() for PostgreSQL array intersection
        res = self.db.table("courses").select("*").overlaps("skills_taught", skills).execute()
        return res.data if res.data else []

    def get_all_courses(self):
        return self.db.table("courses").select("*").execute()
