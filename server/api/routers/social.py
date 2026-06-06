from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from uuid import UUID

from core.database import get_db_session
from models.social import Post, PostMedia, Connection, Message, Conversation, ConversationParticipant, ConnectionStatus
from schemas.social import (
    PostCreate, PostResponse,
    ConnectionCreate, ConnectionResponse,
    MessageCreate, MessageResponse,
    ConversationCreate, ConversationResponse
)
from core.dependencies import get_current_user, get_optional_current_user

router = APIRouter(prefix="/social", tags=["Social Networking"])

# ==============================================================================
# POSTS API
# ==============================================================================

@router.post("/posts", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    post_in: PostCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """Create a new social post."""
    new_post = Post(
        author_id=current_user["id"],
        content_markdown=post_in.content_markdown,
        visibility=post_in.visibility
    )
    db.add(new_post)
    await db.flush()

    for media_in in post_in.media:
        new_media = PostMedia(
            post_id=new_post.id,
            media_url=media_in.media_url,
            media_type=media_in.media_type,
            sort_order=media_in.sort_order
        )
        db.add(new_media)
        
    await db.commit()
    await db.refresh(new_post)
    
    # Dispatch background fanout to push post to followers' Redis feeds
    from modules.ecosystem.tasks import fanout_post_task
    fanout_post_task.delay(
        post_id=str(new_post.id),
        author_id=str(current_user["id"]),
        post_data={
            "id": str(new_post.id),
            "type": "POST",
            "content": {"text": new_post.content_markdown, "author_id": str(current_user["id"])},
            "created_at": new_post.created_at.isoformat() if new_post.created_at else None
        }
    )
    
    return new_post

from schemas.social import EnrichedPostResponse
from models.profile import Profile
from models.social import Reaction
from sqlalchemy.orm import selectinload
from typing import List

@router.get("/feed", response_model=List[EnrichedPostResponse])
async def get_social_feed(
    current_user: dict = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """
    Get the social feed. 
    """
    user_id = UUID(current_user["id"]) if current_user else None
    
    stmt = (
        select(Post, Profile)
        .join(Profile, Post.author_id == Profile.user_id)
        .options(selectinload(Post.media))
        .filter(Post.deleted_at == None)
        .order_by(Post.created_at.desc())
        .limit(20)
    )
    result = await db.execute(stmt)
    rows = result.all()
    
    post_ids = [row[0].id for row in rows]
    liked_post_ids = set()
    
    if post_ids and user_id:
        reaction_stmt = select(Reaction.post_id).where(
            Reaction.user_id == user_id,
            Reaction.post_id.in_(post_ids),
            Reaction.reaction_type == "LIKE"
        )
        reaction_result = await db.execute(reaction_stmt)
        liked_post_ids = {row[0] for row in reaction_result.all()}

    enriched_posts = []
    for post, profile in rows:
        post_dict = {
            "id": post.id,
            "author_id": post.author_id,
            "content_markdown": post.content_markdown,
            "visibility": post.visibility,
            "likes_count": post.likes_count,
            "comments_count": post.comments_count,
            "reposts_count": post.reposts_count,
            "created_at": post.created_at,
            "updated_at": post.updated_at,
            "media": post.media,
            "author_profile": {
                "id": profile.user_id,
                "full_name": profile.full_name,
                "headline": profile.headline,
                "banner_url": profile.banner_url
            },
            "has_liked": post.id in liked_post_ids
        }
        enriched_posts.append(post_dict)
        
    return enriched_posts

@router.post("/posts/{post_id}/like")
async def toggle_like(
    post_id: UUID,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    user_id = UUID(current_user["id"])
    
    stmt = select(Reaction).where(
        Reaction.user_id == user_id,
        Reaction.post_id == post_id,
        Reaction.reaction_type == "LIKE"
    )
    result = await db.execute(stmt)
    reaction = result.scalars().first()
    
    post_stmt = select(Post).where(Post.id == post_id)
    post_result = await db.execute(post_stmt)
    post = post_result.scalars().first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    if reaction:
        db.delete(reaction)
        post.likes_count = max(0, post.likes_count - 1)
        liked = False
    else:
        new_reaction = Reaction(
            user_id=user_id,
            post_id=post_id,
            reaction_type="LIKE"
        )
        db.add(new_reaction)
        post.likes_count += 1
        liked = True
        
    await db.commit()
    return {"likes_count": post.likes_count, "liked": liked}

# ==============================================================================
# CONNECTIONS API
# ==============================================================================

@router.post("/connections", response_model=ConnectionResponse, status_code=status.HTTP_201_CREATED)
async def send_connection_request(
    conn_in: ConnectionCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """Send a connection request to another user."""
    # Check if connection already exists
    stmt = select(Connection).where(
        (Connection.sender_id == UUID(current_user["id"])) & 
        (Connection.receiver_id == conn_in.receiver_id)
    )
    result = await db.execute(stmt)
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Connection request already sent")

    new_conn = Connection(
        sender_id=current_user["id"],
        receiver_id=conn_in.receiver_id,
        note=conn_in.note,
        status=ConnectionStatus.PENDING.value
    )
    db.add(new_conn)
    await db.commit()
    await db.refresh(new_conn)
    return new_conn

@router.post("/connections/{conn_id}/accept")
async def accept_connection(
    conn_id: UUID,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """Accept a pending connection request."""
    stmt = select(Connection).where(
        Connection.id == conn_id, 
        Connection.receiver_id == UUID(current_user["id"])
    )
    result = await db.execute(stmt)
    conn = result.scalars().first()
    
    if not conn:
        raise HTTPException(status_code=404, detail="Connection request not found")
        
    conn.status = ConnectionStatus.ACCEPTED.value
    # Here we would also dispatch Celery tasks to create bidirectional Follows
    
    await db.commit()
    return {"message": "Connection accepted"}

# ==============================================================================
# MESSAGING API
# ==============================================================================

@router.post("/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def send_message(
    msg_in: MessageCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    """Send a direct message in a conversation."""
    
    # Ensure user is part of conversation
    stmt = select(ConversationParticipant).where(
        ConversationParticipant.conversation_id == msg_in.conversation_id,
        ConversationParticipant.user_id == UUID(current_user["id"])
    )
    result = await db.execute(stmt)
    if not result.scalars().first():
        raise HTTPException(status_code=403, detail="Not a participant in this conversation")
        
    new_message = Message(
        conversation_id=msg_in.conversation_id,
        sender_id=current_user["id"],
        content=msg_in.content
    )
    db.add(new_message)
    await db.commit()
    await db.refresh(new_message)
    
    # In production, dispatch to Redis Pub/Sub for WebSockets here
    return new_message
