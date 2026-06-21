from fastapi import APIRouter, Depends
from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from core.database import get_db_session
from core.dependencies import get_current_user_id
from schemas.enterprise import EnterpriseResponseEnvelope

from models.user import User
from models.session import Session
from models.security import TrustedDevice, SecurityEvent, LoginHistory
from models.iam import APIKey, ServiceAccount
from models.oauth import OAuthProviderConfig

router = APIRouter(prefix="/admin/identity-metrics", tags=["Enterprise Identity"])

@router.get("", response_model=EnterpriseResponseEnvelope[Dict[str, Any]])
async def get_identity_dashboard_metrics(
    admin_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db_session)
):
    """Aggregates metrics for the Identity Dashboard."""
    
    # Simple counts
    async def count_table(model, filters=None):
        query = select(func.count(model.id))
        if filters is not None:
            query = query.where(filters)
        res = await db.execute(query)
        return res.scalar() or 0
        
    total_users = await count_table(User)
    active_sessions = await count_table(Session, Session.is_active == True)
    total_devices = await count_table(TrustedDevice)
    blocked_devices = await count_table(TrustedDevice, TrustedDevice.trusted_status == False)
    total_api_keys = await count_table(APIKey, APIKey.is_active == True)
    total_service_accounts = await count_table(ServiceAccount, ServiceAccount.is_active == True)
    total_oauth_apps = await count_table(OAuthProviderConfig, OAuthProviderConfig.is_active == True)
    
    # Time-bound counts (e.g. 30 days) - simplified for demo
    security_events = await count_table(SecurityEvent)
    failed_logins = await count_table(LoginHistory, LoginHistory.status == "failure")
    
    return EnterpriseResponseEnvelope(
        data={
            "users": total_users,
            "sessions": active_sessions,
            "devices": total_devices,
            "blocked_devices": blocked_devices,
            "api_keys": total_api_keys,
            "service_accounts": total_service_accounts,
            "oauth_apps": total_oauth_apps,
            "security_events": security_events,
            "failed_logins": failed_logins,
            # Placeholder data for charts
            "charts": {
                "auth_methods": [
                    {"name": "Password", "value": 75},
                    {"name": "Google", "value": 20},
                    {"name": "GitHub", "value": 5}
                ],
                "device_types": [
                    {"name": "Desktop", "value": 80},
                    {"name": "Mobile", "value": 20}
                ]
            }
        },
        message="Metrics aggregated successfully"
    )
