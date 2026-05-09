try:
    from langchain.prompts import PromptTemplate
    print("langchain.prompts works")
except ImportError:
    print("langchain.prompts fails")

try:
    from langchain_core.prompts import PromptTemplate
    print("langchain_core.prompts works")
except ImportError:
    print("langchain_core.prompts fails")
