from typing import List, Dict, Any
from core.db import get_db
from core.exceptions import NotFoundError, ExternalServiceError
from core.logging import ProtocolLogger

logger = ProtocolLogger.get_logger("repository.jobs")

class JobRepository:
    def __init__(self):
        self.db = get_db()
        self.table = "jobs"

    def _base_query(self):
        """Standard base query with soft-delete protection."""
        return self.db.table(self.table).select("*").eq("is_active", True)

    async def list_jobs(self, limit: int = 20, offset: int = 0) -> List[Dict[str, Any]]:
        """Fetch a paginated list of active jobs."""
        try:
            res = self._base_query().order("created_at", desc=True).range(offset, offset + limit).execute()
            return res.data or []
        except Exception as e:
            logger.error(f"Database error in list_jobs: {e}")
            raise ExternalServiceError(message="Failed to retrieve jobs from the database")

    async def get_by_id(self, job_id: str) -> Dict[str, Any]:
        """Fetch a single active job by ID."""
        try:
            res = self._base_query().select("*, companies(*)").eq("id", job_id).single().execute()
            if not res.data:
                raise NotFoundError(message=f"Job with ID {job_id} not found")
            return res.data
        except NotFoundError:
            raise
        except Exception as e:
            logger.error(f"Database error in get_by_id ({job_id}): {e}")
            raise ExternalServiceError(message="Failed to retrieve job details")

    async def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new job posting with validation."""
        try:
            res = self.db.table(self.table).insert(data).execute()
            if not res.data:
                raise ExternalServiceError(message="Database failed to persist the job posting")
            return res.data[0]
        except Exception as e:
            logger.error(f"Database error in create: {e}")
            raise ExternalServiceError(message="Failed to create job posting")

    async def list_by_company(self, company_id: str) -> List[Dict[str, Any]]:
        """Fetch all jobs posted by a specific company."""
        res = self.db.table(self.table).select("*").eq("company_id", company_id).execute()
        return res.data or []

job_repository = JobRepository()
