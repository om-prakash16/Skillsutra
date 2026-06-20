from sqlalchemy import Column, String, Boolean, Integer, Float, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from core.database import Base
from models.mixins import EnterpriseMixin

class AIProvider(EnterpriseMixin, Base):
    __tablename__ = "ai_providers"
    
    name = Column(String, unique=True, index=True, nullable=False) # e.g. "openai", "gemini", "anthropic"
    is_active = Column(Boolean, default=True)
    api_key_secret_ref = Column(String, nullable=True) # Ref to HashiCorp Vault or KMS, NEVER store raw key here
    default_base_url = Column(String, nullable=True)

class AIModel(EnterpriseMixin, Base):
    __tablename__ = "ai_models"
    
    name = Column(String, unique=True, index=True, nullable=False) # e.g. "gpt-4o", "gemini-1.5-pro"
    provider_id = Column(UUID(as_uuid=True), ForeignKey("ai_providers.id", ondelete="CASCADE"), nullable=False)
    
    context_window = Column(Integer, default=8192)
    max_output_tokens = Column(Integer, default=4096)
    
    # Cost per 1M tokens in USD
    cost_input_1m = Column(Float, default=0.0)
    cost_output_1m = Column(Float, default=0.0)
    
    supports_vision = Column(Boolean, default=False)
    supports_tools = Column(Boolean, default=False)
    supports_json = Column(Boolean, default=False)
    supports_streaming = Column(Boolean, default=True)
    
    is_active = Column(Boolean, default=True)
    provider = relationship("AIProvider")

class AIPrompt(EnterpriseMixin, Base):
    __tablename__ = "ai_prompts"
    
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=True)
    tags = Column(JSONB, default=list)

class AIPromptVersion(EnterpriseMixin, Base):
    __tablename__ = "ai_prompt_versions"
    
    prompt_id = Column(UUID(as_uuid=True), ForeignKey("ai_prompts.id", ondelete="CASCADE"), nullable=False)
    version_number = Column(Integer, nullable=False)
    
    system_prompt = Column(Text, nullable=False)
    user_prompt_template = Column(Text, nullable=False)
    variables = Column(JSONB, default=list) # e.g., ["user_name", "context"]
    
    model_id = Column(UUID(as_uuid=True), ForeignKey("ai_models.id", ondelete="SET NULL"), nullable=True)
    temperature = Column(Float, default=0.7)
    
    is_published = Column(Boolean, default=False)
    
    prompt = relationship("AIPrompt")
    model = relationship("AIModel")

class AIChatConversation(EnterpriseMixin, Base):
    __tablename__ = "ai_conversations"
    
    title = Column(String, nullable=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    model_id = Column(UUID(as_uuid=True), ForeignKey("ai_models.id", ondelete="SET NULL"), nullable=True)
    
    summary = Column(Text, nullable=True)
    tags = Column(JSONB, default=list)

class AIChatMessage(EnterpriseMixin, Base):
    __tablename__ = "ai_messages"
    
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("ai_conversations.id", ondelete="CASCADE"), nullable=False)
    role = Column(String, nullable=False) # "system", "user", "assistant", "tool"
    content = Column(Text, nullable=False)
    
    input_tokens = Column(Integer, default=0)
    output_tokens = Column(Integer, default=0)
    
    metadata_json = Column(JSONB, default=dict) # E.g., citations, tool calls

class AIDocument(EnterpriseMixin, Base):
    __tablename__ = "ai_documents"
    
    title = Column(String, nullable=False)
    source_url = Column(String, nullable=True)
    content_type = Column(String, nullable=False) # "markdown", "pdf", "html"
    status = Column(String, default="pending") # "pending", "processing", "indexed", "failed"
    metadata_json = Column(JSONB, default=dict)

class AIDocumentChunk(EnterpriseMixin, Base):
    __tablename__ = "ai_chunks"
    
    document_id = Column(UUID(as_uuid=True), ForeignKey("ai_documents.id", ondelete="CASCADE"), nullable=False)
    chunk_index = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    
    # 768 matches Gemini text-embedding-004 standard
    embedding = Column(Vector(768), nullable=True) 

class AIUsageLog(EnterpriseMixin, Base):
    __tablename__ = "ai_usage"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    model_id = Column(UUID(as_uuid=True), ForeignKey("ai_models.id", ondelete="SET NULL"), nullable=True)
    
    input_tokens = Column(Integer, default=0)
    output_tokens = Column(Integer, default=0)
    total_cost_usd = Column(Float, default=0.0)
    
    latency_ms = Column(Integer, default=0)
    endpoint = Column(String, nullable=True)
