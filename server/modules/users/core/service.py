from pydantic import create_model
from typing import Dict, Any, List, Optional, Type
from core.db import get_db
import asyncio
from cachetools import TTLCache


class DynamicValidationService:
    @staticmethod
    async def get_active_schema() -> List[Dict[str, Any]]:
        """Fetch the current profile schema from the database."""
        db = get_db()
        if not db:
            raise Exception("Database connection unavailable for schema fetch")

        response = await (
            db.table("profile_schema")
            .select("*")
            .eq("is_active", True)
            .order("display_order")
            .execute()
        )
        return response.data

    @classmethod
    async def create_pydantic_model(cls) -> Type[Any]:
        """
        Generates a runtime Pydantic model based on the active dynamic schema.
        """
        fields = await cls.get_active_schema()
        field_definitions = {}

        for field in fields:
            name = field["field_name"]
            f_type = field["field_type"]
            required = field.get("required", False)

            # Map database field types to Python types
            python_type = str
            if f_type == "number":
                python_type = float
            elif f_type in ["multi-select", "select"] and "options" in field.get(
                "validation_rules", {}
            ):
                # For multi-select, it would be List[str]
                python_type = List[str] if f_type == "multi-select" else str
            elif f_type == "checkbox":
                python_type = bool

            # Create field definition with validation
            if required:
                field_definitions[name] = (python_type, ...)
            else:
                field_definitions[name] = (Optional[python_type], None)

        return create_model("DynamicProfileModel", **field_definitions)

    @staticmethod
    def generate_metaplex_attributes(
        profile_data: Dict[str, Any],
    ) -> List[Dict[str, str]]:
        """
        Maps a dynamic profile JSON to Metaplex standard attributes for NFTs.
        """
        attributes = []
        for key, value in profile_data.items():
            if value is None:
                continue

            # Format the label by replacing underscores with spaces and capitalizing
            label = key.replace("_", " ").title()

            # Convert values to strings for on-chain compatibility
            str_value = (
                str(value)
                if not isinstance(value, list)
                else ", ".join(map(str, value))
            )

            attributes.append({"trait_type": label, "value": str_value})

        return attributes
