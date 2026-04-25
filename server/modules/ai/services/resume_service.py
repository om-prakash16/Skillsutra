import os
from typing import Dict, Any
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from core.supabase import get_supabase
import google.generativeai as genai
from modules.ai.models import ParsedResume


class ResumeService:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel("gemini-flash-latest")
        else:
            self.model = None
            
        self.parser = PydanticOutputParser(pydantic_object=ParsedResume)
        self.db = get_supabase()

    async def analyze_resume(self, user_id: str, resume_text: str) -> Dict[str, Any]:
        """
        Processes resume text using LangChain, extracts skills,
        calculates proof score components, and stores in ai_scores.
        """
        if not self.model:
            return {"error": "AI service not configured"}

        prompt = PromptTemplate(
            template="""Analyze the following resume for a professional profile.
            1. Extract all technical skills separately.
            2. Extract all soft skills (e.g. Leadership, Communication, Problem Solving).
            3. Identify the primary role (e.g. Frontend Engineer, Rust Dev).
            4. Calculate a Skill Score (0-100) based on deep knowledge evidence.
            5. Calculate a Forensic Confidence Score (0-100) representing how verifiable and detailed the professional claims are.
            6. Identify 3 critical missing skills for the primary role.
            
            {format_instructions}
            
            Resume Text:
            {resume}
            """,
            input_variables=["resume"],
            partial_variables={
                "format_instructions": self.parser.get_format_instructions()
            },
        )

        try:
            prompt_text = prompt.format(resume=resume_text)
            response = self.model.generate_content(prompt_text)
            output_text = response.text
            
            # Clean up potential markdown formatting if model returns it
            if output_text.startswith("```json"):
                output_text = output_text.split("```json")[1].split("```")[0].strip()
            elif output_text.startswith("```"):
                output_text = output_text.split("```")[1].split("```")[0].strip()
                
            parsed_data = self.parser.parse(output_text)

            # Map ParsedResume fields to Best Hiring Tool score model
            analysis_results = {
                "user_id": user_id,
                "skill_score": parsed_data.skill_score
                if hasattr(parsed_data, "skill_score")
                else 75,
                "forensic_confidence": parsed_data.forensic_confidence
                if hasattr(parsed_data, "forensic_confidence")
                else 80,
                "primary_role": parsed_data.role
                if hasattr(parsed_data, "role")
                else "Developer",
                "extracted_skills": parsed_data.skills,
                "soft_skills": parsed_data.soft_skills
                if hasattr(parsed_data, "soft_skills")
                else [],
                "missing_skills": parsed_data.missing_skills
                if hasattr(parsed_data, "missing_skills")
                else [],
                "ai_recommendations": parsed_data.summary
                if hasattr(parsed_data, "summary")
                else "Keep building projects.",
                "experience_years": parsed_data.experience_years
                if hasattr(parsed_data, "experience_years")
                else 0,
                "education": parsed_data.education
                if hasattr(parsed_data, "education")
                else [],
            }

            # Store in ai_scores table (Supabase)
            try:
                if self.db:
                    self.db.table("ai_scores").upsert(
                        analysis_results, on_conflict="user_id"
                    ).execute()
            except Exception as db_err:
                print(f"Database Save Warning: {db_err}")
                # We continue because the user still wants to see their results in the UI

            return analysis_results
        except Exception as e:
            print(f"Resume Analysis Error: {e}")
            return {"error": str(e)}

    async def skill_gap_analysis(
        self, user_id: str, target_job_id: str
    ) -> Dict[str, Any]:
        """
        Compares user's AI-scored profile against a target job listing.
        """
        if not self.db:
            return {"error": "DB not found"}

        # Fetch user score and job requirements
        user_score = (
            self.db.table("ai_scores")
            .select("*")
            .eq("user_id", user_id)
            .single()
            .execute()
        )
        job_data = (
            self.db.table("jobs").select("*").eq("id", target_job_id).single().execute()
        )

        if not user_score.data or not job_data.data:
            return {"error": "Incomplete data for gap analysis"}

        # Perform semantic comparison (can be enhanced with LLM if needed)
        user_skills = set(user_score.data.get("extracted_skills", []))
        job_skills = set(job_data.data.get("required_skills", []))

        gaps = list(job_skills - user_skills)
        match_percentage = (
            len(user_skills.intersection(job_skills)) / len(job_skills) * 100
            if job_skills
            else 0
        )

        return {
            "match_percentage": round(match_percentage, 2),
            "missing_skills": gaps,
            "is_qualified": match_percentage >= 70,
        }
