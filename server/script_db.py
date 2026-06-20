import asyncio
from core.db import get_db, init_db

async def run():
    await init_db()
    sb = get_db()
    try:
        print("Users:")
        r = await sb.table('users').select('id, keycloak_id, first_name').limit(5).execute()
        print(r.data)
        
        print("\nConversations:")
        r = await sb.table('conversations').select('*').limit(5).execute()
        print(r.data)
        
        print("\nParticipants:")
        r = await sb.table('conversation_participants').select('*').limit(5).execute()
        print(r.data)
        
        print("\nMessages:")
        r = await sb.table('messages').select('*').limit(5).execute()
        print(r.data)
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    asyncio.run(run())
