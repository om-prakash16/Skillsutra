"""
Model-Specific CRUD Repositories
==================================
Extends the generic CRUDBase with model-aware logic for User, Company, Job, etc.
These are the single source of truth for all database mutations.
"""

import uuid
import logging
from typing import Optional

from sqlalchemy import select, func, insert
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from core.crud import CRUDBase
from models.user import User
from models.core import Company, CompanyMember, Role, user_roles

logger = logging.getLogger(__name__)


# ─── USER CRUD ─────────────────────────────────────────────

class CRUDUser(CRUDBase[User, dict, dict]):
    """
    User-specific CRUD operations.
    Extends the generic base with email lookups, role assignment, etc.
    """

    async def get_by_email(self, db: AsyncSession, *, email: str) -> Optional[User]:
        """Fetch a user by their email (case-insensitive)."""
        query = (
            select(self.model)
            .options(selectinload(User.roles))
            .where(func.lower(self.model.email) == email.lower())
        )
        result = await db.execute(query)
        return result.scalars().first()

    async def get_by_username(self, db: AsyncSession, *, username: str) -> Optional[User]:
        """Fetch a user by their username."""
        query = (
            select(self.model)
            .options(selectinload(User.roles))
            .where(func.lower(self.model.username) == username.lower())
        )
        result = await db.execute(query)
        return result.scalars().first()

    async def get_with_roles(self, db: AsyncSession, *, id: uuid.UUID) -> Optional[User]:
        """Fetch a user with their roles eagerly loaded."""
        query = (
            select(self.model)
            .options(selectinload(User.roles))
            .where(self.model.id == id)
        )
        result = await db.execute(query)
        return result.scalars().first()

    async def assign_role(self, db: AsyncSession, *, user_id: uuid.UUID, role_name: str) -> bool:
        """Assign a role to a user. Creates the role if it doesn't exist."""
        # Find or create the role
        role_query = select(Role).where(Role.role_name == role_name)
        role_result = await db.execute(role_query)
        role = role_result.scalars().first()

        if not role:
            role = Role(id=uuid.uuid4(), role_name=role_name)
            db.add(role)
            await db.flush()

        # Link user to role (ignore duplicates)
        try:
            await db.execute(insert(user_roles).values(user_id=user_id, role_id=role.id))
            await db.flush()
            logger.info(f"CRUD_ROLE_ASSIGN: user={user_id} role={role_name}")
            return True
        except Exception:
            logger.warning(f"CRUD_ROLE_ASSIGN_SKIP: user={user_id} already has role={role_name}")
            return False

    async def search(
        self,
        db: AsyncSession,
        *,
        query_str: str,
        skip: int = 0,
        limit: int = 20,
    ) -> list[User]:
        """Full-text search across users using the PostgreSQL tsvector index."""
        query = (
            select(self.model)
            .where(self.model.search_vector.match(query_str))
            .offset(skip)
            .limit(min(limit, 100))
        )
        result = await db.execute(query)
        return list(result.scalars().all())


# ─── COMPANY CRUD ──────────────────────────────────────────

class CRUDCompany(CRUDBase[Company, dict, dict]):
    """
    Company-specific CRUD operations.
    Extends the generic base with member management and approval workflows.
    """

    async def get_by_name(self, db: AsyncSession, *, name: str) -> Optional[Company]:
        """Fetch a company by its name (case-insensitive)."""
        query = select(self.model).where(
            func.lower(self.model.company_name) == name.lower()
        )
        result = await db.execute(query)
        return result.scalars().first()

    async def get_by_username(self, db: AsyncSession, *, username: str) -> Optional[Company]:
        """Fetch a company by its URL slug username."""
        query = select(self.model).where(
            func.lower(self.model.username) == username.lower()
        )
        result = await db.execute(query)
        return result.scalars().first()

    async def get_companies_for_user(
        self, db: AsyncSession, *, user_id: uuid.UUID
    ) -> list[Company]:
        """Fetch all companies a user is a member of."""
        query = (
            select(Company)
            .join(CompanyMember, CompanyMember.company_id == Company.id)
            .where(CompanyMember.user_id == user_id)
        )
        result = await db.execute(query)
        return list(result.scalars().all())

    async def add_member(
        self,
        db: AsyncSession,
        *,
        company_id: uuid.UUID,
        user_id: uuid.UUID,
        company_role_id: Optional[uuid.UUID] = None,
    ) -> CompanyMember:
        """Add a member to a company."""
        member = CompanyMember(
            id=uuid.uuid4(),
            company_id=company_id,
            user_id=user_id,
            company_role_id=company_role_id,
            status="ACTIVE",
        )
        db.add(member)
        await db.flush()
        logger.info(f"CRUD_COMPANY_MEMBER_ADD: company={company_id} user={user_id}")
        return member


# ─── SINGLETON INSTANCES ───────────────────────────────────
# Import these anywhere in the codebase:
#   from services.crud import crud_user, crud_company

crud_user = CRUDUser(User)
crud_company = CRUDCompany(Company)
