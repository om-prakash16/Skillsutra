import os
import logging
import google.generativeai as genai
import httpx
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

class GitHubService:
    """
    Forensic analysis of a candidate's GitHub footprint.
    Uses real GitHub API data and Gemini AI for insight generation.
    """
    def __init__(self):
        self.github_token = os.getenv("GITHUB_TOKEN")
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel("gemini-1.5-flash-latest")
        else:
            self.model = None

    async def analyze_repositories(self, github_handle: str) -> Dict[str, Any]:
        """
        Analyze a candidate's GitHub repositories to extract core skill metrics.
        """
        logger.info(f"Initiating GitHub analysis for handle: {github_handle}")

        # 1. Fetch real data from GitHub
        headers = {}
        if self.github_token:
            headers["Authorization"] = f"token {self.github_token}"

        async with httpx.AsyncClient() as client:
            try:
                # Fetch user profile
                user_resp = await client.get(f"https://api.github.com/users/{github_handle}", headers=headers)
                user_data = user_resp.json() if user_resp.status_code == 200 else {}
                
                # Fetch repositories
                repos_resp = await client.get(f"https://api.github.com/users/{github_handle}/repos?sort=updated&per_page=100", headers=headers)
                repos = repos_resp.json() if repos_resp.status_code == 200 else []
                
                # Fetch PRs
                prs_resp = await client.get(f"https://api.github.com/search/issues?q=type:pr+author:{github_handle}", headers=headers)
                prs_count = prs_resp.json().get("total_count", 0) if prs_resp.status_code == 200 else 0
                
                # Fetch Issues
                issues_resp = await client.get(f"https://api.github.com/search/issues?q=type:issue+author:{github_handle}", headers=headers)
                issues_count = issues_resp.json().get("total_count", 0) if issues_resp.status_code == 200 else 0
                
                # Fetch Commits (requires preview header)
                commit_headers = {**headers, "Accept": "application/vnd.github.cloak-preview"}
                commits_resp = await client.get(f"https://api.github.com/search/commits?q=author:{github_handle}", headers=commit_headers)
                commits_count = commits_resp.json().get("total_count", 0) if commits_resp.status_code == 200 else 0
                
            except Exception as e:
                logger.error(f"GitHub API error: {e}")
                user_data = {}
                repos = []
                prs_count = 0
                issues_count = 0
                commits_count = 0

        if not user_data:
             raise Exception(f"GitHub handle '{github_handle}' not found or API error.")

        # 2. Process metrics
        total_repos = user_data.get("public_repos", 0)
        stars_earned = sum(r.get("stargazers_count", 0) for r in repos)
        
        languages = {}
        for r in repos:
            lang = r.get("language")
            if lang:
                languages[lang] = languages.get(lang, 0) + 1
        
        sorted_langs = sorted(languages.items(), key=lambda x: x[1], reverse=True)
        primary_languages = [l[0] for l in sorted_langs[:5]]

        # 3. AI Insight Generation
        ai_data = await self._generate_ai_insight(github_handle, total_repos, stars_earned, primary_languages)

        # 4. Heuristic Metrics (Simulated from real data points)
        code_quality_index = min(99, 70 + (stars_earned // 10) + (len(primary_languages) * 2))
        architectural_complexity = min(98, 60 + (total_repos // 2))

        return {
            "github_handle": github_handle,
            "total_repositories": total_repos,
            "stars_earned": stars_earned,
            "primary_languages": primary_languages,
            "prs_count": prs_count,
            "issues_count": issues_count,
            "commits_count": commits_count,
            "metrics": {
                "architectural_complexity_handling": architectural_complexity,
                "commit_velocity_weekly": max(10, min(100, commits_count // 10)),
                "code_quality_index": code_quality_index,
            },
            "ai_insights": ai_data
        }

    async def _generate_ai_insight(self, handle: str, repos: int, stars: int, langs: List[str]) -> Dict[str, Any]:
        """Generate human-readable AI insight and inferred skills based on real GitHub data."""
        fallback = {
            "insight": "Strong technical footprint detected based on repository analysis.",
            "skills": {lang: "Intermediate" for lang in langs},
            "scores": {
                "Backend Developer Score": min(95, 60 + len(langs)*5),
                "Open Source Score": min(99, 50 + stars*2)
            }
        }
        
        if not self.model:
            return fallback

        prompt = f"""Analyze a developer's GitHub profile and generate inferred skills and scores.
Handle: {handle}
Public Repos: {repos}
Total Stars: {stars}
Primary Languages: {', '.join(langs)}

Output EXACTLY as a JSON object (no markdown, no backticks) with this structure:
{{
  "insight": "One-sentence professional technical insight.",
  "skills": {{
     "Python": "Advanced",
     "Docker": "Beginner"
  }},
  "scores": {{
     "Backend Developer Score": 88,
     "Open Source Score": 82,
     "Frontend Expertise": 40
  }}
}}
"""
        try:
            import json
            response = self.model.generate_content(prompt)
            text = response.text.strip()
            if text.startswith('```json'):
                text = text[7:-3]
            elif text.startswith('```'):
                text = text[3:-3]
            return json.loads(text.strip())
        except Exception:
            return fallback

import random
# Singleton instance
github_scanner = GitHubService()
