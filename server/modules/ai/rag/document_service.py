import uuid
from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.ai import AIDocument, AIDocumentChunk
from modules.ai.providers import get_ai_provider

class DocumentService:
    def __init__(self, db: AsyncSession, tenant_id: str = None):
        self.db = db
        self.tenant_id = tenant_id

    def _chunk_text(self, text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
        """
        Simple recursive character text splitter.
        For enterprise apps, LangChain's RecursiveCharacterTextSplitter is often used here.
        """
        chunks = []
        start = 0
        text_length = len(text)
        
        while start < text_length:
            end = start + chunk_size
            
            # If we're not at the end of the text, try to find a natural break point (newline or space)
            if end < text_length:
                # Look back up to 100 characters to find a newline
                newline_pos = text.rfind('\n', max(start, end - 100), end)
                if newline_pos != -1:
                    end = newline_pos + 1
                else:
                    # Look back up to 50 characters to find a space
                    space_pos = text.rfind(' ', max(start, end - 50), end)
                    if space_pos != -1:
                        end = space_pos + 1

            chunk = text[start:end].strip()
            if chunk:
                chunks.append(chunk)
                
            start = end - overlap
            if start >= text_length:
                break
                
        return chunks

    async def ingest_document(self, title: str, content: str, content_type: str = "markdown", source_url: str = None, metadata: dict = None) -> AIDocument:
        """
        1. Create AIDocument record.
        2. Chunk content.
        3. Generate embeddings for chunks.
        4. Store chunks with vectors in AIDocumentChunk.
        """
        # 1. Create Document
        doc = AIDocument(
            title=title,
            source_url=source_url,
            content_type=content_type,
            status="processing",
            metadata_json=metadata or {},
            organization_id=self.tenant_id
        )
        self.db.add(doc)
        await self.db.flush()

        try:
            # 2. Chunk text
            chunks = self._chunk_text(content)
            
            if not chunks:
                doc.status = "indexed"
                await self.db.commit()
                return doc

            # 3. Generate Embeddings using Gemini provider
            provider = get_ai_provider("gemini", "gemini-1.5-pro") # Model name isn't strictly used for embeddings in our factory right now, but good to pass
            embeddings = await provider.generate_embeddings(chunks)
            
            # 4. Save Chunks
            for i, (chunk_text, embedding) in enumerate(zip(chunks, embeddings)):
                db_chunk = AIDocumentChunk(
                    document_id=doc.id,
                    chunk_index=i,
                    content=chunk_text,
                    embedding=embedding,
                    organization_id=self.tenant_id
                )
                self.db.add(db_chunk)
                
            doc.status = "indexed"
            await self.db.commit()
            
        except Exception as e:
            await self.db.rollback()
            # Mark as failed in a new transaction
            failed_doc = await self.db.execute(select(AIDocument).where(AIDocument.id == doc.id))
            fd = failed_doc.scalars().first()
            if fd:
                fd.status = "failed"
                fd.metadata_json["error"] = str(e)
                await self.db.commit()
            raise e
            
        return doc
