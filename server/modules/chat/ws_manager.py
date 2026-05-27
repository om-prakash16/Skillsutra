import json
import asyncio
import time
from fastapi import WebSocket
from typing import List, Dict
from core.logging import ProtocolLogger

logger = ProtocolLogger.get_logger("chat_ws")

HEARTBEAT_INTERVAL = 30
HEARTBEAT_TIMEOUT = 10


class ConnectionManager:
    def __init__(self):
        # dictionary where key is room_id and value is list of active websockets
        self.active_connections: Dict[str, List[WebSocket]] = {}
        # global user connections mapping user_id to active websockets
        self.user_connections: Dict[str, List[WebSocket]] = {}
        # Track last pong for heartbeat
        self._last_pong: Dict[WebSocket, float] = {}
        # Track ws -> (room_id, user_id) for cleanup
        self._ws_meta: Dict[WebSocket, dict] = {}

    async def connect(self, websocket: WebSocket, room_id: str = None, user_id: str = None):
        await websocket.accept()
        self._last_pong[websocket] = time.time()
        self._ws_meta[websocket] = {"room_id": room_id, "user_id": user_id}
        
        if room_id:
            if room_id not in self.active_connections:
                self.active_connections[room_id] = []
            self.active_connections[room_id].append(websocket)
        if user_id:
            if user_id not in self.user_connections:
                self.user_connections[user_id] = []
            self.user_connections[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, room_id: str = None, user_id: str = None):
        if room_id and room_id in self.active_connections:
            if websocket in self.active_connections[room_id]:
                self.active_connections[room_id].remove(websocket)
            if not self.active_connections[room_id]:
                del self.active_connections[room_id]
                
        if user_id and user_id in self.user_connections:
            if websocket in self.user_connections[user_id]:
                self.user_connections[user_id].remove(websocket)
            if not self.user_connections[user_id]:
                del self.user_connections[user_id]
        
        self._last_pong.pop(websocket, None)
        self._ws_meta.pop(websocket, None)

    def handle_pong(self, websocket: WebSocket):
        """Record the timestamp when a pong is received from the client."""
        self._last_pong[websocket] = time.time()

    async def broadcast(self, message: str, room_id: str):
        if room_id in self.active_connections:
            for connection in self.active_connections[room_id]:
                asyncio.create_task(self._safe_send(connection, message))

    async def send_personal_message(self, message: dict, user_id: str):
        if user_id in self.user_connections:
            for connection in self.user_connections[user_id]:
                asyncio.create_task(self._safe_send(connection, json.dumps(message)))

    async def _safe_send(self, connection: WebSocket, message: str):
        try:
            await connection.send_text(message)
        except Exception as e:
            logger.debug(f"Failed to send to websocket: {e}")

    # ------------------------------------------------------------------
    # HEARTBEAT ENGINE — reaps ghost connections to free file descriptors
    # ------------------------------------------------------------------
    async def heartbeat_loop(self):
        """
        Periodically sends a ping to all connected clients.
        Forcefully closes connections that haven't responded.
        """
        logger.info("Chat WebSocket heartbeat loop started.")
        while True:
            try:
                await asyncio.sleep(HEARTBEAT_INTERVAL)
                now = time.time()
                stale: List[WebSocket] = []

                for ws, last in list(self._last_pong.items()):
                    if now - last > HEARTBEAT_INTERVAL + HEARTBEAT_TIMEOUT:
                        stale.append(ws)
                    else:
                        asyncio.create_task(
                            self._safe_send(ws, json.dumps({"type": "ping", "ts": now}))
                        )

                for ws in stale:
                    meta = self._ws_meta.get(ws, {})
                    logger.warning(f"Reaping ghost chat WebSocket (room={meta.get('room_id')}, user={meta.get('user_id')})")
                    try:
                        await ws.close(code=4002)
                    except Exception:
                        pass
                    self.disconnect(ws, room_id=meta.get("room_id"), user_id=meta.get("user_id"))

            except asyncio.CancelledError:
                logger.info("Chat heartbeat loop cancelled.")
                break
            except Exception as e:
                logger.error(f"Chat heartbeat loop error: {e}")

manager = ConnectionManager()
