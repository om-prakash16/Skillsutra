from slowapi import Limiter
from slowapi.util import get_remote_address

# Global limiter instance
# In production, this should use Redis: Limiter(key_func=get_remote_address, storage_uri="redis://localhost:6379")
limiter = Limiter(key_func=get_remote_address)
