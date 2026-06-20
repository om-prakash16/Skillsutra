import json
import time
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db_session
from core.authz import RequirePermission
from modules.auth.core.service import get_current_user
from modules.ai.providers import get_ai_provider
from models.ai import AIChatConversation, AIChatMessage, AIUsageLog

router = APIRouter(prefix="/ai/chat", tags=["AI Chat"])

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    model_id: str = "gemini-1.5-pro" # Mapped to our DB or Provider Registry
    provider: str = "gemini"
    messages: List[ChatMessage]
    conversation_id: Optional[str] = None
    temperature: float = 0.7
    stream: bool = True

@router.post("/completions")
async def chat_completions(
    req: ChatRequest,
    request: Request,
    db: AsyncSession = Depends(get_db_session),
    user: dict = Depends(get_current_user)
):
    """
    Unified AI Chat Completions Endpoint.
    Supports streaming and automatically tracks token usage and history.
    """
    tenant_id = request.headers.get("X-Tenant-ID")
    
    # In a full implementation, we'd look up the model_id in the AIModel table 
    # to verify access and get the provider credentials.
    provider_client = get_ai_provider(req.provider, req.model_id)
    
    formatted_messages = [{"role": m.role, "content": m.content} for m in req.messages]
    
    if req.stream:
        async def stream_generator():
            start_time = time.time()
            full_response = ""
            
            try:
                # We yield SSE formatted chunks
                async for chunk in provider_client.stream_chat(formatted_messages, req.temperature):
                    full_response += chunk
                    yield f"data: {json.dumps({'content': chunk})}\n\n"
                    
                # Done
                yield "data: [DONE]\n\n"
                
                # Log usage asynchronously after completion (or do it right here)
                latency = int((time.time() - start_time) * 1000)
                await log_ai_usage(
                    db=db, 
                    user_id=user.get("id"),
                    tenant_id=tenant_id,
                    provider=req.provider,
                    model=req.model_id,
                    latency_ms=latency,
                    # Rough token estimation for streaming if provider doesn't return it
                    # Real enterprise apps use tiktoken or provider specific counting
                    input_tokens=sum(len(m.content) // 4 for m in req.messages),
                    output_tokens=len(full_response) // 4
                )
                
            except Exception as e:
                yield f"data: {json.dumps({'error': str(e)})}\n\n"
                
        return StreamingResponse(stream_generator(), media_type="text/event-stream")
        
    else:
        # Non-streaming
        start_time = time.time()
        response_text = await provider_client.generate_chat(formatted_messages, req.temperature)
        latency = int((time.time() - start_time) * 1000)
        
        # Log usage
        await log_ai_usage(
            db=db, 
            user_id=user.get("id"),
            tenant_id=tenant_id,
            provider=req.provider,
            model=req.model_id,
            latency_ms=latency,
            input_tokens=sum(len(m.content) // 4 for m in req.messages),
            output_tokens=len(response_text) // 4
        )
        
        return {
            "success": True,
            "data": {
                "role": "assistant",
                "content": response_text
            }
        }


async def log_ai_usage(db: AsyncSession, user_id: str, tenant_id: str, provider: str, model: str, latency_ms: int, input_tokens: int, output_tokens: int):
    # Log usage to AIUsageLog table
    log_entry = AIUsageLog(
        user_id=user_id,
        organization_id=tenant_id,
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        latency_ms=latency_ms,
        endpoint="/ai/chat/completions"
    )
    db.add(log_entry)
    await db.commit()
