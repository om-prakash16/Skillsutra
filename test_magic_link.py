import asyncio
import os
import sys

# Add the server directory to sys.path so we can import from core
sys.path.append(os.path.join(os.path.dirname(__file__), 'server'))

from core.security import generate_secure_token, hash_token

async def test_magic_link():
    token = generate_secure_token(64)
    hashed = hash_token(token)
    print(f"Generated Token: {token}")
    print(f"Hashed Token: {hashed}")

if __name__ == "__main__":
    asyncio.run(test_magic_link())
