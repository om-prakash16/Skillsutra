import os
import numpy as np
from typing import List, Dict, Any
from sklearn.metrics.pairwise import cosine_similarity
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from portal.apps.courses.service import CourseService

class MatchingService:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        self.embeddings_model = (
            GoogleGenerativeAIEmbeddings(
                google_api_key=self.api_key, model="models/text-embedding-004"
            )
            if self.api_key
            else None
        )
        self.course_service = CourseService()

    async def get_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        if not self.embeddings_model:
            return [np.random.rand(768).tolist() for _ in texts]
        return await self.embeddings_model.aembed_documents(texts)

    async def match_candidate_to_jobs(
        self, profile_data: Dict[str, Any], job_list: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Ranks jobs by semantic similarity to the user profile.
        """
        if not profile_data or not job_list:
            return []

        # 1. Prepare Texts
        profile_text = f"{profile_data.get('full_name', '')} {profile_data.get('bio', '')} {', '.join(profile_data.get('skills', []))}"
        job_texts = [f"{j.get('title', '')} {j.get('description', '')} {', '.join(j.get('skills_required', []))}" for j in job_list]

        # 2. Embed
        embeddings = await self.get_embeddings_batch([profile_text] + job_texts)
        profile_vec = embeddings[0]
        job_vecs = embeddings[1:]

        # 3. Score & Recommend
        results = []
        user_skills = set(profile_data.get("skills", []))
        
        for i, job in enumerate(job_list):
            similarity = cosine_similarity([profile_vec], [job_vecs[i]])[0][0]
            score = round(float(similarity) * 100, 2)
            
            # Identify Gaps
            job_skills = set(job.get("skills_required", []))
            missing_skills = list(job_skills - user_skills)
            
            # Get Bridge Courses if score is < 85%
            bridge_courses = []
            if score < 85 and missing_skills:
                bridge_courses = await self.course_service.get_bridge_recommendations(missing_skills)

            results.append({
                "job_id": job.get("id"),
                "title": job.get("title"),
                "match_score": score,
                "missing_skills": missing_skills,
                "recommendations": bridge_courses[:2] # Top 2 recommendations
            })

        return sorted(results, key=lambda x: x["match_score"], reverse=True)

    async def match_job_to_candidates(
        self, job_data: Dict[str, Any], candidate_list: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Ranks candidates by semantic similarity to a specific job.
        """
        if not job_data or not candidate_list:
            return []

        job_text = f"{job_data.get('title', '')} {job_data.get('description', '')} {', '.join(job_data.get('skills_required', []))}"
        cand_texts = [f"{c.get('full_name', '')} {c.get('bio', '')} {', '.join(c.get('profile_data', {}).get('skills', []))}" for c in candidate_list]

        embeddings = await self.get_embeddings_batch([job_text] + cand_texts)
        job_vec = embeddings[0]
        cand_vecs = embeddings[1:]

        results = []
        for i, cand in enumerate(candidate_list):
            similarity = cosine_similarity([job_vec], [cand_vecs[i]])[0][0]
            results.append({
                "candidate_id": cand.get("id"),
                "full_name": cand.get("full_name"),
                "match_score": round(float(similarity) * 100, 2)
            })

        return sorted(results, key=lambda x: x["match_score"], reverse=True)
