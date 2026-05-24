from pydantic import BaseModel
from typing import Optional


class UserSyncRequest(BaseModel):
    """Request body for POST /auth/sync — syncs Keycloak user to local DB."""
    requested_role: Optional[str] = None


class RoleAssignRequest(BaseModel):
    """Request body for POST /auth/assign-role — admin role assignment."""
    user_id: str
    role: str


class AuthTokenResponse(BaseModel):
    """Standard auth response shape."""
    user_id: str
    keycloak_id: str
    email: str
    name: str
    roles: list[str]
    user_code: Optional[str] = None


class CompanyCreate(BaseModel):
    name: str


class CompanyInvite(BaseModel):
    company_id: str
    email: str
    role: str = "VIEWER"


class ApiKeyCreate(BaseModel):
    label: str
    scopes: Optional[list[str]] = ["read.proof_score", "read.skills"]
