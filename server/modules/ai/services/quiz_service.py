import os
import json
import uuid
from typing import List, Dict, Any, Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from datetime import datetime
from core.supabase import get_supabase

class QuizService:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        self.llm = ChatGoogleGenerativeAI(temperature=0.7, google_api_key=self.api_key, model="gemini-1.5-flash") if self.api_key else None
        self.db = get_supabase()

    async def generate_quiz(self, skill: str, difficulty: str = "intermediate", count: int = 5) -> List[Dict[str, Any]]:
        """
        Generates dynamic multiple-choice questions for the quiz.
        """
        if not self.llm:
            # Mock questions fallback
            return [
                {"id": "q1", "text": f"What is a key concept in {skill}?", "options": ["A) X", "B) Y", "C) Z", "D) W"], "correct": "C"},
                {"id": "q2", "text": f"How do you handle error in {skill}?", "options": ["A) A", "B) B", "C) C", "D) D"], "correct": "B"}
            ]

        prompt = PromptTemplate(
            template="""Generate {count} multiple choice questions to assess {skill} at {difficulty} level.
Return ONLY a JSON array with this format:
[{{"id": "q1", "text": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": "C"}}]""",
            input_variables=["count", "skill", "difficulty"]
        )

        try:
            result = self.llm.invoke(prompt.format(count=count, skill=skill, difficulty=difficulty))
            content = result.content
            # Strip any potential markdown backticks if the LLM includes them
            if content.startswith("```json"):
                content = content.replace("```json", "").replace("```", "").strip()
            
            questions = json.loads(content)
            
            # Store quiz in DB for later evaluation (contains answers)
            if self.db:
                self.db.table("ai_quizzes").insert({
                    "skill_name": skill,
                    "difficulty": difficulty,
                    "question_data": questions,
                    "created_at": datetime.utcnow().isoformat()
                }).execute()
            
            return questions
        except Exception as e:
            print(f"Quiz Generation Error: {e}")
            return []

    async def evaluate(self, quiz_id: str, user_answers: Dict[str, str]) -> Dict[str, Any]:
        """
        Evaluates quiz results using the stored data in Supabase.
        """
        if not self.db:
            return {"error": "DB not found"}

        response = self.db.table("ai_quizzes").select("*").eq("id", quiz_id).single().execute()
        if not response.data:
            return {"error": "Quiz session not found"}
        
        quiz_data = response.data["question_data"]
        correct = 0
        total = len(quiz_data)
        
        for q in quiz_data:
            if user_answers.get(q["id"]) == q["correct"]:
                correct += 1
                
        score = int((correct / total) * 100) if total > 0 else 0
        passed = score >= 80 # Higher bar for on-chain NFTs
        
        # If passed, generate a mock "mint_token" for the frontend
        mint_token = None
        if passed:
            mint_token = f"MT-{uuid.uuid4().hex[:8]}"
            self.db.table("ai_quizzes").update({
                "passed": True,
                "score": score,
                "mint_token": mint_token
            }).eq("id", quiz_id).execute()

        return {
            "score": score,
            "passed": passed,
            "correct_count": correct,
            "total_questions": total,
            "mint_token": mint_token
        }
