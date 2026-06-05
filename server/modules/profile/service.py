from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException
from models.profile import Profile, Experience, Education, Project, VisibilityMode
from schemas.profile import ProfileCreate, ProfileResponse, ExperienceCreate, EducationCreate, ProjectCreate
from uuid import UUID
from core.redis import redis_get, redis_set, redis_delete
import json

class ProfileService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_orm_profile(self, user_id: UUID):
        stmt = (
            select(Profile)
            .options(
                selectinload(Profile.experiences),
                selectinload(Profile.educations),
                selectinload(Profile.projects)
            )
            .where(Profile.user_id == user_id)
        )
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def get_profile_by_user_id(self, user_id: UUID, skip_cache: bool = False):
        cache_key = f"profile:{user_id}"
        if not skip_cache:
            cached_data = await redis_get(cache_key)
            if cached_data:
                # Return the dict (FastAPI's response_model handles dicts easily)
                return cached_data

        profile = await self.get_orm_profile(user_id)
        
        if profile:
            # Convert SQLAlchemy model to Pydantic dict and cache it
            profile_dict = json.loads(ProfileResponse.model_validate(profile).model_dump_json())
            await redis_set(cache_key, profile_dict, ttl_seconds=3600)
            
        return profile

    async def get_public_profile(self, target_user_id: UUID, current_user: dict):
        profile = await self.get_profile_by_user_id(target_user_id)

        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")

        # Determine visibility mode (handle both dict from Redis and SQLAlchemy object)
        visibility_mode = profile.get("visibility_mode") if isinstance(profile, dict) else profile.visibility_mode

        # Visibility Logic
        is_owner = current_user and current_user.get("id") == str(target_user_id)
        is_recruiter = current_user and "recruiter" in current_user.get("roles", [])
        
        if is_owner:
            return profile

        if visibility_mode == VisibilityMode.PRIVATE.value:
            raise HTTPException(status_code=403, detail="Profile is private")
            
        if visibility_mode == VisibilityMode.RECRUITER_ONLY.value and not is_recruiter:
            raise HTTPException(status_code=403, detail="Profile is visible to recruiters only")

        return profile
        
    async def get_or_create_profile(self, user_id: UUID) -> Profile:
        profile = await self.get_orm_profile(user_id)
        if not profile:
            from models.user import User
            user_res = await self.db.execute(select(User).where(User.id == user_id))
            user = user_res.scalars().first()
            fallback_name = user.username if user else "Unknown User"
            
            profile = Profile(user_id=user_id, full_name=fallback_name, headline=fallback_name, email=user.email if user else None)
            self.db.add(profile)
            await self.db.commit()
            await self.db.refresh(profile)
        return profile

    async def update_profile(self, user_id: UUID, data: ProfileCreate):
        profile = await self.get_or_create_profile(user_id)
        
        for key, value in data.dict(exclude_unset=True).items():
            setattr(profile, key, value)
            
        await self.db.commit()
        await self.db.refresh(profile)
        
        # Invalidate cache
        await redis_delete(f"profile:{user_id}")
        await redis_delete(f"profile_strength:{user_id}")
        
        return profile

    async def add_experience(self, user_id: UUID, data: ExperienceCreate) -> Experience:
        profile = await self.get_or_create_profile(user_id)
        
        experience = Experience(**data.dict(), profile_id=profile.id)
        self.db.add(experience)
        await self.db.commit()
        await self.db.refresh(experience)
        return experience

    async def add_education(self, user_id: UUID, data: EducationCreate) -> Education:
        profile = await self.get_or_create_profile(user_id)
        
        education = Education(**data.dict(), profile_id=profile.id)
        self.db.add(education)
        await self.db.commit()
        await self.db.refresh(education)
        return education

    async def add_project(self, user_id: UUID, data: ProjectCreate) -> Project:
        profile = await self.get_or_create_profile(user_id)
        
        project = Project(**data.dict(), profile_id=profile.id)
        self.db.add(project)
        await self.db.commit()
        await self.db.refresh(project)
        return project
