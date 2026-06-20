import pytest
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient
import uuid

# In tests/api/test_auth.py we will mock httpx.AsyncClient to simulate github auth
@pytest.mark.asyncio
async def test_github_oauth_seamless_login_or_register(client: TestClient):
    from models.user import User
    import base64
    import json

    # 1. Create a user first to simulate "User already registered"
    user_id = uuid.uuid4()
    test_user = User(
        id=user_id,
        email="test_seamless@example.com",
        username="test-seamless",
        is_active=True,
        is_verified=True,
        auth_provider="email",
        password_hash="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjIQqiRQYq"
    )
    from tests.conftest import TestingSessionLocal
    db_session = TestingSessionLocal()
    try:
        db_session.add(test_user)
        db_session.commit()
    finally:
        db_session.close()

    # 2. Mock httpx to return fake tokens and profile
    from unittest.mock import MagicMock
    async def mock_post(*args, **kwargs):
        mock_response = AsyncMock()
        mock_response.json = MagicMock(return_value={"access_token": "fake_github_token"})
        return mock_response

    async def mock_get(url, *args, **kwargs):
        mock_response = AsyncMock()
        if "user/emails" in url:
            mock_response.json = MagicMock(return_value=[{"email": "test_seamless@example.com", "primary": True}])
        else:
            mock_response.json = MagicMock(return_value={
                "id": 123456,
                "login": "test_seamless_github",
                "name": "Test Seamless",
                "avatar_url": "http://example.com/avatar.png"
            })
        return mock_response

    with patch("httpx.AsyncClient.post", side_effect=mock_post):
        with patch("httpx.AsyncClient.get", side_effect=mock_get):
            with patch("services.oauth_service.OAuthService._handle_oauth_user", new_callable=AsyncMock) as mock_handle_user:
                mock_handle_user.return_value = (test_user, "mock_access_token", "mock_refresh_token")
                # Send an intent=register
                state_payload = {"intent": "register"}
                state = base64.b64encode(json.dumps(state_payload).encode()).decode()

                response = client.post(
                    "/api/v1/auth/oauth/github/callback",
                    json={
                        "code": "fake_code_123",
                        "state": state
                    }
                )

                assert response.status_code == 200
                data = response.json()
                assert "access_token" in data
                assert data["access_token"] == "mock_access_token"
                assert "refresh_token" in data
                assert data["token_type"] == "bearer"
