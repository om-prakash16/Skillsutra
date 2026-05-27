import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from core.websocket import manager
from core.llm.provider import get_llm
from core.llm.prompts import career_assistant_prompt
from langchain_core.output_parsers import StrOutputParser

logger = logging.getLogger(__name__)

router = APIRouter()

@router.websocket("/career-assistant/ws")
async def career_assistant_ws(websocket: WebSocket, ticket: str = Query(None)):
    """WebSocket for interacting with the AI Career Assistant in real-time."""
    if not ticket:
        await websocket.close(code=4001)
        return
        
    try:
        user_id = await manager.connect(websocket, ticket=ticket)
        # Initialize LLM chain
        llm = get_llm()
        chain = career_assistant_prompt | llm | StrOutputParser()
        
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            question = payload.get("question", "")
            
            # Context generation (In production, fetched via pgvector RAG)
            mock_context = {
                "current_role": "Backend Developer",
                "experience_level": "Mid-Level",
                "career_goal": "Senior Backend Engineer at a FAANG company",
                "recent_achievements": "Completed a Hackathon and earned 500 XP",
                "user_message": question
            }
            
            # Using async streaming to return tokens to the UI in real-time
            try:
                # We send an initialization event to the client
                await manager.send_personal_message(json.dumps({"type": "ai_stream_start"}), user_id)
                
                full_response = ""
                async for chunk in chain.astream(mock_context):
                    full_response += chunk
                    await manager.send_personal_message(
                        json.dumps({"type": "ai_stream_chunk", "content": chunk}), 
                        user_id
                    )
                
                # Send completion event
                await manager.send_personal_message(
                    json.dumps({"type": "ai_stream_end", "full_content": full_response}), 
                    user_id
                )
                
            except Exception as e:
                logger.error(f"LLM Error: {e}")
                await manager.send_personal_message(
                    json.dumps({"type": "error", "content": "Assistant is currently unavailable."}), 
                    user_id
                )
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id=user_id)
    except Exception as e:
        logger.error(f"WebSocket Error: {e}")
        manager.disconnect(websocket, user_id=user_id)
