import os
from typing import List, Optional
from pydantic import BaseModel, Field

class Settings(BaseModel):
    # --- Project Metadata ---
    PROJECT_NAME: str = "Verified Identity Engine"
    PROJECT_VERSION: str = "4.0.0"
    API_V1_STR: str = "/api/v1"
    
    # --- Infrastructure ---
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = ENVIRONMENT == "development"
    
    # --- Database (Supabase) ---
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    # --- Security ---
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super-secure-placeholder-secret-change-me")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # --- CORS ---
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

# Global instance
settings = Settings()

# Validation check
if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
    print("WARNING: Database configuration missing. Some features may not work.")
