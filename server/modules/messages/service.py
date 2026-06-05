from typing import List, Dict, Any, Optional
import uuid
from core.db import get_db

class MessageService:
    async def get_inbox(self, user_id: str) -> List[Dict[str, Any]]:
        sb = get_db()
        if not sb:
            return []
        
        # Get all conversation participants for this user
        cp_resp = await sb.table("conversation_participants").select("conversation_id, last_read_at").eq("user_id", user_id).execute()
        if not cp_resp.data:
            return []
            
        conv_ids = [cp["conversation_id"] for cp in cp_resp.data]
        
        # Fetch conversations with latest messages
        conversations_resp = await (
            sb.table("conversations")
            .select("*, messages(id, content, created_at, sender_id), conversation_participants(*)")
            .in_("id", conv_ids)
            .execute()
        )
        
        inbox = []
        if conversations_resp.data:
            for conv in conversations_resp.data:
                # Find the other participants
                other_participants = [p for p in conv.get("conversation_participants", []) if p["user_id"] != user_id]
                
                # Fetch user details for the other participant
                other_user = None
                if other_participants:
                    other_user_id = other_participants[0]["user_id"]
                    user_resp = await sb.table("users").select("id, full_name, avatar_url").eq("id", other_user_id).single().execute()
                    if user_resp.data:
                        other_user = user_resp.data

                # Find the latest message
                messages = conv.get("messages", [])
                latest_message = None
                if messages:
                    # Sort messages by created_at desc
                    messages.sort(key=lambda x: x.get("created_at", ""), reverse=True)
                    latest_message = messages[0]
                
                # Determine unread count
                # (Simple approach: if latest message is not from me and was created after last_read_at)
                my_participant_info = next((cp for cp in conv.get("conversation_participants", []) if cp["user_id"] == user_id), None)
                unread_count = 0
                if my_participant_info and latest_message:
                    last_read = my_participant_info.get("last_read_at")
                    if latest_message.get("sender_id") != user_id:
                        if not last_read or latest_message.get("created_at") > last_read:
                            unread_count = 1

                inbox.append({
                    "id": conv["id"],
                    "type": conv["type"],
                    "title": conv["title"],
                    "other_user": other_user,
                    "latest_message": latest_message,
                    "unread_count": unread_count,
                    "updated_at": conv["updated_at"]
                })
                
        # Sort inbox by latest message
        inbox.sort(key=lambda x: x.get("latest_message", {}).get("created_at", "") if x.get("latest_message") else x.get("updated_at", ""), reverse=True)
        return inbox

    async def get_history(self, conversation_id: str, user_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        sb = get_db()
        if not sb:
            return []
            
        # Verify user is in conversation
        cp_resp = await sb.table("conversation_participants").select("id").eq("conversation_id", conversation_id).eq("user_id", user_id).execute()
        if not cp_resp.data:
            raise Exception("Not authorized")

        # Fetch messages with user names (joined if possible, otherwise hydrated)
        resp = await (
            sb.table("messages")
            .select("*, users!inner(full_name, avatar_url)")
            .eq("conversation_id", conversation_id)
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
                        "conversation_id": m["conversation_id"],
                        "sender_id": m["sender_id"],
                        "content": m["content"],
                        "created_at": m["created_at"],
                        "user_name": m["users"]["full_name"],
                        "user_avatar": m["users"]["avatar_url"],
                    }
                )
                
        # Update last_read_at
        from datetime import datetime
        await sb.table("conversation_participants").update({"last_read_at": datetime.utcnow().isoformat()}).eq("conversation_id", conversation_id).eq("user_id", user_id).execute()
                
        return data

    async def start_conversation(self, sender_id: str, receiver_id: str, subject: str, initial_message: str) -> Dict[str, Any]:
        sb = get_db()
        if not sb:
            raise Exception("DB unavailable")
            
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
        user_resp = await sb.table("users").select("full_name, avatar_url").eq("id", sender_id).single().execute()
        user_info = user_resp.data if user_resp.data else {"full_name": "Unknown", "avatar_url": None}
        
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
        
        user_resp = await sb.table("users").select("full_name, avatar_url").eq("id", sender_id).single().execute()
        user_info = user_resp.data if user_resp.data else {"full_name": "Unknown", "avatar_url": None}
        
        msg = resp.data[0] if resp.data else {}
        msg["user_name"] = user_info.get("full_name", "Unknown")
        msg["user_avatar"] = user_info.get("avatar_url")
        
        return msg
