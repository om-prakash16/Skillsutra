from portal.apps.matching.service import MatchingService
from portal.apps.matching.repository import MatchingRepository

class MatchingController:
    def __init__(self):
        self.service = MatchingService()
        self.repository = MatchingRepository()

    async def find_jobs_for_user(self, user_id: str):
        profile = self.repository.get_candidate_profile(user_id)
        # Clean profile for AI
        ai_profile = {
            "full_name": profile["user"].get("profiles", [{}])[0].get("full_name"),
            "bio": profile["user"].get("profiles", [{}])[0].get("bio"),
            "skills": [s["skills"]["name"] for s in profile["skills"] if s.get("skills")]
        }
        jobs = self.repository.get_active_jobs()
        return await self.service.match_candidate_to_jobs(ai_profile, jobs)

    async def find_candidates_for_job(self, job_id: str):
        # Fetch job data
        job_res = self.repository.db.table("jobs").select("*").eq("id", job_id).single().execute()
        job_data = job_res.data
        candidates = self.repository.get_all_candidates()
        return await self.service.match_job_to_candidates(job_data, candidates)
