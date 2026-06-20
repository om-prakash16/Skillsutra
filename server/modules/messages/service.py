from typing import List, Dict, Any, Optional
import uuid
from core.db import get_db

class MessageService:

    async def get_inbox(self, user_id: str) -> List[Dict[str, Any]]:
        sb = get_db()
        if not sb:
            return []
            
        original_user_id = user_id
        
        # Get all conversation IDs for this user
        cp_resp = await sb.table("conversation_participants").select("conversation_id, last_read_at").in_("user_id", [user_id, original_user_id]).execute()
        if not cp_resp.data:
            return []
        
        # Build a map of conversation_id -> my last_read_at
        my_read_map = {cp["conversation_id"]: cp.get("last_read_at") for cp in cp_resp.data}
        conv_ids = list(my_read_map.keys())
        
        # Fetch conversations
        conversations_resp = await sb.table("conversations").select("*").in_("id", conv_ids).execute()
        if not conversations_resp.data:
            return []

        inbox = []
        for conv in conversations_resp.data:
            cid = conv["id"]
            
            # Fetch participants for this conversation
            parts_resp = await sb.table("conversation_participants").select("user_id").eq("conversation_id", cid).execute()
            other_user_ids = [p["user_id"] for p in (parts_resp.data or []) if p["user_id"] != user_id]
            
            # Fetch other user's info
            other_user = None
            if other_user_ids:
                user_resp = await sb.table("users").select("id, first_name, last_name, avatar_url").eq("id", other_user_ids[0]).execute()
                if user_resp.data:
                    other_user = user_resp.data[0]
                    other_user["full_name"] = f"{other_user.get('first_name', '')} {other_user.get('last_name', '')}".strip() or "Unknown"

            # Fetch the latest message
            msg_resp = await sb.table("messages").select("id, sender_id, content, created_at, is_read").eq("conversation_id", cid).order("created_at", desc=True).limit(1).execute()
            latest_message = None
            if msg_resp.data:
                latest_message = msg_resp.data[0]
                latest_sender = latest_message["sender_id"]
            
            # Determine unread count
            unread_count = 0
            if latest_message:
                last_read = my_read_map.get(cid)
                if latest_message.get("sender_id") != user_id:
                    if not last_read or latest_message.get("created_at", "") > last_read:
                        unread_count = 1

            inbox.append({
                "id": cid,
                "type": conv.get("type"),
                "title": conv.get("title"),
                "other_user": other_user,
                "latest_message": latest_message,
                "unread_count": unread_count,
                "updated_at": conv.get("updated_at")
            })
                
        # Sort inbox by latest message
        inbox.sort(key=lambda x: x.get("latest_message", {}).get("created_at", "") if x.get("latest_message") else x.get("updated_at", ""), reverse=True)
        return inbox

    async def get_history(self, conversation_id: str, user_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        sb = get_db()
        if not sb:
            return []
            
        original_user_id = user_id
            
        # Verify user is in conversation
        cp_resp = await sb.table("conversation_participants").select("id").eq("conversation_id", conversation_id).eq("user_id", user_id).execute()
        if not cp_resp.data:
            cp_resp_old = await sb.table("conversation_participants").select("id").eq("conversation_id", conversation_id).eq("user_id", original_user_id).execute()
            if not cp_resp_old.data:
                raise Exception("Access denied")

        # Fetch messages
        resp = await (
            sb.table("messages")
            .select("*")
            .eq("conversation_id", conversation_id)
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )

        data = []
        if resp.data:
            sender_ids = list({m["sender_id"] for m in resp.data})
            user_map = {}
            for sid in sender_ids:
                user_resp = await sb.table("users").select("id, first_name, last_name, avatar_url").eq("id", sid).execute()
                if user_resp.data:
                    u = user_resp.data[0]
                    user_map[sid] = {
                        "full_name": f"{u.get('first_name', '')} {u.get('last_name', '')}".strip() or "Unknown",
                        "avatar_url": u.get("avatar_url")
                    }
                    
            for m in reversed(resp.data):  # PostgREST returns newest first, we want chronological
                u_info = user_map.get(m["sender_id"], {})
                data.append({
                    "id": m["id"],
                    "conversation_id": m["conversation_id"],
                    "sender_id": m["sender_id"],
                    "content": m["content"],
                    "created_at": m["created_at"],
                    "is_read": m["is_read"],
                    "user_name": u_info.get("full_name", "Unknown"),
                    "user_avatar": u_info.get("avatar_url")
                })
                
        # Update last_read_at
        from datetime import datetime
        await sb.table("conversation_participants").update({"last_read_at": datetime.utcnow().isoformat()}).eq("conversation_id", conversation_id).eq("user_id", user_id).execute()
                
        return data

    async def start_conversation(self, sender_id: str, receiver_id: str, subject: str, initial_message: str) -> Dict[str, Any]:
        sb = get_db()
        if not sb:
            raise Exception("DB unavailable")
            
        if sender_id == receiver_id:
            raise Exception("Cannot start conversation with yourself")
            
        # 1. Check if direct conversation already exists between these two
        # (This query is complex in supabase, so we fetch all sender's conversations and check participants)
        sender_convs = await sb.table("conversation_participants").select("conversation_id").eq("user_id", sender_id).execute()
        receiver_convs = await sb.table("conversation_participants").select("conversation_id").eq("user_id", receiver_id).execute()
        
        sender_ids = {c["conversation_id"] for c in sender_convs.data} if sender_convs.data else set()
        receiver_ids = {c["conversation_id"] for c in receiver_convs.data} if receiver_convs.data else set()
        
        common_convs = sender_ids.intersection(receiver_ids)
        
        conversation_id = None
        if common_convs:
            # check if it's a direct chat
            for cid in common_convs:
                conv_info = await sb.table("conversations").select("type").eq("id", cid).single().execute()
                if conv_info.data and conv_info.data.get("type") == "DIRECT":
                    conversation_id = cid
                    break
        
        # 2. If not, create a new conversation
        if not conversation_id:
            conversation_id = str(uuid.uuid4())
            await sb.table("conversations").insert({
                "id": conversation_id,
                "type": "DIRECT",
                "title": subject
            }).execute()
            
            # Add participants
            await sb.table("conversation_participants").insert([
                {"id": str(uuid.uuid4()), "conversation_id": conversation_id, "user_id": sender_id},
                {"id": str(uuid.uuid4()), "conversation_id": conversation_id, "user_id": receiver_id}
            ]).execute()
            
        # 3. Insert the message
        msg_id = str(uuid.uuid4())
        resp = await sb.table("messages").insert({
            "id": msg_id,
            "conversation_id": conversation_id,
            "sender_id": sender_id,
            "content": f"**{subject}**\n\n{initial_message}" if subject else initial_message,
            "is_read": False
        }).execute()
        
        # Update conversation updated_at
        from datetime import datetime
        await sb.table("conversations").update({"updated_at": datetime.utcnow().isoformat()}).eq("id", conversation_id).execute()
        
        # Fetch user info for return
        user_resp = await sb.table("users").select("first_name, last_name, avatar_url").eq("id", sender_id).execute()
        if user_resp.data:
            user_info = user_resp.data[0]
            user_info["full_name"] = f"{user_info.get('first_name', '')} {user_info.get('last_name', '')}".strip() or "Unknown"
        else:
            user_info = {"full_name": "Unknown", "avatar_url": None}
        
        msg = resp.data[0] if resp.data else {}
        msg["user_name"] = user_info["full_name"]
        msg["user_avatar"] = user_info["avatar_url"]
        
        return {"conversation_id": conversation_id, "message": msg}
        
    async def save_message(self, conversation_id: str, sender_id: str, content: str) -> Dict[str, Any]:
        sb = get_db()
        if not sb:
            raise Exception("DB unavailable")
            
        msg_id = str(uuid.uuid4())
        resp = await sb.table("messages").insert({
            "id": msg_id,
            "conversation_id": conversation_id,
            "sender_id": sender_id,
            "content": content,
            "is_read": False
        }).execute()
        
        from datetime import datetime
        await sb.table("conversations").update({"updated_at": datetime.utcnow().isoformat()}).eq("id", conversation_id).execute()
        
        user_resp = await sb.table("users").select("first_name, last_name, avatar_url").eq("id", sender_id).execute()
        if user_resp.data:
            user_info = user_resp.data[0]
            user_info["full_name"] = f"{user_info.get('first_name', '')} {user_info.get('last_name', '')}".strip() or "Unknown"
        else:
            user_info = {"full_name": "Unknown", "avatar_url": None}
        
        msg = resp.data[0] if resp.data else {}
        msg["user_name"] = user_info.get("full_name", "Unknown")
        msg["user_avatar"] = user_info.get("avatar_url")
        msg["sender_id"] = sender_id
        
        return msg
