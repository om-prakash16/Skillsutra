from typing import List
from fastapi import Depends, HTTPException
from core.exceptions import AuthorizationError
from modules.auth.core.service import get_current_user

class RoleChecker:
    """
    Enterprise Role-Based Access Control (RBAC) Dependency.
    Enforces that the user possesses at least one of the allowed roles.
    """
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, user: dict = Depends(get_current_user)) -> dict:
        user_roles = user.get("roles", [])
        
        # Super Admins bypass role checks
        if "SUPER_ADMIN" in user_roles:
            return user
            
        has_role = any(role in self.allowed_roles for role in user_roles)
        
        if not has_role:
            raise AuthorizationError(
                message=f"Access denied. Requires one of roles: {self.allowed_roles}"
            )
            
        return user
