from abc import ABC, abstractmethod
from typing import List, Dict, Any, AsyncGenerator

class BaseProvider(ABC):
    """
    Abstract interface for AI Providers to ensure the platform
    is never tightly coupled to a single vendor.
    """
    
    def __init__(self, api_key: str, model_name: str, base_url: str = None):
        self.api_key = api_key
        self.model_name = model_name
        self.base_url = base_url

    @abstractmethod
    async def generate_chat(self, messages: List[Dict[str, str]], temperature: float = 0.7, max_tokens: int = 1000) -> str:
        """
        Generate a single string response from the chat model.
        """
        pass

    @abstractmethod
    async def stream_chat(self, messages: List[Dict[str, str]], temperature: float = 0.7, max_tokens: int = 1000) -> AsyncGenerator[str, None]:
        """
        Stream the chat response token by token.
        """
        pass

    @abstractmethod
    async def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """
        Generate vector embeddings for a list of texts.
        """
        pass
