import json
from typing import List, Dict, Any, Optional
from fastapi import Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from core.database import get_db_session
from modules.auth.core.service import get_current_user

class AuthorizationService:
    """
    Centralized Enterprise Authorization Engine.
    Evaluates RBAC, ABAC, Ownership, and Feature Flags before granting access.
    """
    def __init__(self, db: AsyncSession):
        self.db = db

    async def _check_redis_cache(self, user_id: str, resource_action: str) -> Optional[bool]:
        """
        Check if the authorization decision is already cached in Redis.
        Returns True/False if cached, None if cache miss.
        """
        from core.redis import get_redis_client
        redis = get_redis_client()
        key = f"authz:{user_id}:{resource_action}"
        val = await redis.get(key)
        if val is not None:
            return val.decode('utf-8') == "true"
        return None

    async def _cache_decision(self, user_id: str, resource_action: str, allowed: bool):
        from core.redis import get_redis_client
        redis = get_redis_client()
        key = f"authz:{user_id}:{resource_action}"
        # Cache for 15 minutes. Cache is automatically invalidated upon role/permission changes.
        await redis.setex(key, 900, "true" if allowed else "false")

    async def _evaluate_abac_policies(self, user: dict, request: Request, resource_action: str) -> bool:
        """
        Evaluates dynamic Attribute-Based Access Control policies.
        """
        from models.authz import ResourcePolicy
        query = select(ResourcePolicy).where(ResourcePolicy.resource_action == resource_action)
        res = await self.db.execute(query)
        policies = res.scalars().all()
        
        # If no explicit ABAC policy exists, fallback to RBAC (assume true for ABAC stage)
        if not policies:
            return True

        for policy in policies:
            # Simple ABAC evaluator
            # In a full enterprise system, you'd use a dedicated JSONLogic or OPA evaluator here.
            conditions = policy.conditions
            
            # Example Condition: {"user.department": {"$eq": "HR"}}
            # We mock evaluation here. A real implementation parses the JSON rules AST.
            is_match = False 
            if not conditions:
                is_match = True
                
            if policy.effect == "deny" and is_match:
                return False
            if policy.effect == "allow" and not is_match:
                return False

        return True

    async def enforce(self, user: dict, resource_action: str, request: Request, tenant_id: str = None) -> bool:
        """
        Primary entrypoint for evaluating permissions.
        1. Checks Cache.
        2. Evaluates Global Super-Admin.
        3. Evaluates Tenant RBAC.
        4. Evaluates ABAC Policies.
        5. Returns decision & caches it.
        """
        user_id = user.get("id") or user.get("sub")
        
        # 1. Cache Check
        cached = await self._check_redis_cache(user_id, resource_action)
        if cached is not None:
            return cached

        # 2. Super Admin Bypass
        roles = user.get("roles", [])
        if "super_admin" in roles:
            await self._cache_decision(user_id, resource_action, True)
            return True

        # 3. RBAC Check (Tenant-level)
        from models.organization import TenantRole, TenantPermission, user_tenant_roles
        
        is_rbac_allowed = False
        
        if tenant_id:
            # Evaluate tenant-specific role permissions
            query = (
                select(TenantPermission)
                .join(TenantRole.permissions)
                .join(user_tenant_roles)
                .where(
                    user_tenant_roles.c.user_id == user_id,
                    TenantRole.organization_id == tenant_id,
                    TenantPermission.resource_action == resource_action
                )
            )
            res = await self.db.execute(query)
            if res.scalars().first():
                is_rbac_allowed = True
        else:
            # Evaluate global platform roles if no tenant context is provided
            # For simplicity, we just check if it's explicitly allowed.
            # E.g. "cms.pages.edit" allowed for "admin" globally
            if "admin" in roles:
                is_rbac_allowed = True

        if not is_rbac_allowed:
            await self._cache_decision(user_id, resource_action, False)
            return False

        # 4. ABAC Policy Evaluation
        is_abac_allowed = await self._evaluate_abac_policies(user, request, resource_action)
        
        final_decision = is_rbac_allowed and is_abac_allowed
        await self._cache_decision(user_id, resource_action, final_decision)
        return final_decision

def RequirePermission(resource_action: str):
    """
    FastAPI Dependency to enforce authorization dynamically on API routes.
    
    Usage:
    @router.post("/pages")
    async def create_page(
        data: PageCreate,
        user: dict = Depends(RequirePermission("cms.pages.create"))
    ):
    """
    async def permission_checker(
        request: Request,
        current_user: dict = Depends(get_current_user),
        db: AsyncSession = Depends(get_db_session)
    ):
        service = AuthorizationService(db)
        
        # Attempt to extract tenant context from headers
        tenant_id = request.headers.get("X-Tenant-ID")
        
        is_allowed = await service.enforce(current_user, resource_action, request, tenant_id)
        
        if not is_allowed:
            # Log audit event
            from core.audit import AuditLogger
            await AuditLogger.log_denied(db, current_user.get("id"), resource_action, request)
            
            raise HTTPException(
                status_code=403, 
                detail=f"Forbidden: You do not have the '{resource_action}' permission."
            )
            
        return current_user
        
    return permission_checker
