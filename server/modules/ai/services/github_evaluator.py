import os
import httpx
from typing import Dict, Any

class GitHubEvaluator:
    def __init__(self):
        self.github_token = os.getenv("GITHUB_TOKEN")
        self.headers = (
            {"Authorization": f"token {self.github_token}"} if self.github_token else {}
        )
        self.base_url = "https://api.github.com"

    async def get_user_score(self, username: str) -> Dict[str, Any]:
        """
        Calculates developer credibility using local heuristics based on GitHub metrics.
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

                # 3. Local Heuristics
                comp_score = min(len(repos) * 10, 80)
                var_score = min(len(unique_langs) * 20, 80)
                pop_score = min(total_stars * 10, 100)

                # Penalize low activity or overly empty repos
                avg_size = sum(r.get("size", 0) for r in repos) / len(repos)
                if avg_size < 100:
                    comp_score = max(0, comp_score - 20)

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
                    "ai_evaluation": "Local heuristic evaluation based on repository metrics and diversity.",
                    "primary_stack": unique_langs[:3],
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
