import pytest
from fastapi.testclient import TestClient
import uuid

@pytest.fixture
def override_auth_roles():
    from main import app
    from modules.auth.core.service import get_current_user
    
    def set_roles(roles=["user"]):
        async def mock_get_current_user():
            return {
                "id": str(uuid.uuid4()),
                "sub": "mock-sub-123",
                "roles": roles,
                "email": "tester@example.com",
                "name": "Tester"
            }
        app.dependency_overrides[get_current_user] = mock_get_current_user
        
    yield set_roles
    
    # Cleanup
    app.dependency_overrides.pop(get_current_user, None)

def test_create_cms_collection_unauthorized(client: TestClient):
    # No auth override, so it should be unauthenticated/401, but actually RequirePermission checks current_user.
    # We'll just provide no headers, so the default `get_current_user` throws 401 or 403.
    response = client.post(
        "/api/v1/cms/collections",
        json={"name": "Test Collection", "slug": "test-collection", "description": "A test"}
    )
    # The default auth flow requires a token, expecting 401 or 403
    assert response.status_code in [401, 403]

def test_create_cms_collection_forbidden(client: TestClient, override_auth_roles):
    # Override auth to return a normal user
    override_auth_roles(["user"])
    
    response = client.post(
        "/api/v1/cms/collections",
        json={"name": "Test Collection", "slug": "test-collection", "description": "A test"}
    )
    # Expect 403 because normal user doesn't have `super_admin` or `admin` that grants `manage_cms` globally
    assert response.status_code == 403
    assert "Forbidden" in response.text

def test_create_cms_collection_superadmin(client: TestClient, override_auth_roles):
    # Override auth to return a super_admin
    override_auth_roles(["super_admin"])
    
    response = client.post(
        "/api/v1/cms/collections",
        json={"name": "Super Collection", "slug": "super-collection", "description": "By superadmin"}
    )
    # Expect 200 because super_admin bypasses all checks
    assert response.status_code == 200
    assert response.json()["success"] is True
    assert response.json()["data"]["slug"] == "super-collection"