class UserService:
    # DEPRECATED: Please use ProfileService (server/modules/profile/service.py) which uses SQLAlchemy
    # Cache for 2 minutes (120 seconds) with max 1000 items
    _PROFILE_CACHE = TTLCache(maxsize=1000, ttl=120)

    @staticmethod
    async def get_full_profile(user_identifier: str) -> Dict[str, Any]:
        """
        Fetches the complete normalized profile using parallel queries and Redis TTL caching.
        """
        from core.redis import redis_get, redis_set
        cache_key = f"profile:full:{user_identifier}"
        cached_profile = await redis_get(cache_key)
        if cached_profile:
            return cached_profile

        import uuid
        def is_valid_uuid(val):
            try:
                uuid.UUID(str(val))
                return True
            except ValueError:
                return False

        is_uuid = is_valid_uuid(user_identifier)

        db = get_db()
        if not db: return {}

        async def run_user_q():
            if is_uuid:
                return await db.table("users").select("*, profiles(*)").eq("id", user_identifier).execute()
            else:
                return await db.table("users").select("*, profiles(*)").eq("username", user_identifier.lower()).execute()

        res_user = await run_user_q()
        user_data = res_user.data[0] if res_user.data else {}
        actual_user_id = user_data.get("id")
        
        if not actual_user_id:
            return {}

        # Define wrapper functions that are async natively
        async def run_q(table, select="*", order_by=None, desc=True, single=False):
            q = db.table(table).select(select).eq("user_id", actual_user_id)
            if order_by:
                q = q.order(order_by, desc=desc)
            res = q.single().execute() if single else q.execute()
            return await res

        profiles_raw = user_data.get("profiles", {})
        profiles_cleaned = profiles_raw[0] if isinstance(profiles_raw, list) and profiles_raw else (profiles_raw or {})
        profile_id = profiles_cleaned.get("id")
        
        async def run_profile_q(table, order_by=None):
            if not profile_id:
                return type('obj', (object,), {'data': []})()
            q = db.table(table).select("*").eq("profile_id", profile_id)
            if order_by:
                q = q.order(order_by, desc=True)
            return await q.execute()
        try:
            # Native parallel fetch without blocking threads
            res_skills, res_exp, res_proj, res_edu, res_scores = await asyncio.gather(
                run_q("user_skills_relational", "*, skills(name, category)"),
                run_profile_q("experiences", "start_date"),
                run_profile_q("projects"),
                run_profile_q("educations", "start_date"),
                run_q("ai_scores", "*")
            )
        except Exception as e:
            print(f"Parallel fetch error: {e}. Falling back to sequential.")
            res_user = await run_user_q()
            user_data = res_user.data[0] if res_user.data else {}
            profiles_raw = user_data.get("profiles", {})
            profiles_cleaned = profiles_raw[0] if isinstance(profiles_raw, list) and profiles_raw else (profiles_raw or {})
            profile_id = profiles_cleaned.get("id")
            
            try: res_skills = await run_q("user_skills_relational", "*, skills(name, category)")
            except: res_skills = type('obj', (object,), {'data': []})()
            try: res_exp = await db.table("experiences").select("*").eq("profile_id", profile_id).order("start_date", desc=True).execute() if profile_id else type('obj', (object,), {'data': []})()
            except: res_exp = type('obj', (object,), {'data': []})()
            try: res_proj = await db.table("projects").select("*").eq("profile_id", profile_id).execute() if profile_id else type('obj', (object,), {'data': []})()
            except: res_proj = type('obj', (object,), {'data': []})()
            try: res_edu = await db.table("educations").select("*").eq("profile_id", profile_id).order("start_date", desc=True).execute() if profile_id else type('obj', (object,), {'data': []})()
            except: res_edu = type('obj', (object,), {'data': []})()
            try: res_scores = await run_q("ai_scores", "*")
            except: res_scores = type('obj', (object,), {'data': []})()
        
        user_data = res_user.data[0] if res_user.data else {}
        skills_data = res_skills.data if res_skills.data else []
        exp_data = res_exp.data if res_exp.data else []
        proj_data = res_proj.data if res_proj.data else []
        edu_data = res_edu.data if res_edu.data else []
        scores_data = res_scores.data[0] if res_scores.data else {}

        # Aggregate into a structured response
        profiles_raw = user_data.get("profiles", {})
        profiles_cleaned = profiles_raw[0] if isinstance(profiles_raw, list) and profiles_raw else (profiles_raw or {})
        
        result = {
            "profile": {
                "user_id": actual_user_id,
                "user_code": user_data.get("user_code"),
                "username": user_data.get("username"),
                "email": user_data.get("email"),
                "visibility": user_data.get("visibility"),
                "avatar_url": user_data.get("avatar_url"),
                "github_data": user_data.get("github_data"),
                "dynamic_profile_data": user_data.get("dynamic_profile_data"),
                **profiles_cleaned
            },
            "skills": [
                {"name": s["skills"]["name"], "category": s["skills"]["category"], "proficiency": s["proficiency_level"], "verified": s["is_verified"]}
                for s in skills_data if s.get("skills")
            ],
            "experiences": exp_data,
            "projects": proj_data,
            "education": edu_data,
            "ai_scores": scores_data
        }

        # Update Cache
        UserService._PROFILE_CACHE[user_identifier] = result
        await redis_set(cache_key, result, ttl_seconds=1800) # 30 min cache
        if user_data.get("username"):
             await redis_set(f"profile:full:{user_data['username'].lower()}", result, ttl_seconds=1800)
             
        return result

    @staticmethod
    async def update_profile(user_id: str, data: Dict[str, Any]):
        """
        Professional relational update flow with batch processing and dictionary linking.
        """
        from core.redis import redis_delete
        await redis_delete(f"profile:full:{user_id}")
        
        db = get_db()
        if not db: return {"status": "error", "message": "Database connection failed"}

        # 1. Update Core Profile & User Metadata
        if "profile" in data:
            p = data["profile"]
            
            # Fetch existing profile first
            existing = await db.table("profiles").select("id").eq("user_id", user_id).execute()
            
            profile_payload = {
                "user_id": user_id,
                "headline": p.get("headline"),
                "about": p.get("bio") or p.get("about"),
                "banner_url": p.get("banner_url"),
                "visibility_mode": p.get("visibility"),
                "location": p.get("location"),
                "full_name": p.get("full_name"),
                "phone": p.get("phone")
            }
            # Clean None values so we don't accidentally wipe existing DB fields
            profile_payload = {k: v for k, v in profile_payload.items() if v is not None}
            
            # Additional fields to track in users dynamic profile data
            u_meta = {}
            dynamic_updates = {}
            if "experience_level" in p: dynamic_updates["experienceLevel"] = p["experience_level"]
            if "job_type" in p: dynamic_updates["jobType"] = p["job_type"]
            
            if dynamic_updates:
                # Need to merge with existing dynamic_profile_data
                existing_user = await db.table("users").select("dynamic_profile_data").eq("id", user_id).execute()
                current_dyn = existing_user.data[0].get("dynamic_profile_data") if existing_user.data else {}
                if not current_dyn: current_dyn = {}
                current_dyn.update(dynamic_updates)
                u_meta["dynamic_profile_data"] = current_dyn

            
            if existing.data:
                await db.table("profiles").update(profile_payload).eq("id", existing.data[0]["id"]).execute()
                profile_id = existing.data[0]["id"]
            else:
                res_ins = await db.table("profiles").insert(profile_payload).execute()
                profile_id = res_ins.data[0]["id"] if res_ins.data else None
            
            if "username" in p: u_meta["username"] = p["username"]
            if "avatar_url" in p: u_meta["avatar_url"] = p["avatar_url"]
            if "dynamic_profile_data" in p: 
                if "dynamic_profile_data" in u_meta:
                    u_meta["dynamic_profile_data"].update(p["dynamic_profile_data"])
                else:
                    u_meta["dynamic_profile_data"] = p["dynamic_profile_data"]
            if u_meta:
                await db.table("users").update(u_meta).eq("id", user_id).execute()
        else:
            existing = await db.table("profiles").select("id").eq("user_id", user_id).execute()
            profile_id = existing.data[0]["id"] if existing.data else None

        if profile_id:
            # 2. Batch Update Experiences
            if "experiences" in data:
                await db.table("experiences").delete().eq("profile_id", profile_id).execute()
                import datetime
                def parse_date(d_str):
                    if not d_str: return None
                    d_str = str(d_str).strip()
                    try:
                        if len(d_str) == 4: return datetime.date(int(d_str), 1, 1)
                        if len(d_str) == 7: return datetime.date(int(d_str[:4]), int(d_str[5:]), 1)
                        if len(d_str) >= 10: return datetime.date.fromisoformat(d_str[:10])
                    except: pass
                    return None
                
                exps = []
                for exp in data["experiences"]:
                    parsed_exp = {**exp, "profile_id": profile_id}
                    if "start_date" in parsed_exp and parsed_exp["start_date"]:
                        parsed_exp["start_date"] = parse_date(parsed_exp["start_date"])
                    if "end_date" in parsed_exp and parsed_exp["end_date"]:
                        parsed_exp["end_date"] = parse_date(parsed_exp["end_date"])
                    exps.append(parsed_exp)
                    
                if exps: await db.table("experiences").insert(exps).execute()

            # 3. Batch Update Projects
            if "projects" in data:
                await db.table("projects").delete().eq("profile_id", profile_id).execute()
                projs = [{**proj, "profile_id": profile_id} for proj in data["projects"]]
                if projs: await db.table("projects").insert(projs).execute()

            # 4. Batch Update Education
            if "education" in data:
                await db.table("educations").delete().eq("profile_id", profile_id).execute()
                edus = []
                for edu in data["education"]:
                    parsed_edu = {**edu, "profile_id": profile_id}
                    if "start_date" in parsed_edu and parsed_edu["start_date"]:
                        parsed_edu["start_date"] = parse_date(parsed_edu["start_date"])
                    if "end_date" in parsed_edu and parsed_edu["end_date"]:
                        parsed_edu["end_date"] = parse_date(parsed_edu["end_date"])
                    edus.append(parsed_edu)
                if edus: await db.table("educations").insert(edus).execute()

        # 5. Professional Skill Linking (Dictionary Pattern)
        if "skills" in data:
            # skills format expected: [{"name": "Python", "proficiency": "Expert"}]
            await db.table("user_skills_relational").delete().eq("user_id", user_id).execute()
            
            for s_item in data["skills"]:
                s_name = s_item["name"]
                # Find or Create Skill in Dictionary
                skill_res = await db.table("skills").select("id").eq("name", s_name).execute()
                if not skill_res.data:
                    skill_res = await db.table("skills").insert({"name": s_name, "category": s_item.get("category")}).execute()
                
                skill_id = skill_res.data[0]["id"]
                # Link User to Skill
                await db.table("user_skills_relational").insert({
                    "user_id": user_id,
                    "skill_id": skill_id,
                    "proficiency_level": s_item.get("proficiency", "Intermediate")
                }).execute()

        # Invalidate Cache after update
        if user_id in UserService._PROFILE_CACHE:
            del UserService._PROFILE_CACHE[user_id]

        return {"status": "success"}

    @staticmethod
    async def get_portfolio_by_code(user_code: str) -> Optional[Dict[str, Any]]:
        """
        Public portfolio resolver by user_code.
        """
        db = get_db()
        user_res = db.table("users").select("id, visibility").eq("user_code", user_code).execute()
        if not user_res.data:
            return None
        
        user = user_res.data[0]
        if user["visibility"] == "private":
            return None # Hidden
            
        return await UserService.get_full_profile(user["id"])
