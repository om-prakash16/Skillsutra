"""
Centralized Embedding Service with Redis caching.
Wraps Google Generative AI embeddings with a cache layer to avoid
redundant API calls and reduce latency for repeated queries.
"""
import os
import hashlib
import logging
import asyncio
from typing import List, Optional

import google.generativeai as genai
import numpy as np

from core.redis import redis_get, redis_set

logger = logging.getLogger(__name__)

# 30-day cache for embeddings
_EMBEDDING_TTL = 30 * 24 * 3600

_configured = False


def _ensure_configured():
    global _configured
    if not _configured:
        api_key = os.getenv("GOOGLE_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
        _configured = True


def _cache_key(text: str) -> str:
    h = hashlib.sha256(text.encode("utf-8")).hexdigest()[:24]
    return f"embed:{h}"


class EmbeddingService:
    """
    Enterprise embedding service with:
    - Redis caching (30-day TTL)
    - Batch processing
    - Graceful fallback to random vectors when API is unavailable
    """

    MODEL_NAME = "models/text-embedding-004"
    DIMENSION = 768

    async def get_embedding(self, text: str, task_type: str = "retrieval_document") -> List[float]:
        """Get a single embedding, checking Redis cache first."""
        if not text or not text.strip():
            return self._zero_vector()

        key = _cache_key(text)
        cached = await redis_get(key)
        if cached:
            return cached

        _ensure_configured()
        try:
            result = await asyncio.to_thread(
                genai.embed_content,
                model=self.MODEL_NAME,
                content=text.strip(),
                task_type=task_type,
            )
            embedding = result["embedding"]
            await redis_set(key, embedding, ttl_seconds=_EMBEDDING_TTL, apply_jitter=True)
            return embedding
        except Exception as e:
            logger.error(f"Embedding generation failed: {e}")
            return self._zero_vector()

    async def get_query_embedding(self, text: str) -> List[float]:
        """Optimized for search queries (uses retrieval_query task type)."""
        return await self.get_embedding(text, task_type="retrieval_query")

    async def batch_embed(self, texts: List[str], task_type: str = "retrieval_document") -> List[List[float]]:
        """
        Batch embed multiple texts. Checks Redis for each, only sends
        uncached texts to the API.
        """
        if not texts:
            return []

        results: List[Optional[List[float]]] = [None] * len(texts)
        uncached_indices: List[int] = []
        uncached_texts: List[str] = []

        # Check cache for each
        for i, text in enumerate(texts):
            if not text or not text.strip():
                results[i] = self._zero_vector()
                continue
            key = _cache_key(text)
            cached = await redis_get(key)
            if cached:
                results[i] = cached
            else:
                uncached_indices.append(i)
                uncached_texts.append(text.strip())

        # Batch embed uncached texts
        if uncached_texts:
            _ensure_configured()
            try:
                api_result = await asyncio.to_thread(
                    genai.embed_content,
                    model=self.MODEL_NAME,
                    content=uncached_texts,
                    task_type=task_type,
                )
                embeddings = api_result["embedding"]

                # Cache and assign results
                for idx, emb in zip(uncached_indices, embeddings):
                    results[idx] = emb
                    key = _cache_key(texts[idx])
                    # Fire-and-forget cache write
                    asyncio.create_task(
                        redis_set(key, emb, ttl_seconds=_EMBEDDING_TTL, apply_jitter=True)
                    )
            except Exception as e:
                logger.error(f"Batch embedding failed: {e}")
                for idx in uncached_indices:
                    results[idx] = self._zero_vector()

        return results

    def _zero_vector(self) -> List[float]:
        return [0.0] * self.DIMENSION


# Singleton
embedding_service = EmbeddingService()
