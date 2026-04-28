import os
import json
import google.generativeai as genai
from typing import Dict, Any, List
from portal.core.supabase import get_supabase

class AIService:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel("gemini-1.5-flash-latest")
        else:
            self.model = None
        self.db = get_supabase()

    async def analyze_resume(self, resume_text: str) -> Dict[str, Any]:
        """
        Extract structured data from raw resume text using Gemini.
        """
        if not self.model:
            return {"error": "AI model not initialized"}

        prompt = f"""
        Analyze the following resume and return a JSON object.
        Resume Text: {resume_text}
        
        Fields:
        - skills: list of technical skills
        - soft_skills: list of soft skills
        - experience_years: integer
        - education: list of degrees
        - primary_role: string
        - summary: 1-sentence bio
        """
        
        response = await self.model.generate_content_async(prompt)
        try:
            # Clean JSON response from Gemini
            text = response.text.strip()
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            return json.loads(text)
        except Exception:
            return {"error": "Failed to parse AI response"}

    async def parse_job_description(self, jd_text: str) -> Dict[str, Any]:
        """
        Extract structured fields from a raw JD text.
        """
        if not self.model:
            return {"error": "AI model not initialized"}

        prompt = f"""
        Extract professional fields from this Job Description. Return JSON.
        JD Text: {jd_text}
        
        Fields:
        - title: string
        - required_skills: list
        - experience_level: string (Junior, Mid, Senior, Lead)
        - salary_range: string
        - location: string
        """
        
        response = await self.model.generate_content_async(prompt)
        try:
            text = response.text.strip()
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            return json.loads(text)
        except Exception:
            return {"error": "Failed to parse AI response"}

    async def generate_assessment_questions(self, skills: List[str], count: int = 5) -> List[Dict[str, Any]]:
        """
        Generate MCQ questions based on specific skills.
        """
        if not self.model:
            return []

        prompt = f"""
        Generate {count} multiple choice questions for the following skills: {', '.join(skills)}.
        Return a JSON list of objects:
        {{
            "question": "string",
            "options": ["A", "B", "C", "D"],
            "correct_option": "index (0-3)",
            "explanation": "string"
        }}
        """
        
        response = await self.model.generate_content_async(prompt)
        try:
            text = response.text.strip()
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            return json.loads(text)
        except Exception:
            return []
