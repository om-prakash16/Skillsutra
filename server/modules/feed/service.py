from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import desc, update, delete
from uuid import UUID
import uuid

from models.social import Post, Reaction, PostMedia
from models.profile import Profile
from schemas.social import PostCreate, EnrichedPostResponse

class FeedService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_feed_posts(self, user_id: UUID, limit: int = 20, offset: int = 0) -> list[dict]:
        # Fetch posts with their media and author profile
        stmt = (
            select(Post, Profile)
            .join(Profile, Post.author_id == Profile.user_id)
            .options(selectinload(Post.media))
            .filter(Post.deleted_at == None)
            .order_by(desc(Post.created_at))
            .limit(limit)
            .offset(offset)
        )
        
        result = await self.db.execute(stmt)
        rows = result.all()
        
        # Check likes
        post_ids = [row[0].id for row in rows]
        liked_post_ids = set()
        
        if post_ids:
            reaction_stmt = select(Reaction.post_id).where(
                Reaction.user_id == user_id,
                Reaction.post_id.in_(post_ids),
                Reaction.reaction_type == "LIKE"
            )
            reaction_result = await self.db.execute(reaction_stmt)
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

    async def create_post(self, user_id: UUID, post_data: PostCreate) -> Post:
        new_post = Post(
            author_id=user_id,
            content_markdown=post_data.content_markdown,
            visibility=post_data.visibility
        )
        
        self.db.add(new_post)
        await self.db.flush()
        
        for media_item in post_data.media:
            new_media = PostMedia(
                post_id=new_post.id,
                media_url=media_item.media_url,
                media_type=media_item.media_type,
                sort_order=media_item.sort_order
            )
            self.db.add(new_media)
            
        await self.db.commit()
        await self.db.refresh(new_post)
        
        return new_post

    async def toggle_like(self, user_id: UUID, post_id: UUID) -> dict:
        stmt = select(Reaction).where(
            Reaction.user_id == user_id,
            Reaction.post_id == post_id,
            Reaction.reaction_type == "LIKE"
        )
        result = await self.db.execute(stmt)
        reaction = result.scalars().first()
        
        post_stmt = select(Post).where(Post.id == post_id)
        post_result = await self.db.execute(post_stmt)
        post = post_result.scalars().first()
        
        if not post:
            raise ValueError("Post not found")

        if reaction:
            self.db.delete(reaction)
            post.likes_count = max(0, post.likes_count - 1)
            liked = False
        else:
            new_reaction = Reaction(
                user_id=user_id,
                post_id=post_id,
                reaction_type="LIKE"
            )
            self.db.add(new_reaction)
            post.likes_count += 1
            liked = True
            
        await self.db.commit()
        
        return {"likes_count": post.likes_count, "liked": liked}
