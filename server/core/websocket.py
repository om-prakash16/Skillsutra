import json
import asyncio
import time
from typing import Dict, List, Any
from fastapi import WebSocket, WebSocketDisconnect
from core.redis import get_redis_client
from core.logging import ProtocolLogger

logger = ProtocolLogger.get_logger("websocket")

# Heartbeat interval in seconds
HEARTBEAT_INTERVAL = 30
# If no pong received within this window, consider the connection dead
HEARTBEAT_TIMEOUT = 10


class ConnectionManager:
    def __init__(self):
        # user_id -> List[WebSocket]
        self.active_connections: Dict[str, List[WebSocket]] = {}
        # websocket -> last_pong_timestamp (for heartbeat tracking)
        self._last_pong: Dict[WebSocket, float] = {}
        self.redis = get_redis_client()
        self.pubsub = self.redis.pubsub()

    async def connect(self, websocket: WebSocket, ticket: str) -> str:
        """
        Validates the single-use WS ticket from Redis.
        Returns the user_id if valid, otherwise raises WebSocketDisconnect.
        """
        await websocket.accept()
        
        user_id_bytes = await self.redis.get(f"ws_ticket:{ticket}")
        if not user_id_bytes:
            logger.warning(f"Invalid or expired websocket ticket: {ticket}")
            await websocket.close(code=4001)
            raise WebSocketDisconnect(code=4001)
            
        # Burn the ticket (single use)
        await self.redis.delete(f"ws_ticket:{ticket}")
        
        user_id = user_id_bytes.decode("utf-8")
        
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)
        self._last_pong[websocket] = time.time()
        
        logger.info(f"User {user_id} connected via ticket. Active connections: {len(self.active_connections[user_id])}")
        
        return user_id

    def disconnect(self, websocket: WebSocket, user_id: str):
        if user_id in self.active_connections:
            if websocket in self.active_connections[user_id]:
                self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
        self._last_pong.pop(websocket, None)
        logger.info(f"User {user_id} disconnected.")

    def handle_pong(self, websocket: WebSocket):
        """Record the timestamp when a pong is received from the client."""
        self._last_pong[websocket] = time.time()

    async def _safe_send(self, connection: WebSocket, message: str):
        try:
            await connection.send_text(message)
        except Exception as e:
            logger.debug(f"Failed to send to websocket: {e}")

    async def send_personal_message(self, message: str, user_id: str):
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                asyncio.create_task(self._safe_send(connection, message))

    async def broadcast(self, message: str):
        for user_id, connections in self.active_connections.items():
            for connection in connections:
                asyncio.create_task(self._safe_send(connection, message))

    async def publish_to_redis(self, channel: str, message: dict):
        """Publish event to Redis for multi-container scaling"""
        await self.redis.publish(channel, json.dumps(message))

    async def subscribe_to_redis(self, channel: str):
        """Background task to listen to Redis events and push to WS"""
        await self.pubsub.subscribe(channel)
        logger.info(f"Subscribed to Redis channel: {channel}")
        while True:
            try:
                message = await self.pubsub.get_message(ignore_subscribe_messages=True)
                if message:
                    data = json.loads(message["data"])
                    target_user = data.get("target_user")
                    payload = data.get("payload")
                    if target_user:
                        await self.send_personal_message(json.dumps(payload), target_user)
                    else:
                        await self.broadcast(json.dumps(payload))
            except Exception as e:
                logger.error(f"Redis Pub/Sub error: {e}")
            await asyncio.sleep(0.01)

    # ------------------------------------------------------------------
    # HEARTBEAT ENGINE — reaps ghost connections to free file descriptors
    # ------------------------------------------------------------------
    async def heartbeat_loop(self):
        """
        Periodically sends a ping to all connected clients.
        If a client hasn't responded with a pong within HEARTBEAT_TIMEOUT,
        forcefully close that connection to reclaim resources.
        """
        logger.info("WebSocket heartbeat loop started.")
        while True:
            try:
                await asyncio.sleep(HEARTBEAT_INTERVAL)
                now = time.time()
                stale: List[tuple] = []

                for user_id, connections in list(self.active_connections.items()):
                    for ws in list(connections):
                        last = self._last_pong.get(ws, 0)
                        if now - last > HEARTBEAT_INTERVAL + HEARTBEAT_TIMEOUT:
                            # Ghost connection — hasn't responded in time
                            stale.append((ws, user_id))
                        else:
                            # Send application-level ping
                            asyncio.create_task(
                                self._safe_send(ws, json.dumps({"type": "ping", "ts": now}))
                            )

                for ws, uid in stale:
                    logger.warning(f"Reaping ghost WebSocket for user {uid}")
                    try:
                        await ws.close(code=4002)
                    except Exception:
                        pass
                    self.disconnect(ws, uid)

            except asyncio.CancelledError:
                logger.info("Heartbeat loop cancelled.")
                break
            except Exception as e:
                logger.error(f"Heartbeat loop error: {e}")

manager = ConnectionManager()
