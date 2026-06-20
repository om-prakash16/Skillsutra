"""
Enterprise Generic CRUD Repository
====================================
Provides a type-safe, reusable base class for all database operations.
Supports: Create, Read (single + paginated), Update, Soft Delete, Hard Delete.
All operations respect the AuditMixin timestamps (created_at, updated_at, deleted_at).
"""

import uuid
import logging
from datetime import datetime, timezone
from typing import Any, Dict, Generic, List, Optional, Type, TypeVar, Union

from pydantic import BaseModel
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import Base

logger = logging.getLogger(__name__)

# Type variables for generic typing
ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    """
    Generic CRUD object with default methods to Create, Read, Update, Delete.

    Usage:
        class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
            pass

        crud_user = CRUDUser(User)
        user = await crud_user.get(db, id=some_uuid)
    """

    def __init__(self, model: Type[ModelType]):
        self.model = model

    # ─── READ ─────────────────────────────────────────────

    async def get(
        self,
        db: AsyncSession,
        id: uuid.UUID,
        *,
        include_deleted: bool = False,
    ) -> Optional[ModelType]:
        """Fetch a single record by its UUID primary key."""
        query = select(self.model).where(self.model.id == id)

        # Respect soft deletes by default
        if not include_deleted and hasattr(self.model, "deleted_at"):
            query = query.where(self.model.deleted_at.is_(None))

        result = await db.execute(query)
        return result.scalars().first()

    async def get_by_field(
        self,
        db: AsyncSession,
        *,
        field_name: str,
        field_value: Any,
        include_deleted: bool = False,
    ) -> Optional[ModelType]:
        """Fetch a single record by an arbitrary column value."""
        column = getattr(self.model, field_name, None)
        if column is None:
            raise ValueError(f"Model {self.model.__name__} has no field '{field_name}'")

        query = select(self.model).where(column == field_value)

        if not include_deleted and hasattr(self.model, "deleted_at"):
            query = query.where(self.model.deleted_at.is_(None))

        result = await db.execute(query)
        return result.scalars().first()

    async def get_multi(
        self,
        db: AsyncSession,
        *,
        skip: int = 0,
        limit: int = 100,
        order_by: Optional[str] = None,
        descending: bool = True,
        filters: Optional[Dict[str, Any]] = None,
        include_deleted: bool = False,
    ) -> List[ModelType]:
        """
        Fetch multiple records with pagination, ordering, and optional filtering.

        Args:
            skip: Number of records to skip (offset).
            limit: Maximum number of records to return (capped at 500).
            order_by: Column name to sort by (defaults to 'created_at').
            descending: Sort direction.
            filters: Dict of {column_name: value} for WHERE clauses.
            include_deleted: Whether to include soft-deleted records.
        """
        limit = min(limit, 500)  # Hard cap to prevent abuse
        query = select(self.model)

        # Apply soft-delete filter
        if not include_deleted and hasattr(self.model, "deleted_at"):
            query = query.where(self.model.deleted_at.is_(None))

        # Apply dynamic filters
        if filters:
            for field_name, value in filters.items():
                column = getattr(self.model, field_name, None)
                if column is not None:
                    query = query.where(column == value)

        # Apply ordering
        order_column = getattr(self.model, order_by or "created_at", None)
        if order_column is not None:
            query = query.order_by(order_column.desc() if descending else order_column.asc())

        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

    async def count(
        self,
        db: AsyncSession,
        *,
        filters: Optional[Dict[str, Any]] = None,
        include_deleted: bool = False,
    ) -> int:
        """Count total records, respecting filters and soft deletes."""
        query = select(func.count()).select_from(self.model)

        if not include_deleted and hasattr(self.model, "deleted_at"):
            query = query.where(self.model.deleted_at.is_(None))

        if filters:
            for field_name, value in filters.items():
                column = getattr(self.model, field_name, None)
                if column is not None:
                    query = query.where(column == value)

        result = await db.execute(query)
        return result.scalar_one()

    # ─── CREATE ───────────────────────────────────────────

    async def create(
        self,
        db: AsyncSession,
        *,
        obj_in: Union[CreateSchemaType, Dict[str, Any]],
    ) -> ModelType:
        """
        Create a new record from a Pydantic schema or a plain dict.
        Automatically assigns a UUID if the model has an 'id' column.
        """
        if isinstance(obj_in, dict):
            create_data = obj_in
        else:
            create_data = obj_in.model_dump(exclude_unset=True)

        # Ensure UUID primary key
        if "id" not in create_data:
            create_data["id"] = uuid.uuid4()

        db_obj = self.model(**create_data)
        db.add(db_obj)
        await db.flush()
        await db.refresh(db_obj)

        logger.info(f"CRUD_CREATE: {self.model.__name__} id={db_obj.id}")
        return db_obj

    # ─── UPDATE ───────────────────────────────────────────

    async def update(
        self,
        db: AsyncSession,
        *,
        db_obj: ModelType,
        obj_in: Union[UpdateSchemaType, Dict[str, Any]],
    ) -> ModelType:
        """
        Update an existing record. Accepts a Pydantic schema or dict.
        Automatically bumps `updated_at` if the column exists.
        """
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            if hasattr(db_obj, field):
                setattr(db_obj, field, value)

        # Bump audit timestamp
        if hasattr(db_obj, "updated_at"):
            setattr(db_obj, "updated_at", datetime.now(timezone.utc))

        db.add(db_obj)
        await db.flush()
        await db.refresh(db_obj)

        logger.info(f"CRUD_UPDATE: {self.model.__name__} id={db_obj.id}")
        return db_obj

    # ─── DELETE (SOFT) ────────────────────────────────────

    async def remove(
        self,
        db: AsyncSession,
        *,
        id: uuid.UUID,
        hard_delete: bool = False,
    ) -> Optional[ModelType]:
        """
        Delete a record. Default is SOFT DELETE (sets deleted_at).
        Pass hard_delete=True for permanent removal.
        """
        obj = await self.get(db, id=id, include_deleted=True)
        if not obj:
            return None

        if hard_delete or not hasattr(obj, "deleted_at"):
            await db.delete(obj)
            logger.warning(f"CRUD_HARD_DELETE: {self.model.__name__} id={id}")
        else:
            obj.deleted_at = datetime.now(timezone.utc)
            db.add(obj)
            logger.info(f"CRUD_SOFT_DELETE: {self.model.__name__} id={id}")

        await db.flush()
        return obj

    # ─── BULK OPERATIONS ──────────────────────────────────

    async def create_many(
        self,
        db: AsyncSession,
        *,
        objects_in: List[Union[CreateSchemaType, Dict[str, Any]]],
    ) -> List[ModelType]:
        """Bulk create multiple records in a single transaction flush."""
        db_objects = []
        for obj_in in objects_in:
            if isinstance(obj_in, dict):
                data = obj_in
            else:
                data = obj_in.model_dump(exclude_unset=True)

            if "id" not in data:
                data["id"] = uuid.uuid4()

            db_obj = self.model(**data)
            db.add(db_obj)
            db_objects.append(db_obj)

        await db.flush()
        logger.info(f"CRUD_BULK_CREATE: {self.model.__name__} count={len(db_objects)}")
        return db_objects

    async def remove_many(
        self,
        db: AsyncSession,
        *,
        ids: List[uuid.UUID],
        hard_delete: bool = False,
    ) -> int:
        """Bulk soft-delete or hard-delete multiple records by IDs."""
        deleted_count = 0
        for record_id in ids:
            result = await self.remove(db, id=record_id, hard_delete=hard_delete)
            if result:
                deleted_count += 1

        logger.info(f"CRUD_BULK_DELETE: {self.model.__name__} count={deleted_count}")
        return deleted_count
