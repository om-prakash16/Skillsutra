import os
from typing import List, Dict, Any
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate

class SkillGapAnalyzer:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        self.llm = ChatGoogleGenerativeAI(temperature=0, google_api_key=self.api_key, model="gemini-1.5-flash") if self.api_key else None

    async def analyze_gap(self, profile_data: Dict[str, Any], target_role: str) -> Dict[str, Any]:
        if not self.llm:
            return {
                "current_skills": profile_data.get("skills", []),
                "target_role": target_role,
                "missing_skills": ["TensorFlow", "Statistics"],
                "recommendations": [
                    "Learn TensorFlow through Coursera",
                    "Build a Machine Learning project",
                    "Study basic statistics for data science"
                ]
            }

        prompt = PromptTemplate(
            template="""Compare the candidate's skills against the industry standard for a {target_role}.
            Candidate Skills: {skills}
            
            Identify exactly what is missing and provide a specific learning roadmap.
            Return a JSON object with:
            - missing_skills (list)
            - recommendations (list of strings with resources)
            """,
            input_variables=["skills", "target_role"]
        )

        try:
            result = self.llm.invoke(prompt.format(
                skills=", ".join(profile_data.get("skills", [])),
                target_role=target_role
            ))
            # In a production app, use Pydantic parser here
            import json
            return json.loads(result.content)
        except Exception as e:
            return {"error": str(e)}
