import logging
import asyncio
from typing import Dict, Any, Optional
from datetime import datetime
import uuid

logger = logging.getLogger("platform.events")

class EventDispatcher:
    """
    Centralized Event Bus for the Skillsutra Enterprise Operating System.
    Emits standardized platform events (e.g. entity.created) to trigger:
    - Audit Logs
    - Notifications
    - Workflows
    - Search Indexing
    - Analytics
    - AI Hooks
    """
    def __init__(self):
        self._subscribers = {}
        
    def subscribe(self, event_type: str, callback):
        if event_type not in self._subscribers:
            self._subscribers[event_type] = []
        self._subscribers[event_type].append(callback)
        
    async def publish(
        self, 
        event_type: str, 
        entity_type: str, 
        entity_id: str, 
        actor_id: Optional[str] = None, 
        payload: Optional[Dict[str, Any]] = None,
        tenant_id: Optional[str] = None
    ):
        event = {
            "event_id": str(uuid.uuid4()),
            "event_type": event_type,
            "entity_type": entity_type,
            "entity_id": entity_id,
            "actor_id": actor_id,
            "tenant_id": tenant_id,
            "payload": payload or {},
            "timestamp": datetime.utcnow().isoformat()
        }
        
        logger.info(f"Emitted Event: {event_type} on {entity_type}/{entity_id} by {actor_id}")
        
        if event_type in self._subscribers:
            for callback in self._subscribers[event_type]:
                try:
                    # Fire and forget
                    asyncio.create_task(callback(event))
                except Exception as e:
                    logger.error(f"Error executing event subscriber for {event_type}: {e}")
                    
        # Broadcast globally to catch-all (e.g., Audit system)
        if "*" in self._subscribers:
            for callback in self._subscribers["*"]:
                try:
                    asyncio.create_task(callback(event))
                except Exception as e:
                    logger.error(f"Error executing global event subscriber: {e}")

# Global Event Bus Instance
platform_events = EventDispatcher()

# Standard Event Types
class EventTypes:
    CREATED = "entity.created"
    UPDATED = "entity.updated"
    DELETED = "entity.deleted"
    ARCHIVED = "entity.archived"
    RESTORED = "entity.restored"
    APPROVED = "entity.approved"
    REJECTED = "entity.rejected"
    EXPORTED = "entity.exported"
    IMPORTED = "entity.imported"
