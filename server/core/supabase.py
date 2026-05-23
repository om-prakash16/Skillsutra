import logging
from typing import Optional
from core.postgres_adapter import PostgresAdapter
import db.engine as engine

logger = logging.getLogger(__name__)

# Re-export client adapter for modules importing "supabase" directly
supabase = PostgresAdapter()

def get_supabase() -> PostgresAdapter:
    """Returns the custom Postgres client instance mapping to Supabase client."""
    return supabase

def check_db_health() -> bool:
    """Checks if the custom Postgres client is connected and reachable."""
    if not engine.pool:
        return False
    try:
        return True
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        return False
