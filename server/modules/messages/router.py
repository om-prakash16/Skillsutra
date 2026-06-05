from fastapi import APIRouter, Depends, Query, HTTPException, WebSocket, WebSocketDisconnect
from typing import Dict, Any, List
import json
from pydantic import BaseModel
from modules.auth.core.service import get_current_user
from modules.messages.service import MessageService
from modules.chat.ws_manager import manager
from core.response import success_response
from core.db import get_db

router = APIRouter()
message_service = MessageService()

class StartConversationRequest(BaseModel):
    receiver_id: str
    subject: str = ""
    initial_message: str

class SendMessageRequest(BaseModel):
    content: str

@router.get("/inbox")
async def get_inbox(current_user=Depends(get_current_user)):
    """Fetch all active conversations for the current user."""
    inbox = await message_service.get_inbox(current_user["id"])
    return success_response(data=inbox)

@router.get("/{conversation_id}/history")
async def get_history(conversation_id: str, limit: int = 50, current_user=Depends(get_current_user)):
    """Fetch history for a specific conversation."""
    try:
        history = await message_service.get_history(conversation_id, current_user["id"], limit)
        return success_response(data=history)
    except Exception as e:
        raise HTTPException(status_code=403, detail=str(e))

@router.post("/start")
async def start_conversation(req: StartConversationRequest, current_user=Depends(get_current_user)):
    """Start a new DM or append to existing direct chat."""
    try:
        result = await message_service.start_conversation(
            sender_id=current_user["id"],
            receiver_id=req.receiver_id,
            subject=req.subject,
            initial_message=req.initial_message
        )
        
        # Notify the receiver if they are online
        await manager.send_personal_message(
            {"type": "new_conversation", "conversation_id": result["conversation_id"], "message": result["message"]},
            req.receiver_id
        )
        
        return success_response(data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
@router.post("/{conversation_id}/send")
async def send_message(conversation_id: str, req: SendMessageRequest, current_user=Depends(get_current_user)):
    """Send a message (REST fallback). WebSockets should be used primarily."""
    try:
        result = await message_service.save_message(
            conversation_id=conversation_id,
            sender_id=current_user["id"],
            content=req.content
        )
        
        # Broadcast to room
        await manager.broadcast(json.dumps({"type": "message", "message": result}), conversation_id)
        
        return success_response(data=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.websocket("/ws/{conversation_id}")
async def websocket_messaging(websocket: WebSocket, conversation_id: str, token: str = Query(None)):
    user_id = token if token else "anonymous"
    
    # 1. Authorize: check if user is a participant
    if user_id == "anonymous":
        await websocket.close(code=4001, reason="Unauthorized")
        return
        
    sb = get_db()
    if sb:
        cp_resp = sb.table("conversation_participants").select("id").eq("conversation_id", conversation_id).eq("user_id", user_id).execute()
        if not cp_resp.data:
            await websocket.close(code=4003)
            return
            
    await manager.connect(websocket, room_id=conversation_id, user_id=user_id)
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)

            if payload.get("type") == "pong":
                manager.handle_pong(websocket)
                continue

            # Save message to DB
            saved_msg = await message_service.save_message(
                conversation_id=conversation_id,
                sender_id=user_id,
                content=payload.get("content", "")
            )

            # Broadcast to everyone in the conversation
            await manager.broadcast(json.dumps({"type": "message", "message": saved_msg}), conversation_id)
            
            # Update last_read_at for sender
            from datetime import datetime
            sb.table("conversation_participants").update({"last_read_at": datetime.utcnow().isoformat()}).eq("conversation_id", conversation_id).eq("user_id", user_id).execute()

    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id=conversation_id, user_id=user_id)
    except Exception as e:
        manager.disconnect(websocket, room_id=conversation_id, user_id=user_id)
