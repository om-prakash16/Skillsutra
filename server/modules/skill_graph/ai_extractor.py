"""
AI Skill Extractor — Gemini-powered skill extraction from resumes and GitHub profiles.
"""

import os
import json
import re
from typing import Dict, Any, List, Optional
from core.supabase import get_supabase


class AISkillExtractor:
    """
    Uses Google Gemini 1.5 Pro to extract skills from resumes and GitHub profiles.
    Maps extracted skills to the master taxonomy for normalization.
    """

    EXTRACTION_PROMPT = """You are an expert technical recruiter AI. Analyze the following {source_type} content and extract ALL technical and professional skills.

For each skill provide:
1. "skill_name": the canonical/standard name (e.g., "React" not "ReactJS")  
2. "category": one of: language, framework, tool, database, cloud, concept, ai_ml, soft_skill
3. "proficiency_estimate": one of: beginner, intermediate, advanced, expert
4. "confidence": a float from 0.0 to 1.0 indicating how confident you are this skill is present
5. "evidence": a brief text snippet or reason proving this skill

Return ONLY a valid JSON array. No markdown, no explanation. Example:
[{{"skill_name": "Python", "category": "language", "proficiency_estimate": "advanced", "confidence": 0.95, "evidence": "5 years experience building Django and FastAPI applications"}}]

Content to analyze:
---
{content}
---"""

    GITHUB_ANALYSIS_PROMPT = """You are an expert technical recruiter AI analyzing a GitHub profile.

GitHub Username: {username}
Repositories and Languages: {repo_data}

Based on the repositories, languages used, project descriptions, and contribution patterns, extract all technical skills.

For each skill provide:
1. "skill_name": canonical name
2. "category": one of: language, framework, tool, database, cloud, concept, ai_ml, soft_skill
3. "proficiency_estimate": beginner/intermediate/advanced/expert (based on repo count, stars, code volume)
4. "confidence": 0.0-1.0
5. "evidence": which repos/languages demonstrate this skill

Return ONLY a valid JSON array. No markdown."""

    def __init__(self):
        self._model = None

    def _get_model(self):
        if self._model:
            return self._model
        try:
            import google.generativeai as genai
            api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
            if not api_key:
                return None
            genai.configure(api_key=api_key)
            self._model = genai.GenerativeModel("gemini-1.5-pro")
            return self._model
        except Exception:
            return None

    async def extract_from_resume(self, resume_text: str) -> List[Dict[str, Any]]:
        """Extract skills from resume text using Gemini."""
        model = self._get_model()
        if not model:
            return self._fallback_extraction(resume_text)

        prompt = self.EXTRACTION_PROMPT.format(source_type="resume", content=resume_text[:8000])

        try:
            response = model.generate_content(prompt)
            text = response.text.strip()
            # Clean markdown wrappers
            text = re.sub(r'^```json\s*', '', text)
            text = re.sub(r'\s*```$', '', text)
            skills = json.loads(text)
            return await self._match_to_taxonomy(skills)
        except Exception as e:
            print(f"[AI Extractor] Gemini error: {e}")
            return self._fallback_extraction(resume_text)

    async def extract_from_github(self, github_username: str) -> List[Dict[str, Any]]:
        """Extract skills from a GitHub profile using public API + Gemini."""
        import httpx

        repo_data = []
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(
                    f"https://api.github.com/users/{github_username}/repos",
                    params={"sort": "updated", "per_page": 30},
                    headers={"Accept": "application/vnd.github.v3+json"},
                    timeout=10,
                )
                if resp.status_code == 200:
                    repos = resp.json()
                    for r in repos:
                        repo_data.append({
                            "name": r.get("name"),
                            "description": r.get("description", ""),
                            "language": r.get("language"),
                            "stars": r.get("stargazers_count", 0),
                            "topics": r.get("topics", []),
                        })
        except Exception as e:
            print(f"[AI Extractor] GitHub API error: {e}")
            return []

        if not repo_data:
            return []

        model = self._get_model()
        if not model:
            return self._github_fallback(repo_data)

        prompt = self.GITHUB_ANALYSIS_PROMPT.format(
            username=github_username,
            repo_data=json.dumps(repo_data[:20], indent=2)
        )

        try:
            response = model.generate_content(prompt)
            text = response.text.strip()
            text = re.sub(r'^```json\s*', '', text)
            text = re.sub(r'\s*```$', '', text)
            skills = json.loads(text)
            return await self._match_to_taxonomy(skills)
        except Exception as e:
            print(f"[AI Extractor] Gemini GitHub error: {e}")
            return self._github_fallback(repo_data)

    async def _match_to_taxonomy(self, extracted: List[Dict]) -> List[Dict[str, Any]]:
        """Match extracted skills against the taxonomy for normalization."""
        db = get_supabase()
        if not db:
            return extracted

        result = []
        for skill in extracted:
            name = skill.get("skill_name", "")
            slug = name.lower().strip().replace(" ", "-").replace(".", "").replace("+", "p")

            # Try to find in taxonomy
            tax = db.table("skill_taxonomy").select("id, name, slug").ilike("name", name).execute()
            matched_id = tax.data[0]["id"] if tax.data else None

            result.append({
                **skill,
                "matched_taxonomy_id": matched_id,
                "taxonomy_name": tax.data[0]["name"] if tax.data else None,
            })

        return result

    def _fallback_extraction(self, text: str) -> List[Dict[str, Any]]:
        """Keyword-based fallback when Gemini is unavailable."""
        KEYWORDS = {
            "python": ("Python", "language"), "javascript": ("JavaScript", "language"),
            "typescript": ("TypeScript", "language"), "react": ("React", "framework"),
            "next.js": ("Next.js", "framework"), "nextjs": ("Next.js", "framework"),
            "django": ("Django", "framework"), "fastapi": ("FastAPI", "framework"),
            "node.js": ("Node.js", "framework"), "docker": ("Docker", "tool"),
            "kubernetes": ("Kubernetes", "tool"), "aws": ("AWS", "cloud"),
            "postgresql": ("PostgreSQL", "database"), "mongodb": ("MongoDB", "database"),
            "rust": ("Rust", "language"), "solana": ("Blockchain", "concept"),
            "machine learning": ("Machine Learning", "concept"),
            "tensorflow": ("TensorFlow", "ai_ml"), "pytorch": ("PyTorch", "ai_ml"),
        }

        text_lower = text.lower()
        found = []
        for keyword, (name, cat) in KEYWORDS.items():
            if keyword in text_lower:
                found.append({
                    "skill_name": name, "category": cat,
                    "proficiency_estimate": "intermediate", "confidence": 0.6,
                    "evidence": f"Keyword '{keyword}' found in text",
                })
        return found

    def _github_fallback(self, repo_data: List[Dict]) -> List[Dict[str, Any]]:
        """Fallback for GitHub extraction without Gemini."""
        lang_counts: Dict[str, int] = {}
        for r in repo_data:
            lang = r.get("language")
            if lang:
                lang_counts[lang] = lang_counts.get(lang, 0) + 1

        result = []
        for lang, count in lang_counts.items():
            prof = "beginner" if count <= 1 else "intermediate" if count <= 3 else "advanced" if count <= 8 else "expert"
            result.append({
                "skill_name": lang, "category": "language",
                "proficiency_estimate": prof, "confidence": min(0.9, 0.3 + count * 0.1),
                "evidence": f"Found in {count} repositories",
            })
        return result
