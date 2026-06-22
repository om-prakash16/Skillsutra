import asyncio
import logging
from core.database import engine, Base
from models.user import User
from models.core import Role, Company, CompanyMember
from models.rbac import UserRoleScope, ApprovalRequest, ApprovalSignature

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def init_rbac_db():
    logger.info("Initializing RBAC database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("RBAC tables created successfully.")

if __name__ == "__main__":
    asyncio.run(init_rbac_db())
