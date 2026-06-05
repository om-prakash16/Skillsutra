import logging
import uuid
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException

from models.security import TrustedDevice, LoginHistory, SecurityEvent, PrivacySettings, SecurityScore
from models.session import Session as DBSession

logger = logging.getLogger(__name__)

class SecurityService:
    def __init__(self, db: Session):
        self.db = db

    # ---------------------------------------------------------
    # TRUSTED DEVICES
    # ---------------------------------------------------------
    def get_trusted_devices(self, user_id: uuid.UUID) -> List[TrustedDevice]:
        return self.db.query(TrustedDevice).filter(TrustedDevice.user_id == user_id).all()

    def add_trusted_device(self, user_id: uuid.UUID, device_fingerprint: str, device_name: str, ip_address: str) -> TrustedDevice:
        # Check if already exists
        existing = self.db.query(TrustedDevice).filter(
            TrustedDevice.user_id == user_id,
            TrustedDevice.device_fingerprint == device_fingerprint
        ).first()

        if existing:
            existing.last_used_at = datetime.now(timezone.utc)
            existing.last_ip_address = ip_address
            self.db.commit()
            self.db.refresh(existing)
            return existing

        new_device = TrustedDevice(
            user_id=user_id,
            device_fingerprint=device_fingerprint,
            device_name=device_name,
            last_ip_address=ip_address
        )
        self.db.add(new_device)
        self.db.commit()
        self.db.refresh(new_device)
        return new_device

    def revoke_device(self, user_id: uuid.UUID, device_id: uuid.UUID):
        device = self.db.query(TrustedDevice).filter(
            TrustedDevice.id == device_id,
            TrustedDevice.user_id == user_id
        ).first()
        if not device:
            raise HTTPException(status_code=404, detail="Device not found")
        
        self.db.delete(device)
        self.db.commit()

        self.log_security_event(user_id, "DEVICE_REVOKED", "high", f"Revoked device: {device.device_name}", ip_address="unknown")

    # ---------------------------------------------------------
    # LOGIN HISTORY
    # ---------------------------------------------------------
    def get_login_history(self, user_id: uuid.UUID, limit: int = 50) -> List[LoginHistory]:
        return self.db.query(LoginHistory).filter(
            LoginHistory.user_id == user_id
        ).order_by(LoginHistory.created_at.desc()).limit(limit).all()

    def log_login(self, user_id: uuid.UUID, ip_address: str, user_agent: str, status: str, location: str = "Unknown", failure_reason: str = None):
        history = LoginHistory(
            user_id=user_id,
            ip_address=ip_address,
            user_agent=user_agent,
            status=status,
            location=location,
            failure_reason=failure_reason
        )
        self.db.add(history)
        self.db.commit()

    # ---------------------------------------------------------
    # SECURITY EVENTS
    # ---------------------------------------------------------
    def log_security_event(self, user_id: uuid.UUID, event_type: str, severity: str, description: str, ip_address: str):
        event = SecurityEvent(
            user_id=user_id,
            event_type=event_type,
            severity=severity,
            description=description,
            ip_address=ip_address
        )
        self.db.add(event)
        self.db.commit()
        
        # Broadcast via Redis Pub/Sub for Realtime WebSocket Alert
        try:
            import json
            from core.redis import get_redis_client
            client = get_redis_client()
            if client:
                payload = {
                    "type": "SECURITY_ALERT",
                    "user_id": str(user_id),
                    "event": {
                        "type": event_type,
                        "severity": severity,
                        "description": description,
                        "ip": ip_address
                    }
                }
                client.publish("chat_broadcasts", json.dumps(payload))
        except Exception as e:
            logger.error(f"Failed to broadcast security event: {e}")

    def get_security_events(self, user_id: uuid.UUID, limit: int = 20) -> List[SecurityEvent]:
        return self.db.query(SecurityEvent).filter(
            SecurityEvent.user_id == user_id
        ).order_by(SecurityEvent.created_at.desc()).limit(limit).all()

    # ---------------------------------------------------------
    # SECURITY SCORE
    # ---------------------------------------------------------
    def calculate_security_score(self, user_id: uuid.UUID) -> int:
        score = 50 # Base score
        
        # Has trusted devices? (+20)
        devices = self.get_trusted_devices(user_id)
        if devices:
            score += 20
            
        # Recent security events with high severity? (-30)
        recent_bad_events = self.db.query(SecurityEvent).filter(
            SecurityEvent.user_id == user_id,
            SecurityEvent.severity == 'high',
            SecurityEvent.created_at >= datetime.now(timezone.utc) - timedelta(days=7)
        ).count()
        if recent_bad_events > 0:
            score -= 30
            
        # Limit to 0-100
        return max(0, min(100, score))

    # ---------------------------------------------------------
    # ACTIVE SESSIONS
    # ---------------------------------------------------------
    def get_active_sessions(self, user_id: uuid.UUID) -> List[DBSession]:
        return self.db.query(DBSession).filter(
            DBSession.user_id == user_id,
            DBSession.is_active == True
        ).all()

    def revoke_session(self, user_id: uuid.UUID, session_id: uuid.UUID):
        session = self.db.query(DBSession).filter(
            DBSession.id == session_id,
            DBSession.user_id == user_id
        ).first()
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        session.is_active = False
        self.db.commit()

        self.log_security_event(user_id, "SESSION_REVOKED", "medium", f"Revoked session {session_id}", ip_address="unknown")

    # ---------------------------------------------------------
    # PRIVACY SETTINGS
    # ---------------------------------------------------------
    def get_privacy_settings(self, user_id: uuid.UUID) -> PrivacySettings:
        settings = self.db.query(PrivacySettings).filter(PrivacySettings.user_id == user_id).first()
        if not settings:
            settings = PrivacySettings(user_id=user_id)
            self.db.add(settings)
            self.db.commit()
            self.db.refresh(settings)
        return settings

    def update_privacy_settings(self, user_id: uuid.UUID, updates: Dict[str, Any]) -> PrivacySettings:
        settings = self.get_privacy_settings(user_id)
        
        for key, value in updates.items():
            if hasattr(settings, key):
                setattr(settings, key, value)
                
        self.db.commit()
        self.db.refresh(settings)
        return settings
