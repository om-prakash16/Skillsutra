from typing import List, Dict, Any, Optional
from core.supabase import get_supabase


class CareerService:
    async def create_goal(self, data: Dict[str, Any]) -> Dict[str, Any]:
        sb = get_supabase()
        if not sb:
            raise Exception("DB unavailable")

        response = (
            sb.table("career_goals")
            .insert(
                {
                    "user_id": data.get("user_id"),
                    "goal_title": data.get("goal_title"),
                    "target_role": data.get("target_role"),
                    "deadline": data.get("deadline"),
                }
            )
            .execute()
        )

        return response.data[0] if response.data else {}

    async def add_task(self, data: Dict[str, Any]) -> Dict[str, Any]:
        sb = get_supabase()
        if not sb:
            raise Exception("DB unavailable")

        response = (
            sb.table("career_tasks")
            .insert(
                {
                    "goal_id": data.get("goal_id"),
                    "task_title": data.get("task_title"),
                    "status": data.get("status", "TODO"),
                    "priority": data.get("priority", "Medium"),
                    "due_date": data.get("due_date"),
                }
            )
            .execute()
        )

        return response.data[0] if response.data else {}

    async def get_user_goals(self, user_id: str) -> List[Dict[str, Any]]:
        sb = get_supabase()
        if not sb:
            return []

        # Fetch goals
        goals_resp = (
            sb.table("career_goals").select("*").eq("user_id", user_id).execute()
        )
        goals = goals_resp.data if goals_resp.data else []

        if not goals:
            return []

        # Hydrate with tasks and calculate progress
        for goal in goals:
            tasks_resp = (
                sb.table("career_tasks").select("*").eq("goal_id", goal["id"]).execute()
            )
            tasks = tasks_resp.data if tasks_resp.data else []
            goal["tasks"] = tasks

            if tasks:
                completed = sum(1 for t in tasks if t["status"] == "COMPLETED")
                goal["progress_percentage"] = round((completed / len(tasks)) * 100, 2)
            else:
                goal["progress_percentage"] = 0.0

        return goals

    async def generate_roadmap(self, user_id: str, target_role: str) -> Dict[str, Any]:
        sb = get_supabase()
        if not sb:
            raise Exception("DB unavailable")

        # 1. Fallback Roadmap Templates if Gemini fails/not configured
        templates = {
            "Backend Developer": [
                {"milestone": "Master Database Connections & Pools", "tasks": ["Implement PostgreSQL connection pool", "Design database indices", "Build PostgREST API emulator layer"]},
                {"milestone": "System Caching & Message Queues", "tasks": ["Setup Redis caching on heavy endpoints", "Implement Celery background tasks", "Dockerize backend application"]},
                {"milestone": "Secure Auth & RBAC", "tasks": ["Configure JWT middleware check", "Write OAuth2 helper decorators", "Implement row-level security"]}
            ],
            "AI Engineer": [
                {"milestone": "LLM Orchestration & Prompt Eng", "tasks": ["Build LangChain RAG pipeline", "Connect vector db storage", "Optimize prompt token consumption"]},
                {"milestone": "Machine Learning Foundations", "tasks": ["Train linear regression models in scikit-learn", "Compute matrix calculations in numpy", "Design basic convolutional neural network"]},
                {"milestone": "Model Deployment & Monitoring", "tasks": ["Deploy FastAPI inference wrapper", "Quantize PyTorch model weights", "Track model drift with metrics"]}
            ],
            "Frontend Developer": [
                {"milestone": "Next.js App Router Core", "tasks": ["Implement dynamic routing and search parameters", "Build nested layout shells", "Configure React Server Components"]},
                {"milestone": "Styling & Motion Animations", "tasks": ["Create Tailwind grid dashboard", "Animate tabs with Framer Motion layoutId", "Apply glassmorphism styles"]},
                {"milestone": "Hydration & Performance", "tasks": ["Write optimized useQuery custom hooks", "Lazy load heavy visual modules", "Configure page caching headers"]}
            ]
        }

        milestones = templates.get(target_role, templates["Backend Developer"])

        # 2. Try Gemini AI generation
        google_api_key = os.getenv("GOOGLE_API_KEY")
        if google_api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=google_api_key)
                model = genai.GenerativeModel("gemini-1.5-flash-latest")
                prompt = f"""
                You are a senior technical career advisor.
                Generate a highly tailored career roadmap to become a "{target_role}".
                The output must be a JSON array of objects representing milestones.
                Each milestone must have a "milestone" title string and a "tasks" list containing exactly 3 strings representing tasks.
                Output ONLY raw valid JSON inside brackets: [ {{"milestone": "...", "tasks": ["...", "...", "..."]}} ]
                """
                response = model.generate_content(prompt)
                text = response.text.strip()
                # Clean markdown blocks if present
                if "```json" in text:
                    text = text.split("```json")[1].split("```")[0].strip()
                elif "```" in text:
                    text = text.split("```")[1].split("```")[0].strip()
                milestones = json.loads(text)
            except Exception as e:
                # Silently fallback to template
                pass

        # 3. Store roadmap in career_roadmaps table
        # Delete old roadmap if exists
        sb.table("career_roadmaps").delete().eq("user_id", user_id).eq("target_role", target_role).execute()
        
        response = sb.table("career_roadmaps").insert({
            "user_id": user_id,
            "target_role": target_role,
            "nodes_json": milestones,
            "current_milestone_index": 0
        }).execute()

        return response.data[0] if response.data else {}

    async def get_roadmap(self, user_id: str) -> Optional[Dict[str, Any]]:
        sb = get_supabase()
        if not sb:
            return None
        res = sb.table("career_roadmaps").select("*").eq("user_id", user_id).order("updated_at", desc=True).limit(1).execute()
        return res.data[0] if res.data else None

    async def update_roadmap_milestone(self, user_id: str, roadmap_id: str, new_index: int) -> Dict[str, Any]:
        sb = get_supabase()
        if not sb:
            raise Exception("DB unavailable")
        res = sb.table("career_roadmaps").update({
            "current_milestone_index": new_index,
            "updated_at": "now()"
        }).eq("id", roadmap_id).eq("user_id", user_id).execute()
        return res.data[0] if res.data else {}

