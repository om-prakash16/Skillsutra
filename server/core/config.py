import os
from typing import List, Optional
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    # --- Project Metadata ---
    PROJECT_NAME: str = "SkillSutra"
    PROJECT_VERSION: str = "5.0.0"
    API_V1_STR: str = "/api/v1"
    
    # --- Infrastructure ---
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = ENVIRONMENT == "development"
    
    # --- Database (Local PostgreSQL) ---
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/skillsutra")
    
    # --- Keycloak Auth ---
    KEYCLOAK_URL: str = os.getenv("KEYCLOAK_URL", "http://localhost:8080")
    KEYCLOAK_REALM: str = os.getenv("KEYCLOAK_REALM", "skillsutra")
    KEYCLOAK_API_CLIENT_ID: str = os.getenv("KEYCLOAK_API_CLIENT_ID", "skillsutra-api")
    KEYCLOAK_API_CLIENT_SECRET: str = os.getenv("KEYCLOAK_API_CLIENT_SECRET", "")
    
    @property
    def KEYCLOAK_ISSUER(self) -> str:
        return f"{self.KEYCLOAK_URL}/realms/{self.KEYCLOAK_REALM}"
    
    @property
    def KEYCLOAK_JWKS_URL(self) -> str:
        return f"{self.KEYCLOAK_ISSUER}/protocol/openid-connect/certs"
    
    @property
    def KEYCLOAK_TOKEN_URL(self) -> str:
        return f"{self.KEYCLOAK_ISSUER}/protocol/openid-connect/token"
    
    @property
    def KEYCLOAK_ADMIN_URL(self) -> str:
        return f"{self.KEYCLOAK_URL}/admin/realms/{self.KEYCLOAK_REALM}"
    
    # --- CORS ---
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

# Global instance
settings = Settings()
