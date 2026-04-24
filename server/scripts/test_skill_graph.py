import asyncio
from modules.skill_graph.service import SkillGraphService

async def test():
    service = SkillGraphService()
    print("Testing Taxonomy Search...")
    try:
        res = await service.taxonomy.search_skills("Python")
        print(f"Search Result: {res}")
    except Exception as e:
        print(f"Search Failed: {e}")

    print("\nTesting Taxonomy Listing...")
    try:
        res = await service.taxonomy.list_skills()
        print(f"List Result: {res['total']} skills found.")
    except Exception as e:
        print(f"Listing Failed: {e}")

if __name__ == "__main__":
    asyncio.run(test())
