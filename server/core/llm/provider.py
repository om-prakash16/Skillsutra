import os
from langchain_openai import ChatOpenAI
from langchain_core.language_models.chat_models import BaseChatModel

def get_llm(model_name: str = "gpt-4o", temperature: float = 0.2) -> BaseChatModel:
    """
    Returns an instance of the configured LLM provider.
    Defaults to OpenAI GPT-4o.
    """
    # In production, ensure OPENAI_API_KEY is loaded in environment variables.
    return ChatOpenAI(
        model=model_name,
        temperature=temperature,
        api_key=os.environ.get("OPENAI_API_KEY", "mock-key")
    )

def get_fast_llm() -> BaseChatModel:
    """
    Returns a faster, cheaper LLM for background data parsing (e.g. gpt-4o-mini).
    """
    return get_llm(model_name="gpt-4o-mini", temperature=0.1)
