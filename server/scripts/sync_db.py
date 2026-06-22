import os
import sys
from sqlalchemy import create_engine
import importlib

# Add the parent directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.database import Base

# Import all models to register them with Base.metadata
import models.user
import models.admin
import models.oauth
import models.cms
import models.communication
import models.builder
import models.talent

import models.ats
import models.authz
import models.billing
import models.iam
import models.organization
import models.operations
import models.secrets

def sync_db():
    db_url = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/skillsutra")
    # Make sure it's not using asyncpg for create_all
    if "asyncpg" in db_url:
        db_url = db_url.replace("+asyncpg", "")
    
    print(f"Connecting to {db_url}...")
    engine = create_engine(db_url, echo=True)
    
    print("Creating all tables...")
    Base.metadata.create_all(engine)
    print("Done!")

if __name__ == "__main__":
    sync_db()
