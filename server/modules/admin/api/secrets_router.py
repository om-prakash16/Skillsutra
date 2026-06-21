from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from typing import List, Dict, Any
from pydantic import BaseModel, Field
import uuid

from core.database import get_db
from models.user import User
from models.secrets import Secret
from models.audit import AuditLog
from api.dependencies.auth import get_current_user
from core.encryption import encrypt_secret, decrypt_secret

router = APIRouter()

# Schema for Secret
class SecretCreate(BaseModel):
    name: str = Field(..., description="Unique name for the secret")
    value: str = Field(..., description="The raw secret value")
    description: str | None = None
    category: str = "GENERAL"
    environment: str = "PRODUCTION"

class SecretUpdate(BaseModel):
    value: str | None = None
    description: str | None = None
    is_active: bool | None = None

class SecretResponse(BaseModel):
    id: uuid.UUID
    name: str
    description: str | None
    category: str
    environment: str
    is_active: bool
    created_at: Any
    updated_at: Any
    
    class Config:
        from_attributes = True

class DecryptedSecretResponse(SecretResponse):
    value: str

def require_super_admin(user: User = Depends(get_current_user)):
    if user.role not in ["admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Not authorized. Super Admin only.")
    return user

@router.get("/", response_model=List[SecretResponse])
async def list_secrets(
    db: Session = Depends(get_db),
    admin: User = Depends(require_super_admin)
):
    """List all secrets metadata (values are hidden)."""
    result = await db.execute(select(Secret).order_by(Secret.name))
    secrets = result.scalars().all()
    return secrets

@router.post("/", response_model=SecretResponse, status_code=status.HTTP_201_CREATED)
async def create_secret(
    secret_in: SecretCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_super_admin)
):
    """Store a new secret securely."""
    encrypted_val = encrypt_secret(secret_in.value)
    
    new_secret = Secret(
        name=secret_in.name,
        description=secret_in.description,
        encrypted_value=encrypted_val,
        category=secret_in.category,
        environment=secret_in.environment,
        created_by=admin.id
    )
    
    db.add(new_secret)
    
    # Log Audit
    audit = AuditLog(
        user_id=admin.id,
        action="SECRET_CREATED",
        resource_type="SECRET",
        details={"secret_name": secret_in.name}
    )
    db.add(audit)
    
    try:
        await db.commit()
        await db.refresh(new_secret)
        return new_secret
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Secret with this name already exists")

@router.get("/{secret_id}", response_model=DecryptedSecretResponse)
async def get_decrypted_secret(
    secret_id: uuid.UUID,
    db: Session = Depends(get_db),
    admin: User = Depends(require_super_admin)
):
    """Retrieve and decrypt a specific secret."""
    result = await db.execute(select(Secret).where(Secret.id == secret_id))
    secret = result.scalars().first()
    
    if not secret:
        raise HTTPException(status_code=404, detail="Secret not found")
        
    # Log that someone accessed a secret payload
    audit = AuditLog(
        user_id=admin.id,
        action="SECRET_ACCESSED",
        resource_type="SECRET",
        resource_id=str(secret.id),
        details={"secret_name": secret.name}
    )
    db.add(audit)
    await db.commit()
    
    decrypted_val = decrypt_secret(secret.encrypted_value)
    
    response_data = {
        **secret.__dict__,
        "value": decrypted_val
    }
    return response_data

@router.patch("/{secret_id}", response_model=SecretResponse)
async def update_secret(
    secret_id: uuid.UUID,
    secret_in: SecretUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_super_admin)
):
    result = await db.execute(select(Secret).where(Secret.id == secret_id))
    secret = result.scalars().first()
    
    if not secret:
        raise HTTPException(status_code=404, detail="Secret not found")
        
    if secret_in.value is not None:
        secret.encrypted_value = encrypt_secret(secret_in.value)
    if secret_in.description is not None:
        secret.description = secret_in.description
    if secret_in.is_active is not None:
        secret.is_active = secret_in.is_active
        
    # Log Audit
    audit = AuditLog(
        user_id=admin.id,
        action="SECRET_UPDATED",
        resource_type="SECRET",
        resource_id=str(secret.id),
        details={"secret_name": secret.name}
    )
    db.add(audit)
    
    await db.commit()
    await db.refresh(secret)
    return secret

@router.delete("/{secret_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_secret(
    secret_id: uuid.UUID,
    db: Session = Depends(get_db),
    admin: User = Depends(require_super_admin)
):
    result = await db.execute(select(Secret).where(Secret.id == secret_id))
    secret = result.scalars().first()
    
    if not secret:
        raise HTTPException(status_code=404, detail="Secret not found")
        
    # Log Audit
    audit = AuditLog(
        user_id=admin.id,
        action="SECRET_DELETED",
        resource_type="SECRET",
        resource_id=str(secret.id),
        details={"secret_name": secret.name}
    )
    db.add(audit)
    
    await db.delete(secret)
    await db.commit()
    return None
