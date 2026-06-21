import pytest
from fastapi.testclient import TestClient
from main import app
from modules.auth.core.service import get_current_user
from core.database import get_db_session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from core.database import Base

import os
import socket

def get_db_host():
    if os.getenv("DB_HOST"):
        return os.getenv("DB_HOST")
    try:
        socket.gethostbyname("db")
        return "db"
    except socket.error:
        return "localhost"

# Setup PostgreSQL database for testing
POSTGRES_USER = os.getenv("POSTGRES_USER", "postgres")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "password")
DB_HOST = get_db_host()

default_port = "5432" if DB_HOST == "db" else "5433"
DB_PORT = os.getenv("DB_PORT", default_port)
SQLALCHEMY_DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{DB_HOST}:{DB_PORT}/test_db"
ASYNC_DATABASE_URL = f"postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{DB_HOST}:{DB_PORT}/test_db"

from core.config import settings
settings.DATABASE_URL = ASYNC_DATABASE_URL

engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
async_engine = create_async_engine(ASYNC_DATABASE_URL)

TestingAsyncSessionLocal = sessionmaker(
    bind=async_engine, class_=AsyncSession, expire_on_commit=False
)

async def override_get_db():
    async with TestingAsyncSessionLocal() as session:
        yield session

def override_get_current_user():
    return {"sub": "6902cee5-5515-40a3-bf71-285a7ab01061", "email": "test@example.com", "role": "user"}

app.dependency_overrides[get_db_session] = override_get_db
app.dependency_overrides[get_current_user] = override_get_current_user

@pytest.fixture(scope="session")
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="module")
def client(setup_db):
    with TestClient(app) as c:
        yield c
