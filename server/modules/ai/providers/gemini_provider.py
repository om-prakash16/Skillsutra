import asyncio
from typing import List, Dict, Any, AsyncGenerator
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, BaseMessage
from .base import BaseProvider

class GeminiProvider(BaseProvider):
    def __init__(self, api_key: str, model_name: str, base_url: str = None):
        super().__init__(api_key, model_name, base_url)
        self.embeddings = GoogleGenerativeAIEmbeddings(
            google_api_key=api_key, 
            model="models/text-embedding-004"
        )

    def _convert_messages(self, messages: List[Dict[str, str]]) -> List[BaseMessage]:
        lc_messages = []
        for msg in messages:
            if msg["role"] == "system":
                lc_messages.append(SystemMessage(content=msg["content"]))
            elif msg["role"] == "user":
                lc_messages.append(HumanMessage(content=msg["content"]))
            elif msg["role"] == "assistant":
                lc_messages.append(AIMessage(content=msg["content"]))
        return lc_messages

    async def generate_chat(self, messages: List[Dict[str, str]], temperature: float = 0.7, max_tokens: int = 1000) -> str:
        llm = ChatGoogleGenerativeAI(
            google_api_key=self.api_key,
            model=self.model_name,
            temperature=temperature,
            max_output_tokens=max_tokens
        )
        lc_messages = self._convert_messages(messages)
        res = await llm.ainvoke(lc_messages)
        return res.content

    async def stream_chat(self, messages: List[Dict[str, str]], temperature: float = 0.7, max_tokens: int = 1000) -> AsyncGenerator[str, None]:
        llm = ChatGoogleGenerativeAI(
            google_api_key=self.api_key,
            model=self.model_name,
            temperature=temperature,
            max_output_tokens=max_tokens,
            streaming=True
        )
        lc_messages = self._convert_messages(messages)
        async for chunk in llm.astream(lc_messages):
            if chunk.content:
                yield chunk.content

    async def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        return await self.embeddings.aembed_documents(texts)
