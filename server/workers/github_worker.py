from celery import shared_task
import logging
from pydantic import BaseModel, Field
from core.llm.provider import get_llm
from core.llm.prompts import github_evaluator_prompt
from langchain.output_parsers import PydanticOutputParser

logger = logging.getLogger(__name__)

class MaturityScore(BaseModel):
    engineering_maturity_score: float = Field(description="A float between 0.0 and 10.0 representing engineering maturity.")
    justification: str = Field(description="A brief explanation of the score.")

@shared_task(name="portfolio.sync_github_commits")
def sync_github_commits(user_id: str, github_username: str):
    """
    Background worker that fetches commits and uses an LLM to evaluate maturity.
    """
    logger.info(f"Syncing GitHub data for {github_username} (User: {user_id})")
    
    # Mock fetched activity
    mock_activity = "Commit 1: 'Refactor background workers to use Celery and Redis Streams'\nCommit 2: 'fix bug'"
    
    parser = PydanticOutputParser(pydantic_object=MaturityScore)
    llm = get_llm()
    
    chain = github_evaluator_prompt | llm | parser
    
    try:
        result = chain.invoke({
            "github_activity": mock_activity,
            "format_instructions": parser.get_format_instructions()
        })
        
        logger.info(f"Scoring complete: {result.dict()}")
        
        # Next steps:
        # 1. Update `DeveloperPortfolio.engineering_maturity_score` in DB
        # 2. Add `GithubCommitSync` records
        
        return {"status": "success", "user_id": user_id, "score_data": result.dict()}
        
    except Exception as e:
        logger.error(f"Failed to score github commits: {e}")
        return {"status": "error", "message": str(e)}
