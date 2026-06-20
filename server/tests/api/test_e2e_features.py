import pytest
from fastapi.testclient import TestClient
import uuid

@pytest.fixture
def mock_user_id():
    return uuid.uuid4()

@pytest.fixture
def override_auth_for_e2e(mock_user_id):
    from main import app
    from modules.auth.core.service import get_current_user
    
    async def mock_get_current_user():
        return {
            "id": str(mock_user_id),
            "sub": str(mock_user_id),
            "roles": ["user"],
            "email": "e2e_tester@example.com",
            "name": "E2E Tester"
        }
        
    original_override = app.dependency_overrides.get(get_current_user)
    app.dependency_overrides[get_current_user] = mock_get_current_user
    yield str(mock_user_id)
    if original_override:
        app.dependency_overrides[get_current_user] = original_override
    else:
        app.dependency_overrides.pop(get_current_user, None)

def test_auth_and_post_and_message(client: TestClient, mock_user_id, override_auth_for_e2e):
    # 1. Setup Users in DB to avoid foreign key issues
    from tests.conftest import TestingSessionLocal
    from models.user import User
    
    db = TestingSessionLocal()
    target_user_id = uuid.uuid4()
    
    try:
        user1 = User(id=mock_user_id, email="e2e_tester@example.com", username="e2e1", first_name="E2E", last_name="1", password_hash="pw")
        user2 = User(id=target_user_id, email="e2e_target@example.com", username="e2e2", first_name="E2E", last_name="2", password_hash="pw")
        db.add(user1)
        db.add(user2)
        db.commit()
    finally:
        db.close()

    # 2. Test Post (Feed)
    post_resp = client.post(
        "/api/v1/feed/posts",
        json={"content_markdown": "Hello world from e2e test!", "visibility": "PUBLIC", "media": []}
    )
    assert post_resp.status_code == 200, f"Post failed: {post_resp.text}"
    assert "data" in post_resp.json()
    print("Post success!")
    
    # 3. Test Messages (Start conversation and send message)
    conv_resp = client.post(
        "/api/v1/messages/start",
        json={"receiver_id": str(target_user_id), "initial_message": "Hello from pytest!"}
    )
    assert conv_resp.status_code == 200, f"Start conv failed: {conv_resp.text}"
    conv_id = conv_resp.json()["data"]["conversation_id"]
    print("Conversation start success!")
    
    msg_resp = client.post(
        f"/api/v1/messages/{conv_id}/send",
        json={"content": "Hey there!", "conversation_id": conv_id}
    )
    assert msg_resp.status_code == 200, f"Send message failed: {msg_resp.text}"
    print("Message send success!")
