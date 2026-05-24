"""
Database access module.

Preferred import for new code:
    from core.db import get_db
"""

from core.postgres_adapter import PostgresAdapter

# Singleton adapter instance
_db = PostgresAdapter()

def get_db() -> PostgresAdapter:
    """Returns the PostgresAdapter instance for database queries."""
    return _db
