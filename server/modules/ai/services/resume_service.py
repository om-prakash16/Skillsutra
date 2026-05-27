import re
import os
import json
import logging
from typing import List, Dict, Any
import google.generativeai as genai
from core.db import get_db

logger = logging.getLogger(__name__)

COMMON_SKILLS = ["python", "java", "react", "fastapi", "node", "javascript", "sql", "aws", "docker", "kubernetes", "html", "css", "typescript", "c++", "c#", "go", "ruby", "django"]
COMMON_SOFT_SKILLS = ["communication", "leadership", "teamwork", "problem solving", "management"]

class ResumeService:
    def __init__(self):
        self.db = get_db()
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel("gemini-1.5-flash-latest")
        else:
            self.model = None

    def _extract_skills(self, text: str, skill_list: List[str]) -> List[str]:
        text_lower = text.lower()
        return [skill for skill in skill_list if skill in text_lower]

    async def analyze_resume(self, user_id: str, resume_text: str) -> Dict[str, Any]:
        """
        Processes resume text using Gemini AI to extract deep insights.
        """
        analysis_results = {
            "user_id": user_id,
            "skill_score": 75,
            "forensic_confidence": 80,
            "primary_role": "Software Professional",
            "extracted_skills": ["Python", "General Software"],
            "soft_skills": ["Communication"],
            "missing_skills": ["Cloud Infrastructure"],
            "ai_recommendations": "Keep building projects to expand your portfolio.",
            "experience_years": 2,
            "education": ["Bachelors Degree"],
        }
        
        if self.model:
            prompt = f"""Analyze the following resume text and extract the key information.
Return ONLY a valid JSON object with the following keys:
- skill_score: integer (0-100) rating their overall technical strength
- forensic_confidence: integer (0-100) rating how authentic/realistic the resume seems
- primary_role: string (e.g., 'Backend Engineer', 'Data Scientist')
- extracted_skills: list of strings (hard skills)
- soft_skills: list of strings
- missing_skills: list of strings (what typical skills for this role are missing)
- ai_recommendations: string (one sentence advice)
- experience_years: integer
- education: list of strings

Resume Text:
{resume_text[:4000]}
"""
            try:
                response = self.model.generate_content(
                    prompt,
                    generation_config={"response_mime_type": "application/json"}
                )
                ai_data = json.loads(response.text.strip())
                ai_data["user_id"] = user_id
                analysis_results = ai_data
            except Exception as e:
                logger.error(f"Gemini Resume Analysis failed: {e}")
                # Fallback to simple extraction
                extracted_skills = self._extract_skills(resume_text, COMMON_SKILLS)
                soft_skills = self._extract_skills(resume_text, COMMON_SOFT_SKILLS)
                exp_match = re.search(r'(\d+)\+?\s*years?\s+of\s+experience', resume_text, re.IGNORECASE)
                analysis_results["extracted_skills"] = extracted_skills if extracted_skills else analysis_results["extracted_skills"]
                analysis_results["soft_skills"] = soft_skills if soft_skills else analysis_results["soft_skills"]
                analysis_results["experience_years"] = int(exp_match.group(1)) if exp_match else analysis_results["experience_years"]

        try:
            if self.db:
                await self.db.table("ai_scores").upsert(
                    analysis_results, on_conflict="user_id"
                ).execute()
        except Exception as db_err:
            print(f"Database Save Warning: {db_err}")

        return analysis_results

    async def skill_gap_analysis(
        self, user_id: str, target_job_id: str
    ) -> Dict[str, Any]:
        """
        Compares user's profile against a target job listing locally.
        """
        if not self.db:
            return {"error": "DB not found"}

        user_score = await (
            self.db.table("ai_scores")
            .select("*")
            .eq("user_id", user_id)
            .single()
            .execute()
        )
        job_data = await (
            self.db.table("jobs").select("*").eq("id", target_job_id).single().execute()
        )

        if not user_score.data or not job_data.data:
            return {"error": "Incomplete data for gap analysis"}

        user_skills = set(s.lower() for s in user_score.data.get("extracted_skills", []))
        job_skills = set(s.lower() for s in job_data.data.get("required_skills", []))

        gaps = list(job_skills - user_skills)
        match_percentage = (
            len(user_skills.intersection(job_skills)) / len(job_skills) * 100
            if job_skills
            else 100.0
        )

        return {
            "match_percentage": round(match_percentage, 2),
            "missing_skills": gaps,
            "is_qualified": match_percentage >= 70,
        }

    async def parse_job_description(self, jd_text: str) -> Dict[str, Any]:
        """
        Extracts structured job details using AI.
        """
        if self.model:
            prompt = f"""Extract the following details from this job description:
Return ONLY a valid JSON object with:
- title: string
- skills: list of strings
- description: string (summary)
- experience_level: string
- job_type: string

JD Text:
{jd_text[:3000]}
"""
            try:
                response = self.model.generate_content(
                    prompt,
                    generation_config={"response_mime_type": "application/json"}
                )
                return json.loads(response.text.strip())
            except Exception as e:
                logger.error(f"JD parsing failed: {e}")

        skills = self._extract_skills(jd_text, COMMON_SKILLS)
        return {
            "title": "Software Engineer (Local Analysis)",
            "skills": skills if skills else ["Software Development"],
            "description": jd_text[:500] + "...",
            "experience_level": "Mid Level",
            "job_type": "Full-time"
        }

    async def compare_jd_cv(self, jd_text: str, resume_text: str) -> Dict[str, Any]:
        """
        Deep semantic comparison between a Job Description and a Resume using Gemini AI.
        """
        if self.model:
            prompt = f"""Act as an expert technical recruiter. Compare the following Resume to the Job Description.
Return ONLY a valid JSON object with the following keys:
- match_score: integer (0-100)
- matching_skills: list of strings
- missing_skills: list of strings
- experience_match: string (brief explanation of experience alignment)
- project_match: string (brief explanation of project alignment)
- industry_readiness: string (brief explanation of readiness)

Job Description:
{jd_text[:3000]}

Resume:
{resume_text[:3000]}
"""
            try:
                response = self.model.generate_content(
                    prompt,
                    generation_config={"response_mime_type": "application/json"}
                )
                return json.loads(response.text.strip())
            except Exception as e:
                logger.error(f"Gemini JD-CV matching failed: {e}")

        # Fallback keyword logic
        jd_skills = set(self._extract_skills(jd_text, COMMON_SKILLS))
        cv_skills = set(self._extract_skills(resume_text, COMMON_SKILLS))
        
        match_score = (len(jd_skills.intersection(cv_skills)) / len(jd_skills) * 100) if jd_skills else 50.0
        
        return {
            "match_score": round(match_score, 2),
            "matching_skills": list(jd_skills.intersection(cv_skills)),
            "missing_skills": list(jd_skills - cv_skills),
            "experience_match": "Experience level evaluated via local fallback.",
            "project_match": "Projects evaluated via local fallback.",
            "industry_readiness": "Candidate shows baseline readiness based on keyword density."
        }

    async def match_candidates_to_jd(self, jd_text: str, limit: int = 5) -> List[Dict[str, Any]]:
        """
        Local candidate matching against a Job Description.
        """
        if not self.db:
            return []

        extracted_skills = self._extract_skills(jd_text, COMMON_SKILLS)
        
        from modules.search.service import SearchService
        search_res = await SearchService.search(skills=extracted_skills)
        candidates = search_res.get("candidates", [])

        if not candidates:
            return []

        # Try to use AI to re-rank if available, otherwise fallback to simple overlap
        if self.model and len(candidates) > 0:
            candidate_summaries = "\\n".join([f"ID: {c.get('id')}, Skills: {', '.join(c.get('skills', []))}" for c in candidates])
            prompt = f"""You are a matching algorithm. Rank these candidates against the following job description.
Job Description: {jd_text[:1000]}

Candidates:
{candidate_summaries}

Return ONLY a valid JSON array of objects, each with 'id' (the candidate ID) and 'match_score' (0-100 integer).
Order the array by match_score descending.
"""
            try:
                response = self.model.generate_content(
                    prompt,
                    generation_config={"response_mime_type": "application/json"}
                )
                rankings = json.loads(response.text.strip())
                rank_map = {str(r["id"]): r["match_score"] for r in rankings}
                for c in candidates:
                    c["match_score"] = rank_map.get(str(c["id"]), c.get("proof_score", 0))
            except Exception as e:
                logger.error(f"Gemini ranking failed: {e}")
                for c in candidates:
                    c_skills = set(c.get("skills", []))
                    overlap = len(set(extracted_skills).intersection(c_skills))
                    c["match_score"] = (overlap / len(extracted_skills)) * 100 if extracted_skills else 50
        else:
            for c in candidates:
                c_skills = set(c.get("skills", []))
                overlap = len(set(extracted_skills).intersection(c_skills))
                c["match_score"] = (overlap / len(extracted_skills)) * 100 if extracted_skills else 50

        candidates.sort(key=lambda x: x.get("match_score", 0), reverse=True)
        return candidates[:limit]

resume_service = ResumeService()
