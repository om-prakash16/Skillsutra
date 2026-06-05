import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from modules.messages.service import MessageService
from core.db import get_db
from db.engine import init_db

async def test_message():
    try:
        await init_db()
        print("Connecting to DB to get users...")
        db = get_db()
        users_resp = db.table("users").select("*").limit(2).execute()
        
        if not users_resp.data or len(users_resp.data) < 2:
            print("Not enough users to test messaging.")
            return

        user1 = users_resp.data[0]
        user2 = users_resp.data[1]

        print(f"Testing message from {user1['id']} to {user2['id']}")
        
        service = MessageService()
        result = await service.start_conversation(
            sender_id=user1['id'],
            receiver_id=user2['id'],
            subject="Test Subject",
            initial_message="Hello, this is a test message to verify the system works."
        )
        print("Message sent successfully!")
        print(f"Conversation ID: {result['conversation_id']}")
        print(f"Message ID: {result['message']['id']}")
        
    except Exception as e:
        print(f"Error testing message: {e}")

if __name__ == "__main__":
    asyncio.run(test_message())
