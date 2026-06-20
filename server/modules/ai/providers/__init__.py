from .base import BaseProvider
from .gemini_provider import GeminiProvider
import os

def get_ai_provider(provider_name: str, model_name: str) -> BaseProvider:
    """
    Factory function to retrieve the appropriate AI provider instance.
    """
    provider_name = provider_name.lower()
        
    if provider_name == "gemini":
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY is not set.")
        return GeminiProvider(api_key=api_key, model_name=model_name)
        
    else:
        raise ValueError(f"Unsupported AI provider: {provider_name}")
