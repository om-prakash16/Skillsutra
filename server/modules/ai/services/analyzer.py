import os
from typing import Dict, Any
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from modules.ai.models import ParsedResume


class ResumeAnalyzer:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        self.llm = (
            ChatGoogleGenerativeAI(
                temperature=0, google_api_key=self.api_key, model="gemini-1.5-flash"
            )
            if self.api_key
            else None
        )
        self.parser = PydanticOutputParser(pydantic_object=ParsedResume)

    async def analyze(self, resume_text: str) -> Dict[str, Any]:
        if not self.llm:
            return {
                "score": 82,
                "missing_skills": ["Docker", "System Design"],
                "suggestions": ["add backend project", "improve GitHub activity"],
            }

        prompt = PromptTemplate(
            template="""Analyze the following resume and extract skills, experience, and education.
            Calculate a profile strength score (0-100) based on completeness and variety.
            Identify missing skills common for a senior developer.
            Provide 3 specific suggestions for improvement.
            
            {format_instructions}
            
            Resume:
            {resume}
            """,
            input_variables=["resume"],
            partial_variables={
                "format_instructions": self.parser.get_format_instructions()
            },
        )

        try:
            _input = prompt.format_prompt(resume=resume_text)
            output = self.llm.invoke(_input.to_messages())
            result = self.parser.parse(output.content)

            # The Pydantic model ParsedResume should have these fields
            # We return a structured dict for the frontend
            return {
                "score": result.score if hasattr(result, "score") else 75,
                "parsed_data": result.model_dump(),
                "missing_skills": result.missing_skills
                if hasattr(result, "missing_skills")
                else [],
                "suggestions": result.improvement_suggestions
                if hasattr(result, "improvement_suggestions")
                else [],
            }
        except Exception as e:
            print(f"[AI] Analysis Error: {str(e)}")
            return {"error": str(e), "status": "fallback"}
