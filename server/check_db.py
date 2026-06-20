import asyncio
from core.db import get_db

async def run():
    sb = get_db()
    if not sb:
        print("No DB")
        return
    
    await sb.connect()

    users = await sb.table("users").select("id, keycloak_id, first_name").limit(5).execute()
    print("Users:", users.data)

    convs = await sb.table("conversations").select("*").execute()
    print("Convs:", len(convs.data), convs.data)

    cps = await sb.table("conversation_participants").select("*").execute()
    print("Participants:", len(cps.data), cps.data)

    msgs = await sb.table("messages").select("*").execute()
    print("Messages:", len(msgs.data), msgs.data[-1] if msgs.data else None)

if __name__ == '__main__':
    asyncio.run(run())
