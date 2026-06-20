from typing import List, Dict, Any
from core.db import get_db


class ChatService:
    async def get_rooms(self) -> List[Dict[str, Any]]:
        sb = get_db()
        if not sb:
            return []
        resp = sb.table("chat_channels").select("*").execute()
        return resp.data if resp.data else []

    async def create_room(self, data: Dict[str, Any]) -> Dict[str, Any]:
        sb = get_db()
        if not sb:
            raise Exception("DB unavailable")
        resp = sb.table("discussion_rooms").insert(data).execute()
        return resp.data[0] if resp.data else {}

    async def save_message(
        self, room_id: str, user_id: str, content: str
    ) -> Dict[str, Any]:
        sb = get_db()
        if not sb:
            raise Exception("DB unavailable")

        # 1. Save to DB
        import uuid
        msg_id = str(uuid.uuid4())
        resp = (
            sb.table("chat_messages")
            .insert({"id": msg_id, "channel_id": room_id, "user_id": user_id, "content": content})
            .execute()
        )

        msg = resp.data[0] if resp.data else {}

        # 2. Enrich with user info (optional, depends on frontend needs)
        if msg:
            user_resp = (
                sb.table("users")
                .select("full_name")
                .eq("id", user_id)
                .single()
                .execute()
            )
            msg["user_name"] = (
                user_resp.data.get("full_name", "Anonymous")
                if user_resp.data
                else "Anonymous"
            )

        return msg

    async def get_history(self, room_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        sb = get_db()
        if not sb:
            return []

        # Fetch messages with user names (joined if possible, otherwise hydrated)
        resp = (
            sb.table("chat_messages")
            .select("*, users!inner(full_name)")
            .eq("room_id", room_id)
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )

        data = []
        if resp.data:
            for m in reversed(resp.data):  # return in chronological order
                data.append(
                    {
                        "id": m["id"],
                        "room_id": m["room_id"],
                        "user_id": m["user_id"],
                        "content": m["content"],
                        "created_at": m["created_at"],
                        "user_name": m["users"]["full_name"],
                    }
                )
        return data
