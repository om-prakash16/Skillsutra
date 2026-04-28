from pydantic import BaseModel, Field
from typing import Optional, List

class WalletAuthRequest(BaseModel):
    wallet_address: str
    message: str
    signature: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    role: str

class CompanyCreate(BaseModel):
    name: str = Field(..., min_length=2)

class CompanyInvite(BaseModel):
    company_id: str
    wallet_address: str
    role: str = "MEMBER"

class ApiKeyCreate(BaseModel):
    label: str
    scopes: List[str] = ["read"]
