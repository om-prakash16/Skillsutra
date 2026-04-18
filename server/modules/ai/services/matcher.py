import os
import numpy as np
from typing import List, Dict, Any
from sklearn.metrics.pairwise import cosine_similarity
from langchain_google_genai import GoogleGenerativeAIEmbeddings


class JobMatcher:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        self.embeddings_model = (
            GoogleGenerativeAIEmbeddings(
                google_api_key=self.api_key, model="models/text-embedding-004"
            )
            if self.api_key
            else None
        )

    async def get_embedding(self, text: str) -> List[float]:
        if not self.embeddings_model:
            # Return random vector for mock mode (Gemini uses 768 dims)
            return np.random.rand(768).tolist()
        return await self.embeddings_model.aembed_query(text)

    async def match(
        self, profile_data: Dict[str, Any], job_list: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Ranks jobs by semantic similarity to the user profile.
        """
        # Handle empty profile or jobs
        if not profile_data or not job_list:
            return [
                {"job_id": j.get("id"), "title": j.get("title"), "match_score": 0.0}
                for j in job_list
            ]

        # Extract and clean profile text
        profile_parts = [
            str(profile_data.get("full_name", "")),
            str(profile_data.get("bio", "")),
            ", ".join(profile_data.get("skills", []))
            if isinstance(profile_data.get("skills"), list)
            else str(profile_data.get("skills", "")),
        ]
        profile_text = (
            " ".join([p for p in profile_parts if p.strip()]).strip()
            or "General Candidate"
        )
        profile_vec = await self.get_embedding(profile_text)

        results = []
        for job in job_list:
            # Extract and clean job text
            job_parts = [
                str(job.get("title", "")),
                str(job.get("description", "")),
                ", ".join(job.get("skills_required", []))
                if isinstance(job.get("skills_required"), list)
                else str(job.get("skills_required", "")),
            ]
            job_text = (
                " ".join([p for p in job_parts if p.strip()]).strip() or "General Job"
            )
            job_vec = await self.get_embedding(job_text)

            try:
                similarity = cosine_similarity([profile_vec], [job_vec])[0][0]
            except Exception:
                similarity = 0.0

            match_score = round(float(similarity) * 100, 2)

            # Match reason
            job_skills = set([s.lower() for s in job.get("skills_required", [])])
            cand_skills = set([s.lower() for s in profile_data.get("skills", [])])
            shared = list(job_skills.intersection(cand_skills))
            reason = (
                f"Matches your expertise in {', '.join(shared[:2])}"
                if shared
                else "High semantic overlap with your background."
            )

            results.append(
                {
                    "job_id": job.get("id"),
                    "title": job.get("title"),
                    "match_score": match_score,
                    "match_reason": reason,
                }
            )

        return sorted(results, key=lambda x: x["match_score"], reverse=True)

    async def match_candidates_to_job(
        self, job_data: Dict[str, Any], candidate_list: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Ranks candidates by semantic similarity to a specific job.
        Used for the 'Recruiter Discovery' feature.
        """
        if not job_data or not candidate_list:
            return []

        # Extract and clean job text
        job_parts = [
            str(job_data.get("title", "")),
            str(job_data.get("description", "")),
            ", ".join(job_data.get("skills_required", []))
            if isinstance(job_data.get("skills_required"), list)
            else str(job_data.get("skills_required", "")),
        ]
        job_text = (
            " ".join([p for p in job_parts if p.strip()]).strip()
            or "General Job Opening"
        )
        job_vec = await self.get_embedding(job_text)

        results = []
        for candidate in candidate_list:
            profile = candidate.get("profile_data", {})
            candidate_parts = [
                str(candidate.get("full_name", "")),
                str(candidate.get("bio", "")),
                ", ".join(profile.get("skills", []))
                if isinstance(profile.get("skills"), list)
                else str(profile.get("skills", "")),
            ]
            candidate_text = (
                " ".join([p for p in candidate_parts if p.strip()]).strip()
                or "Anonymous Talent"
            )
            candidate_vec = await self.get_embedding(candidate_text)

            try:
                similarity = cosine_similarity([job_vec], [candidate_vec])[0][0]
            except Exception:
                similarity = 0.0

            match_score = round(float(similarity) * 100, 2)

            job_skills = set([s.lower() for s in job_data.get("skills_required", [])])
            cand_skills = set([s.lower() for s in profile.get("skills", [])])
            shared = list(job_skills.intersection(cand_skills))
            reason = (
                f"Strong semantic match with focus on {', '.join(shared[:2])}"
                if shared
                else "High conceptual alignment with job requirements."
            )

            results.append(
                {
                    "candidate_id": candidate.get("id"),
                    "full_name": candidate.get("full_name"),
                    "match_score": match_score,
                    "match_reason": reason,
                    "skills": profile.get("skills", []),
                    "reputation": candidate.get("reputation_score", 0),
                }
            )

        return sorted(results, key=lambda x: x["match_score"], reverse=True)
