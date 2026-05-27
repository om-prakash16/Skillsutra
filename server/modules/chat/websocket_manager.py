import logging
from typing import Dict, List
from fastapi import WebSocket

logger = logging.getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        # Maps channel_id to a list of active WebSocket connections
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, channel_id: str):
        await websocket.accept()
        if channel_id not in self.active_connections:
            self.active_connections[channel_id] = []
        self.active_connections[channel_id].append(websocket)
        logger.info(f"Client connected to channel {channel_id}")

    def disconnect(self, websocket: WebSocket, channel_id: str):
        if channel_id in self.active_connections:
            self.active_connections[channel_id].remove(websocket)
            logger.info(f"Client disconnected from channel {channel_id}")

    async def broadcast_to_channel(self, message: dict, channel_id: str):
        """
        In production, this should integrate with Redis Pub/Sub to ensure 
        messages broadcast across multiple FastAPI Uvicorn workers.
        """
        if channel_id in self.active_connections:
            for connection in self.active_connections[channel_id]:
                await connection.send_json(message)

manager = ConnectionManager()
