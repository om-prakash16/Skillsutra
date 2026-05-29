import re
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, validator
from uuid import UUID

class UserCreate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    username: str = Field(..., min_length=3)
    email: EmailStr
    password: str = Field(..., min_length=8)
    
    @validator("password")
    def password_complexity(cls, v):
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one digit")
        return v

class UserLogin(BaseModel):
    email_or_username: str
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    id: UUID
    username: str
    email: EmailStr
    is_active: bool

    class Config:
        from_attributes = True

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class OAuthCallback(BaseModel):
    code: str
    state: Optional[str] = None

class GoogleAuthRequest(BaseModel):
    id_token: str
    role: Optional[str] = "user"

class MagicLinkRequest(BaseModel):
    email: EmailStr

class MagicLinkVerify(BaseModel):
    token: str
