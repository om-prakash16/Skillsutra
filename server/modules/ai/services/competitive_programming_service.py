import httpx
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class CompetitiveProgrammingService:
    """
    Fetches public profile data from LeetCode, Codeforces, CodeChef, HackerRank, etc.
    """
    async def fetch_leetcode(self, username: str) -> Dict[str, Any]:
        """Fetch LeetCode stats using unofficial GraphQL API proxy (alfa-leetcode-api or direct GraphQL)."""
        # Using a reliable public GraphQL query to leetcode.com/graphql
        url = "https://leetcode.com/graphql"
        query = """
        query getUserProfile($username: String!) {
            matchedUser(username: $username) {
                username
                profile {
                    ranking
                    reputation
                    starRating
                }
                submitStats {
                    acSubmissionNum {
                        difficulty
                        count
                    }
                }
                badges {
                    id
                    displayName
                }
            }
        }
        """
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.post(url, json={"query": query, "variables": {"username": username}})
                data = resp.json().get("data", {}).get("matchedUser")
                if not data:
                    return {"error": "User not found"}
                
                stats = data.get("submitStats", {}).get("acSubmissionNum", [])
                solved = {item["difficulty"]: item["count"] for item in stats}
                
                return {
                    "username": data.get("username"),
                    "ranking": data.get("profile", {}).get("ranking"),
                    "reputation": data.get("profile", {}).get("reputation"),
                    "stars": data.get("profile", {}).get("starRating"),
                    "solved": solved,
                    "badges": [b["displayName"] for b in data.get("badges", [])]
                }
            except Exception as e:
                logger.error(f"LeetCode API Error: {e}")
                return {"error": str(e)}

    async def fetch_codeforces(self, handle: str) -> Dict[str, Any]:
        """Fetch Codeforces stats using official REST API."""
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(f"https://codeforces.com/api/user.info?handles={handle}")
                data = resp.json()
                if data.get("status") != "OK":
                    return {"error": "User not found"}
                
                user = data["result"][0]
                return {
                    "handle": user.get("handle"),
                    "rating": user.get("rating", 0),
                    "maxRating": user.get("maxRating", 0),
                    "rank": user.get("rank", "Unrated"),
                    "maxRank": user.get("maxRank", "Unrated"),
                    "contribution": user.get("contribution", 0)
                }
            except Exception as e:
                logger.error(f"Codeforces API Error: {e}")
                return {"error": str(e)}

    async def fetch_hackerrank(self, username: str) -> Dict[str, Any]:
        """Fetch HackerRank public profile data."""
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(f"https://www.hackerrank.com/rest/contests/master/hackers/{username}/profile")
                data = resp.json().get("model")
                if not data:
                    return {"error": "User not found"}
                
                return {
                    "username": data.get("username"),
                    "name": data.get("name"),
                    "level": data.get("level"),
                    "followers_count": data.get("followers_count"),
                    "badges": data.get("badges", [])
                }
            except Exception as e:
                logger.error(f"HackerRank API Error: {e}")
                return {"error": str(e)}
                
    async def fetch_codechef(self, username: str) -> Dict[str, Any]:
        """CodeChef scraping (they lack a solid public JSON API without auth, so we mock basic stats or use a proxy)."""
        # For this prototype, we simulate fetching since CodeChef DOM scraping is fragile without an official API
        # A real implementation would use BeautifulSoup4 on codechef.com/users/{username}
        return {
            "username": username,
            "status": "Linked successfully (Data sync pending proxy integration)",
            "platform": "CodeChef"
        }

    async def fetch_hackerearth(self, username: str) -> Dict[str, Any]:
        """HackerEarth scraping simulation."""
        return {
            "username": username,
            "status": "Linked successfully",
            "platform": "HackerEarth"
        }

    async def fetch_stackoverflow(self, user_id: str) -> Dict[str, Any]:
        """Fetch StackOverflow stats using official StackExchange API."""
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(f"https://api.stackexchange.com/2.3/users/{user_id}?site=stackoverflow")
                data = resp.json().get("items", [])
                if not data:
                    return {"error": "User not found"}
                
                user = data[0]
                return {
                    "display_name": user.get("display_name"),
                    "reputation": user.get("reputation"),
                    "badges": user.get("badge_counts"),
                    "link": user.get("link")
                }
            except Exception as e:
                logger.error(f"StackOverflow API Error: {e}")
                return {"error": str(e)}

competitive_programming_service = CompetitiveProgrammingService()
