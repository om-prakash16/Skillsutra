from celery import shared_task
import logging

logger = logging.getLogger(__name__)

@shared_task(name="gamification.process_event")
def process_gamification_event(user_id: str, event_type: str, metadata: dict = None):
    """
    Consumes events from Redis Streams (e.g., 'course_completed', 'post_upvoted')
    and calculates XP to award the user. Updates PostgreSQL and Redis Sorted Sets.
    """
    logger.info(f"Processing gamification event '{event_type}' for user {user_id}")
    
    xp_to_award = 0
    if event_type == "course_completed":
        xp_to_award = 500
    elif event_type == "post_upvoted":
        xp_to_award = 10
    elif event_type == "assessment_passed":
        xp_to_award = 1000
        
    logger.info(f"Awarding {xp_to_award} XP to user {user_id}")
    
    # Implementation placeholder:
    # 1. Update DB (UserReputation.xp_points += xp_to_award)
    # 2. Check for level ups and badge unlocks
    # 3. Update Redis: redis_client.zincrby("global_leaderboard", xp_to_award, user_id)
    # 4. Trigger WebSocket notification to user for immediate UI feedback
    
    return {"status": "success", "user_id": user_id, "xp_awarded": xp_to_award}
