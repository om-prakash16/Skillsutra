from typing import List, Dict, Any, Optional
from core.db import get_db


class CareerService:
    async def create_goal(self, data: Dict[str, Any]) -> Dict[str, Any]:
        sb = get_db()
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
        sb = get_db()
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
        sb = get_db()
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

    async def generate_roadmap(self, user_id: str, target_role: str, user_skills: List[str] = None, current_state: str = "", timeline: str = "", daily_routine: str = "") -> Dict[str, Any]:
        sb = get_db()
        if not sb:
            raise Exception("DB unavailable")
            
        import os
        import json
        import logging
        import google.generativeai as genai
        
        logger = logging.getLogger(__name__)
        api_key = os.getenv("GOOGLE_API_KEY")
        
        milestones = []
        if api_key:
            try:
                genai.configure(api_key=api_key)
                model = genai.GenerativeModel("gemini-2.5-flash")
                
                context_str = f"The user currently has these skills: {', '.join(user_skills)}." if user_skills else "The user is starting fresh."
                if current_state:
                    context_str += f"\nTheir current job/learning state is: {current_state}."
                if timeline:
                    context_str += f"\nTheir target timeline to achieve this is: {timeline}."
                if daily_routine:
                    context_str += f"\nTheir daily availability/routine is: {daily_routine}."

                prompt = f"""You are an expert career coach and technical mentor.
Create a step-by-step learning roadmap for a user who wants to become a "{target_role}".
{context_str}

Return ONLY a valid JSON array of objects representing milestones. Each object must have exactly these keys:
- milestone: A short title for the milestone (e.g. "Master Database Connections")
- tasks: An array of 3-5 specific, actionable strings that fit their timeline and daily routine constraints.

Generate exactly 4 milestones that progress from foundational to advanced for this role, tailored to their constraints.
"""
                response = model.generate_content(
                    prompt,
                    generation_config={"response_mime_type": "application/json"}
                )
                
                content = response.text.strip()
                milestones = json.loads(content)
            except Exception as e:
                logger.error(f"AI Roadmap Generation failed for {target_role}: {e}")
        
        if not milestones:
            # Fallback if Gemini fails or is not configured
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

        # Store roadmap in career_roadmaps table
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
        sb = get_db()
        if not sb:
            return None
        res = sb.table("career_roadmaps").select("*").eq("user_id", user_id).order("updated_at", desc=True).limit(1).execute()
        return res.data[0] if res.data else None

    async def update_roadmap_milestone(self, user_id: str, roadmap_id: str, new_index: int) -> Dict[str, Any]:
        sb = get_db()
        if not sb:
            raise Exception("DB unavailable")
        res = sb.table("career_roadmaps").update({
            "current_milestone_index": new_index,
            "updated_at": "now()"
        }).eq("id", roadmap_id).eq("user_id", user_id).execute()
        return res.data[0] if res.data else {}

