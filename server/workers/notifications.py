from celery import shared_task
import time
import logging

logger = logging.getLogger(__name__)

@shared_task(name="notifications.send_push_notification")
def send_push_notification(user_id: str, title: str, body: str, data: dict = None):
    """
    Simulates sending a push notification to a user's mobile device via Firebase Cloud Messaging (FCM).
    This task is enqueued from FastAPI routes when a job match or alert is triggered.
    """
    logger.info(f"Sending push notification to user {user_id}")
    logger.info(f"Title: {title}")
    logger.info(f"Body: {body}")
    
    # Mocking network delay
    time.sleep(1)
    
    # Example logic using FCM would go here:
    # message = messaging.Message(
    #     notification=messaging.Notification(title=title, body=body),
    #     token=user_fcm_token
    # )
    # response = messaging.send(message)
    
    logger.info("Push notification sent successfully")
    return {"status": "success", "user_id": user_id}

@shared_task(name="notifications.send_email_alert")
def send_email_alert(user_id: str, subject: str, template: str, context: dict = None):
    """
    Simulates sending an email alert to the user.
    """
    logger.info(f"Sending email alert to user {user_id}")
    logger.info(f"Subject: {subject}")
    
    time.sleep(2)
    return {"status": "success", "user_id": user_id}
