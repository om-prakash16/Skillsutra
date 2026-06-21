import os
from cryptography.fernet import Fernet
import base64

def get_encryption_key() -> bytes:
    """
    Get the encryption key from the environment.
    If it doesn't exist, generate a dummy one for development (NOT safe for production).
    In production, SECRET_ENCRYPTION_KEY must be a valid 32-byte url-safe base64-encoded key.
    """
    key = os.getenv("SECRET_ENCRYPTION_KEY")
    if not key:
        # Fallback for local development if not provided
        # Warning: Using a static fallback defeats encryption purposes
        fallback_key = b"A" * 32
        return base64.urlsafe_b64encode(fallback_key)
    return key.encode('utf-8')

fernet = Fernet(get_encryption_key())

def encrypt_secret(plain_text: str) -> str:
    """Encrypt a string."""
    if not plain_text:
        return ""
    return fernet.encrypt(plain_text.encode('utf-8')).decode('utf-8')

def decrypt_secret(encrypted_text: str) -> str:
    """Decrypt a string."""
    if not encrypted_text:
        return ""
    try:
        return fernet.decrypt(encrypted_text.encode('utf-8')).decode('utf-8')
    except Exception as e:
        # Log error in production
        return "ERROR_DECRYPTING"
