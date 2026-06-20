import asyncio
import json
from core.db import init_db, get_db

async def run():
    await init_db()
    sb = get_db()
    try:
        # Check an existing conversation
        c_resp = await sb.table("conversations").select("*").limit(1).execute()
        if not c_resp.data:
            print("No conversations")
            return
        conv = c_resp.data[0]
        conv_id = conv["id"]
        
        # Check participants
        p_resp = await sb.table("conversation_participants").select("*").eq("conversation_id", conv_id).execute()
        print("Participants:", p_resp.data)
        
        # Check messages
        m_resp = await sb.table("messages").select("*").eq("conversation_id", conv_id).execute()
        print("Messages:", len(m_resp.data))
        if m_resp.data:
            print("Last message:", m_resp.data[-1])
            
        print("Success.")
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    asyncio.run(run())
