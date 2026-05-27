import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, Integer, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from core.database import Base

# ==========================================
# GITHUB PILLAR (PORTFOLIO & OPEN SOURCE)
# ==========================================
class DeveloperPortfolio(Base):
    __tablename__ = "developer_portfolios"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False)
    
    github_username = Column(String, nullable=True)
    engineering_maturity_score = Column(Float, default=0.0)
    language_usage_stats = Column(JSONB, default=dict)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class ProjectShowcase(Base):
    __tablename__ = "project_showcases"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    portfolio_id = Column(UUID(as_uuid=True), ForeignKey('developer_portfolios.id', ondelete='CASCADE'), nullable=False)
    
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    tech_stack = Column(JSONB, default=list)
    repo_url = Column(String, nullable=True)
    live_demo_url = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class GithubCommitSync(Base):
    __tablename__ = "github_commit_syncs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    repo_name = Column(String, nullable=False)
    commit_hash = Column(String, nullable=False)
    message = Column(Text, nullable=True)
    
    synced_at = Column(DateTime(timezone=True), default=datetime.utcnow)


# ==========================================
# DISCORD PILLAR (REALTIME CHAT)
# ==========================================
class ChatChannel(Base):
    __tablename__ = "chat_channels"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    is_voice = Column(Boolean, default=False)
    
    # Can belong to a CommunityGroup
    group_id = Column(UUID(as_uuid=True), nullable=True) 
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    channel_id = Column(UUID(as_uuid=True), ForeignKey('chat_channels.id', ondelete='CASCADE'), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    content = Column(Text, nullable=False)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)


# ==========================================
# NOTION PILLAR (KNOWLEDGE BASE)
# ==========================================
class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    owner_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class CollaborativeDocument(Base):
    __tablename__ = "collaborative_documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False)
    
    title = Column(String, nullable=False)
    content_crdt_state = Column(JSONB, default=dict) # Operational Transformation / CRDT state
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

class TaskBoard(Base):
    __tablename__ = "task_boards"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False)
    
    title = Column(String, nullable=False)
    lanes = Column(JSONB, default=list) # e.g. [{"id": "todo", "name": "To Do"}]
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
