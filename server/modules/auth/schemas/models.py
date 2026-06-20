from pydantic import BaseModel
from typing import Optional


class CompanyCreate(BaseModel):
    name: str


class CompanyInvite(BaseModel):
    company_id: Optional[str] = None
    email: str
    role: str = "VIEWER"


class ApiKeyCreate(BaseModel):
    label: str
    scopes: Optional[list[str]] = ["read.proof_score", "read.skills"]
