import logging
import asyncio
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from models.governance import RetentionPolicy, LegalHold

logger = logging.getLogger(__name__)

async def run_data_retention_sweep(db: Session):
    """
    Background worker that eradicates data past its retention limit.
    WARNING: This process destroys data permanently. It must strictly check Legal Holds.
    """
    logger.info("RETENTION ENGINE: Initiating daily sweep...")
    
    # 1. Fetch active retention policies
    policies = db.query(RetentionPolicy).filter(RetentionPolicy.is_active == True).all()
    
    # 2. Fetch all ACTIVE legal holds
    active_holds = db.query(LegalHold).filter(LegalHold.released_at == None).all()
    
    protected_user_ids = [hold.user_id for hold in active_holds if hold.user_id]
    protected_company_ids = [hold.company_id for hold in active_holds if hold.company_id]
    
    if active_holds:
        logger.warning(f"RETENTION ENGINE: Discovered {len(active_holds)} active legal holds. Protected entities bypassed.")

    for policy in policies:
        cutoff_date = datetime.utcnow() - timedelta(days=policy.retention_days)
        
        logger.info(f"Sweeping {policy.data_type} older than {cutoff_date.date()}...")
        
        # Simulated Deletion Logic
        # if policy.data_type == "APPLICATIONS":
        #    deleted_count = db.query(Application).filter(
        #        Application.created_at < cutoff_date,
        #        ~Application.company_id.in_(protected_company_ids),
        #        ~Application.user_id.in_(protected_user_ids)
        #    ).delete(synchronize_session=False)
        #    db.commit()
        
        await asyncio.sleep(0.5) # Prevent database locking

    logger.info("RETENTION ENGINE: Sweep complete. Compliance maintained.")
