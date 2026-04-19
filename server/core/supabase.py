"""
Supabase Database Client for FastAPI Backend.
Connects Python AI services directly to the Supabase PostgreSQL database.
"""

import os
from dotenv import load_dotenv

load_dotenv()

# Try to import supabase, gracefully fallback if not installed yet
try:
    from supabase import create_client, Client

    SUPABASE_URL = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY", "")

    if SUPABASE_URL and SUPABASE_KEY:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print(f"[SUCCESS] Supabase connected successfully! (Privilege: {'System' if os.getenv('SUPABASE_SERVICE_ROLE_KEY') else 'Standard'})")
    else:
        supabase = None
        print("[WARNING] Supabase keys not found in .env - running in mock mode")

except ImportError:
    supabase = None
    print("[WARNING] supabase-py not installed - running in mock mode")


def get_supabase() -> "Client | None":
    """Returns the Supabase client instance, or None if not configured."""
    return supabase
