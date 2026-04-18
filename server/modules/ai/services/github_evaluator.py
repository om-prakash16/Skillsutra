import os
import httpx
import json
from typing import Dict, Any
from langchain_google_genai import ChatGoogleGenerativeAI


class GitHubEvaluator:
    def __init__(self):
        self.github_token = os.getenv("GITHUB_TOKEN")
        self.api_key = os.getenv("GOOGLE_API_KEY")
        self.headers = (
            {"Authorization": f"token {self.github_token}"} if self.github_token else {}
        )
        self.base_url = "https://api.github.com"

        # UI/LLM Layer
        self.llm = (
            ChatGoogleGenerativeAI(
                temperature=0, google_api_key=self.api_key, model="gemini-1.5-flash"
            )
            if self.api_key
            else None
        )

    async def get_user_score(self, username: str) -> Dict[str, Any]:
        """
        Calculates developer credibility using repository complexity and AI-driven analysis.
        """
        async with httpx.AsyncClient(headers=self.headers) as client:
            try:
                # 1. Fetch repos
                repos_resp = await client.get(
                    f"{self.base_url}/users/{username}/repos?per_page=100&sort=updated"
                )
                if repos_resp.status_code != 200:
                    return {"error": "User not found", "score": 0}

                repos = repos_resp.json()
                if not repos:
                    return {
                        "username": username,
                        "score": 0,
                        "message": "No repositories found",
                    }

                # 2. Basic Metrics
                total_stars = sum(r.get("stargazers_count", 0) for r in repos)
                total_forks = sum(r.get("forks_count", 0) for r in repos)
                unique_langs = list(
                    set(r.get("language") for r in repos if r.get("language"))
                )

                # 3. AI Deep Dive (If available)
                ai_insights = None
                if self.llm:
                    repo_summary = [
                        {
                            "name": r.get("name"),
                            "desc": r.get("description", ""),
                            "lang": r.get("language"),
                            "stars": r.get("stargazers_count"),
                        }
                        for r in repos[:15]  # Top 15 for context efficiency
                    ]

                    prompt = f"""Analyze this GitHub developer profile based on their repositories:
                    Profile: {username}
                    Languages: {unique_langs}
                    Repositories: {json.dumps(repo_summary)}

                    Evaluate:
                    1. Architecture Complexity (0-100)
                    2. Technology Variety (0-100)
                    3. Consistency of technical depth.

                    Return ONLY a JSON object:
                    {{
                        "complexity_score": int,
                        "variety_score": int,
                        "primary_tech_stack": [strings],
                        "summary": "Short 1-sentence expert evaluation"
                    }}
                    """
                    try:
                        resp = self.llm.invoke(prompt)
                        content = (
                            resp.content.replace("```json", "")
                            .replace("```", "")
                            .strip()
                        )
                        ai_insights = json.loads(content)
                    except Exception as e:
                        print(f"[AI] GitHub Analysis Failed: {e}")

                # 4. Final Scoring Logic
                comp_score = (
                    ai_insights.get("complexity_score", min(len(repos) * 10, 80))
                    if ai_insights
                    else min(len(repos) * 10, 80)
                )
                var_score = (
                    ai_insights.get("variety_score", min(len(unique_langs) * 20, 80))
                    if ai_insights
                    else min(len(unique_langs) * 20, 80)
                )
                pop_score = min(total_stars * 10, 100)

                final_score = int(
                    (comp_score * 0.4) + (pop_score * 0.3) + (var_score * 0.3)
                )

                return {
                    "username": username,
                    "score": final_score,
                    "level": self._get_level(final_score),
                    "metrics": {
                        "stars": total_stars,
                        "forks": total_forks,
                        "repos": len(repos),
                        "languages": unique_langs,
                    },
                    "ai_evaluation": ai_insights.get("summary")
                    if ai_insights
                    else "Standard statistics-based profile.",
                    "primary_stack": ai_insights.get("primary_tech_stack")
                    if ai_insights
                    else unique_langs[:3],
                }
            except Exception as e:
                return {"error": str(e), "score": 0}

    def _get_level(self, score: int) -> str:
        if score >= 85:
            return "Architect"
        if score >= 70:
            return "Lead"
        if score >= 50:
            return "Senior"
        return "Developer"
