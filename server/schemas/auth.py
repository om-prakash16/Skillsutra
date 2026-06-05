import re
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, validator
from uuid import UUID

class UserCreate(BaseModel):
    name: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    username: Optional[str] = Field(None, min_length=3)
    email: EmailStr
    password: str = Field(..., min_length=8)
    role: Optional[str] = "user"
    
    @validator("password")
    def password_complexity(cls, v):
        if not re.search(r"[A-Za-z]", v):
            raise ValueError("Password must contain at least one alphabet letter")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one digit")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", v):
            raise ValueError("Password must contain at least one special character")
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
    id_token: Optional[str] = None
    access_token: Optional[str] = None
    role: Optional[str] = "user"
    intent: Optional[str] = "login"

class MagicLinkRequest(BaseModel):
    email: EmailStr

class MagicLinkVerify(BaseModel):
    token: str

class OTPRequest(BaseModel):
    email: EmailStr
    name: Optional[str] = None

class OTPVerify(BaseModel):
    email: EmailStr
    code: str

class MagicLinkSetup(BaseModel):
    token: str
    password: str = Field(..., min_length=8)
    name: Optional[str] = None
    
    @validator("password")
    def password_complexity(cls, v):
        if not re.search(r"[A-Za-z]", v):
            raise ValueError("Password must contain at least one alphabet letter")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one digit")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", v):
            raise ValueError("Password must contain at least one special character")
        return v
