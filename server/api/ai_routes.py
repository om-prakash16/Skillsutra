import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List
from models.schemas import ProfileData, MatchRequest

try:
    from langchain.chat_models import ChatOpenAI
    from langchain.prompts import PromptTemplate
    from langchain.output_parsers import PydanticOutputParser
except ImportError:
    pass # Will gracefully fail to mock later if not installed

router = APIRouter()

# Structured Pydantic parsers for Langchain JSON deterministic output
class ParsedResume(BaseModel):
    skills: List[str] = Field(description="List of technical skills extracted")
    experience_years: int = Field(description="Total years of professional experience")
    roles: List[str] = Field(description="Job titles previously held")

class MatchResult(BaseModel):
    match_score: int = Field(description="Match score out of 100 based on skill overlap")
    missing_skills: List[str] = Field(description="Skills required by the job that the candidate lacks")

@router.post("/parse-resume")
async def parse_resume(data: ProfileData):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return {
            "status": "mock",
            "parsed_data": {
                "skills": ["Rust", "Solana", "Next.js"],
                "experience_years": 5,
                "roles": ["Full Stack Engineer"]
            }
        }
    
    llm = ChatOpenAI(temperature=0, openai_api_key=api_key)
    parser = PydanticOutputParser(pydantic_object=ParsedResume)
    
    prompt = PromptTemplate(
        template="Extract information from the resume text.\n{format_instructions}\nResume:\n{resume}\n",
        input_variables=["resume"],
        partial_variables={"format_instructions": parser.get_format_instructions()}
    )
    
    try:
        _input = prompt.format_prompt(resume=data.resume_text)
        output = llm.predict(_input.to_string())
        result = parser.parse(output)
        return {"status": "success", "parsed_data": result.dict()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/match-jobs")
async def match_jobs(data: MatchRequest):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return {
            "status": "mock",
            "match_score": 92,
            "missing_skills": ["Anchor testing framework"]
        }
        
    llm = ChatOpenAI(temperature=0, openai_api_key=api_key)
    parser = PydanticOutputParser(pydantic_object=MatchResult)
    
    prompt = PromptTemplate(
        template="Compare candidate skills to the Job Description.\n{format_instructions}\nSkills: {skills}\nJob: {job}\n",
        input_variables=["skills", "job"],
        partial_variables={"format_instructions": parser.get_format_instructions()}
    )
    
    try:
        _input = prompt.format_prompt(skills=", ".join(data.profile_skills), job=data.job_description)
        output = llm.predict(_input.to_string())
        result = parser.parse(output)
        return {"status": "success", "result": result.dict()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
