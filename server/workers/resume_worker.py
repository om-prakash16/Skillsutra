from celery import shared_task
import logging
from pydantic import BaseModel, Field
from core.llm.provider import get_llm
from core.llm.prompts import resume_rewrite_prompt
from langchain.output_parsers import PydanticOutputParser

logger = logging.getLogger(__name__)

class RewrittenBullet(BaseModel):
    original: str = Field(description="The original bullet point.")
    rewritten: str = Field(description="The AI-enhanced bullet point.")
    explanation: str = Field(description="Why this change makes it better for the ATS.")

@shared_task(name="resume.optimize_resume_for_jd")
def optimize_resume_for_jd(resume_id: str, job_id: str, user_id: str):
    """
    AI worker task to rewrite resume bullet points using LangChain.
    """
    logger.info(f"Optimizing resume {resume_id} for job {job_id}")
    
    # In production: Fetch from DB
    mock_jd_context = "Seeking a backend engineer with strong FastAPI, PostgreSQL, and AWS experience."
    mock_bullet = "Built an API using Python."
    
    parser = PydanticOutputParser(pydantic_object=RewrittenBullet)
    llm = get_llm()
    
    chain = resume_rewrite_prompt | llm | parser
    
    try:
        # We pass format_instructions from the parser so the LLM knows the expected JSON schema
        result = chain.invoke({
            "jd_context": mock_jd_context,
            "original_bullet": mock_bullet,
            "format_instructions": parser.get_format_instructions()
        })
        
        logger.info(f"Optimization successful: {result.dict()}")
        
        # Next steps:
        # 1. Write the `result.rewritten` into a new `ResumeVersion` DB record.
        # 2. Fire a WebSocket event to the user: "Your tailored resume is ready!"
        
        return {"status": "success", "resume_id": resume_id, "rewritten_bullet": result.dict()}

    except Exception as e:
        logger.error(f"Failed to optimize resume: {e}")
        return {"status": "error", "message": str(e)}
