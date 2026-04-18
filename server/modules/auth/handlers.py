import logging
from core.events import bus
from modules.auth.mailer import mailer
from modules.activity.service import record_event

logger = logging.getLogger(__name__)

# Event Name Constants
USER_CREATED = "USER_CREATED"
JOB_APPLIED = "JOB_APPLIED"
IDENTITY_VERIFIED = "IDENTITY_VERIFIED"
IDENTITY_REJECTED = "IDENTITY_REJECTED"


async def handle_user_created(data: dict):
    """
    Handler for USER_CREATED event.
    data expected: { "user_id": str, "email": str, "name": str, "wallet": str }
    """
    uid = data.get("user_id")
    email = data.get("email")
    name = data.get("name")

    # 1. Record Activity
    if uid:
        await record_event(
            actor_id=uid,
            actor_role="user",
            event_type="registration",
            description=f"Synchronized wallet {data.get('wallet')[:6]} with the Nexus.",
        )

    # 2. Trigger Mailer
    if email:
        logger.info(f"Processing Welcome Email for {email}")
        await mailer.send_welcome_email(email, name or "Member")


async def handle_job_applied(data: dict):
    """
    Handler for JOB_APPLIED event.
    data expected: { "user_id": str, "email": str, "job_title": str, "company_name": str }
    """
    data.get("user_id")
    email = data.get("email")
    job_title = data.get("job_title")

    # Activity is already logged in service.py for Job Application,
    # but we could add a specific telemetry event here.

    if email:
        logger.info(f"Processing Application Alert for {email} / Job: {job_title}")
        await mailer.send_application_alert(email, job_title or "Position")


async def handle_identity_status(data: dict):
    """
    Handler for IDENTITY_VERIFIED and IDENTITY_REJECTED events.
    data expected: { "user_id": str, "email": str, "name": str, "status": str, "reason": str }
    """
    uid = data.get("user_id")
    email = data.get("email")
    name = data.get("name")
    status = data.get("status")
    reason = data.get("reason")

    # 1. Record Activity
    if uid:
        await record_event(
            actor_id=uid,
            actor_role="user",
            event_type=f"identity_{status}",
            description=f"Identity verification protocol {status} by administrative node.",
        )

    # 2. Trigger Mailer
    if email:
        logger.info(f"Processing Identity Email ({status}) for {email}")
        await mailer.send_verification_email(email, name or "User", status, reason)


def initialize_event_handlers():
    """
    Register all system-wide event handlers to the core bus.
    This should be called during application startup.
    """
    bus.subscribe(USER_CREATED, handle_user_created)
    bus.subscribe(JOB_APPLIED, handle_job_applied)
    bus.subscribe(IDENTITY_VERIFIED, handle_identity_status)
    bus.subscribe(IDENTITY_REJECTED, handle_identity_status)

    logger.info("Platform Event Handlers Initialized Successfully.")
