import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

_client: Client = None

def get_supabase() -> Client:
    global _client
    if not _client:
        if not SUPABASE_URL or not SUPABASE_KEY:
            # Fallback for local dev if envs aren't set
            print("WARNING: Supabase credentials missing. Check .env file.")
            return None
        _client = create_client(SUPABASE_URL, SUPABASE_KEY)
    return _client
