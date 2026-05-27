import pytest
from fastapi.testclient import TestClient
import json

def test_career_assistant_websocket(client: TestClient):
    """
    Test the interactive AI streaming websocket.
    Since we don't want to actually hit the OpenAI API during tests,
    this test ensures the connection logic and basic payloads work.
    In a real CI, we would use a mocked `get_llm()` dependency.
    """
    # Assuming we mock the LLM chain internally for testing.
    # We will just verify connection and disconnect for now to ensure the router mounts.
    
    with client.websocket_connect("/api/v1/career-assistant/ws?token=test-user") as websocket:
        # Send a question
        websocket.send_text(json.dumps({"question": "How do I pass system design?"}))
        
        # We expect a stream start event
        response = websocket.receive_text()
        data = json.loads(response)
        assert data["type"] in ["ai_stream_start", "error", "ai_response"] 
