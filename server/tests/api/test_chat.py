import pytest
from fastapi.testclient import TestClient

def test_get_channels(client: TestClient):
    response = client.get("/api/v1/chat/rooms")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_websocket_chat(client: TestClient):
    room_id = "test-room"
    # Testing the WebSocket connection.
    # Note: TestClient provides a websocket context manager.
    with client.websocket_connect(f"/api/v1/chat/ws/{room_id}?token=test-token") as websocket:
        # Send a message
        websocket.send_json({"user_id": "tester", "content": "Hello World!"})
        
        # Receive the broadcasted message
        data = websocket.receive_json()
        assert data["content"] == "Hello World!"
        assert data["room_id"] == room_id
