import pytest
from fastapi.testclient import TestClient
from main import app
from modules.auth.core.service import get_current_user
from core.database import get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from core.database import Base

# Setup an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

def override_get_current_user():
    return {"sub": "test-uuid-1234", "email": "test@example.com"}

app.dependency_overrides[get_db] = override_get_db
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
