import numpy as np
import os
import logging
from typing import List, Dict, Any
from sklearn.metrics.pairwise import cosine_similarity
import google.generativeai as genai

logger = logging.getLogger(__name__)

class JobMatcher:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model_name = "models/text-embedding-004"
        else:
            self.model_name = None

    async def get_embedding(self, text: str) -> List[float]:
        if not self.model_name or not text.strip():
            return np.random.rand(768).tolist()
        try:
            result = genai.embed_content(
                model=self.model_name,
                content=text,
                task_type="retrieval_document"
            )
            return result['embedding']
        except Exception as e:
            logger.error(f"Gemini embedding failed: {e}")
            return np.random.rand(768).tolist()

    async def get_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        if not self.model_name:
            return [np.random.rand(768).tolist() for _ in texts]
        try:
            valid_texts = [t if t.strip() else "Unknown" for t in texts]
            result = genai.embed_content(
                model=self.model_name,
                content=valid_texts,
                task_type="retrieval_document"
            )
            return result['embedding']
        except Exception as e:
            logger.error(f"Gemini batch embedding failed: {e}")
            return [np.random.rand(768).tolist() for _ in texts]

    async def match(
        self, profile_data: Dict[str, Any], job_list: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Ranks jobs by semantic similarity to the user profile using Gemini Embeddings.
        """
        if not profile_data or not job_list:
            return [
                {"job_id": j.get("id"), "title": j.get("title"), "match_score": 0.0, "match_reason": "No data available."}
                for j in job_list
            ]

        # 1. Prepare Profile Text
        profile_parts = [
            str(profile_data.get("full_name", "")),
            str(profile_data.get("bio", "")),
            ", ".join(profile_data.get("skills", [])) if isinstance(profile_data.get("skills"), list) else str(profile_data.get("skills", "")),
        ]
        profile_text = " ".join([p for p in profile_parts if p.strip()]).strip() or "General Candidate"
        
        # 2. Prepare Job Texts
        job_texts = []
        for job in job_list:
            job_parts = [
                str(job.get("title", "")),
                str(job.get("description", "")),
                ", ".join(job.get("skills_required", [])) if isinstance(job.get("skills_required"), list) else str(job.get("skills_required", "")),
            ]
            job_texts.append(" ".join([p for p in job_parts if p.strip()]).strip() or "General Job")

        # 3. Gemini Embeddings
        all_texts = [profile_text] + job_texts
        embeddings = await self.get_embeddings_batch(all_texts)
        
        profile_vec = [embeddings[0]]
        job_vecs = embeddings[1:]

        # 4. Calculate Scores
        results = []
        for i, job in enumerate(job_list):
            try:
                similarity = cosine_similarity(profile_vec, [job_vecs[i]])[0][0]
                # Normalize similarity from [-1, 1] to [0, 100] approximately
                # Embeddings are often strictly positive, but just in case:
                sim_score = max(0.0, float(similarity))
                match_score = round(sim_score * 100, 2)
            except Exception:
                match_score = 0.0

            # Reasoning
            job_skills = set([s.lower() for s in job.get("skills_required", [])])
            cand_skills = set([s.lower() for s in profile_data.get("skills", [])])
            shared = list(job_skills.intersection(cand_skills))
            reason = f"Matches your expertise in {', '.join(shared[:2])}" if shared else "High semantic overlap with your background."

            results.append({
                "job_id": job.get("id"),
                "title": job.get("title"),
                "match_score": match_score,
                "match_reason": reason,
            })

        return sorted(results, key=lambda x: x["match_score"], reverse=True)

    async def match_candidates_to_job(
        self, job_data: Dict[str, Any], candidate_list: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Ranks candidates by semantic similarity to a specific job using Gemini Embeddings.
        """
        if not job_data or not candidate_list:
            return []

        # 1. Prepare Job Text
        job_parts = [
            str(job_data.get("title", "")),
            str(job_data.get("description", "")),
            ", ".join(job_data.get("skills_required", [])) if isinstance(job_data.get("skills_required"), list) else str(job_data.get("skills_required", "")),
        ]
        job_text = " ".join([p for p in job_parts if p.strip()]).strip() or "General Job Opening"
        
        # 2. Prepare Candidate Texts
        candidate_texts = []
        for candidate in candidate_list:
            profile = candidate.get("profile_data", {}) or {}
            candidate_parts = [
                str(candidate.get("full_name", "")),
                str(candidate.get("bio", "")),
                ", ".join(profile.get("skills", [])) if isinstance(profile.get("skills"), list) else str(profile.get("skills", "")),
            ]
            candidate_texts.append(" ".join([p for p in candidate_parts if p.strip()]).strip() or "Anonymous Talent")

        # 3. Gemini Embeddings
        all_texts = [job_text] + candidate_texts
        embeddings = await self.get_embeddings_batch(all_texts)
        
        job_vec = [embeddings[0]]
        candidate_vecs = embeddings[1:]

        # 4. Calculate Scores
        results = []
        for i, candidate in enumerate(candidate_list):
            try:
                similarity = cosine_similarity(job_vec, [candidate_vecs[i]])[0][0]
                sim_score = max(0.0, float(similarity))
                match_score = round(sim_score * 100, 2)
            except Exception:
                match_score = 0.0
            
            profile = candidate.get("profile_data", {}) or {}
            job_skills = set([s.lower() for s in job_data.get("skills_required", [])])
            cand_skills = set([s.lower() for s in profile.get("skills", [])])
            shared = list(job_skills.intersection(cand_skills))
            reason = f"Strong semantic match with focus on {', '.join(shared[:2])}" if shared else "High conceptual alignment with job requirements."

            results.append({
                "candidate_id": candidate.get("id"),
                "full_name": candidate.get("full_name"),
                "match_score": match_score,
                "match_reason": reason,
                "skills": profile.get("skills", []),
                "reputation": candidate.get("reputation_score", 0),
            })

        return sorted(results, key=lambda x: x["match_score"], reverse=True)
