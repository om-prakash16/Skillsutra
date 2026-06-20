from fastapi import APIRouter, Depends
from typing import Optional
from pydantic import BaseModel

from core.response import success_response
from modules.auth.core.guards import get_current_user

router = APIRouter(prefix="/messaging", tags=["Messaging & Chat"])

class MessageCreate(BaseModel):
    conversation_id: str
    content: str
    attachments: Optional[list] = []

@router.get("/conversations")
async def list_conversations(
    user = Depends(get_current_user)
):
    """
    Fetch all active conversations for the authenticated user.
    """
    # Mocking active conversations
    data = [
        {
            "id": "conv-1",
            "type": "DIRECT_MESSAGE",
            "participants": [{"id": "r1", "name": "Technical Recruiter @ Stripe"}],
            "last_message": "Are you free for a call tomorrow?",
            "unread_count": 1,
            "updated_at": "2026-06-11T12:00:00Z"
        },
        {
            "id": "conv-2",
            "type": "AI_COPILOT",
            "participants": [{"id": "ai1", "name": "SkillSutra Career AI"}],
            "last_message": "I've analyzed your resume. Here are 3 tips...",
            "unread_count": 0,
            "updated_at": "2026-06-10T15:30:00Z"
        }
    ]
    return success_response(data=data)

@router.get("/conversations/{conversation_id}/messages")
async def get_messages(
    conversation_id: str,
    user = Depends(get_current_user)
):
    """
    Fetch message history for a specific conversation.
    """
    # Mocking message history
    data = [
        {
            "id": "msg-1",
            "sender_id": "r1",
            "content": "Hi there! I saw your stellar Proof Score. Are you free for a call tomorrow?",
            "created_at": "2026-06-11T12:00:00Z",
            "is_read": False
        }
    ]
    return success_response(data=data)

@router.post("/messages")
async def send_message(
    payload: MessageCreate,
    user = Depends(get_current_user)
):
    """
    Send a new message to a conversation. 
    Triggers real-time WebSocket events and Push Notifications.
    """
    # In reality, this would insert a Message into the database
    # and publish to Redis Pub/Sub for WebSocket delivery.
    data = {
        "id": "msg-new",
        "conversation_id": payload.conversation_id,
        "sender_id": user.get("id", "current-user"),
        "content": payload.content,
        "created_at": "2026-06-11T19:25:00Z"
    }
    return success_response(data=data, message="Message sent successfully")
