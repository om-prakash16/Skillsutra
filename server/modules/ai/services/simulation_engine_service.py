import logging
import hashlib
from typing import Dict, Any, List
from datetime import datetime

from core.db import get_db

logger = logging.getLogger(__name__)

class SimulationEngineService:
    def __init__(self):
        pass

    TASK_TEMPLATES = {
        "backend": {
            "title": "Build a REST API Endpoint",
            "description": "Create a FastAPI/Express endpoint that accepts a JSON payload of user registration data, validates all fields (name, email, password strength), hashes the password, and returns a mocked JWT token. Include proper error handling and rate-limiting middleware.",
            "boilerplate": "A starter project with FastAPI installed, a blank `main.py`, and `requirements.txt`.",
            "time_limit_minutes": 60,
            "acceptance_criteria": ["POST /register endpoint accepts JSON body", "Validates email format", "Returns JWT", "Includes middleware"]
        },
        "frontend": {
            "title": "Build a React Login Form",
            "description": "Create a responsive login form with validation, error states, and a mock API call.",
            "boilerplate": "A starter React project.",
            "time_limit_minutes": 45,
            "acceptance_criteria": ["Validates email", "Shows error states", "Mock API integration"]
        },
        "data_science": {
            "title": "Data Cleaning Script",
            "description": "Write a Python script using pandas to clean a messy CSV file.",
            "boilerplate": "import pandas as pd",
            "time_limit_minutes": 30,
            "acceptance_criteria": ["Handles missing values", "Corrects data types"]
        }
    }

    def detect_role_from_job(self, job_title: str, job_description: str, required_skills: List[str]) -> str:
        combined = f"{job_title} {job_description} {' '.join(required_skills)}".lower()
        if any(kw in combined for kw in ["data scien", "machine learning"]): return "data_science"
        if any(kw in combined for kw in ["react", "frontend", "ui"]): return "frontend"
        return "backend"

    async def generate_simulation(self, wallet: str, job_title: str, job_description: str, required_skills: List[str]) -> Dict[str, Any]:
        """Generate a simulation task and store session in DB."""
        role = self.detect_role_from_job(job_title, job_description, required_skills)
        template = self.TASK_TEMPLATES.get(role, self.TASK_TEMPLATES["backend"])
        
        sim_id = f"sim_{hashlib.md5(f'{wallet}{job_title}{datetime.utcnow()}'.encode()).hexdigest()[:12]}"
        
        db = get_db()
        if db:
            try:
                db.table("simulation_sessions").insert({
                    "id": sim_id,
                    "candidate_wallet": wallet,
                    "role": role,
                    "task_title": template["title"],
                    "started_at": datetime.utcnow().isoformat(),
                    "time_limit_minutes": template["time_limit_minutes"]
                }).execute()
            except Exception as e:
                logger.error(f"Failed to store simulation session: {e}")

        return {
            "simulation_id": sim_id,
            "detected_role": role,
            "task": template,
            "started_at": datetime.utcnow().isoformat()
        }

    async def evaluate_submission(self, wallet: str, simulation_id: str, submitted_code: str) -> Dict[str, Any]:
        """Evaluate submission using local heuristics."""
        eval_data = self._heuristic_evaluate(simulation_id, submitted_code)
        
        db = get_db()
        if db:
            try:
                db.table("simulation_sessions").update({
                    "submitted_code": submitted_code,
                    "completed_at": datetime.utcnow().isoformat(),
                    "score": eval_data["composite_score"],
                    "passed": eval_data["passed"],
                    "evaluation_data": eval_data
                }).eq("id", simulation_id).execute()
            except Exception as e:
                logger.error(f"Failed to save simulation evaluation: {e}")

        return eval_data

    def _heuristic_evaluate(self, simulation_id: str, code: str) -> Dict[str, Any]:
        lines = code.split("\n")
        score = min(100, 40 + len(lines) // 2 + (10 if "async" in code else 0))
        return {
            "composite_score": score,
            "passed": score >= 65,
            "dimensions": {"code_quality": score, "problem_solving": score},
            "feedback": {"strengths": ["Code structure identified"], "improvements": ["Consider adding more robust error handling"]},
            "heuristic": True
        }

simulation_service = SimulationEngineService()
