from typing import List, Dict, Any, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from models.ai import AIDocumentChunk, AIDocument
from modules.ai.providers import get_ai_provider

class VectorSearchService:
    def __init__(self, db: AsyncSession, tenant_id: str = None):
        self.db = db
        self.tenant_id = tenant_id

    async def search(self, query: str, limit: int = 5, threshold: float = 0.7) -> List[Dict[str, Any]]:
        """
        Perform a semantic vector search using pgvector's cosine distance (<=>).
        """
        # 1. Generate embedding for query
        provider = get_ai_provider("gemini", "gemini-1.5-pro")
        embeddings = await provider.generate_embeddings([query])
        query_vector = embeddings[0]
        
        # 2. Query Postgres
        # We use pgvector's `<=>` operator for cosine distance.
        # Cosine similarity = 1 - cosine_distance. So distance < 1 - threshold.
        max_distance = 1.0 - threshold
        
        # Need to format the vector as a string for Postgres
        vector_str = f"[{','.join(str(x) for x in query_vector)}]"
        
        # Build raw SQL or use SQLAlchemy pgvector dialect
        stmt = (
            select(AIDocumentChunk, AIDocument)
            .join(AIDocument, AIDocumentChunk.document_id == AIDocument.id)
            .filter(AIDocumentChunk.embedding.cosine_distance(query_vector) < max_distance)
        )
        
        if self.tenant_id:
            stmt = stmt.filter(AIDocumentChunk.organization_id == self.tenant_id)
            
        # Order by distance (closest first)
        stmt = stmt.order_by(AIDocumentChunk.embedding.cosine_distance(query_vector)).limit(limit)
        
        res = await self.db.execute(stmt)
        results = []
        
        for chunk, doc in res.all():
            results.append({
                "chunk_id": str(chunk.id),
                "document_id": str(doc.id),
                "title": doc.title,
                "content": chunk.content,
                "source_url": doc.source_url,
                "metadata": doc.metadata_json
            })
            
        return results
