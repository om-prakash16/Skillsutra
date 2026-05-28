import asyncpg
import asyncio
async def main():
    print('connecting')
    try:
        await asyncpg.connect('postgresql://postgres:postgres@127.0.0.1:5433/skillsutra')
        print('connected')
    except Exception as e:
        print('error:', e)
asyncio.run(main())
