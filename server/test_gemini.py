import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load .env file with override
load_dotenv(override=True)

api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("ERROR: GOOGLE_API_KEY not found in .env file.")
    exit(1)

try:
    print(f"Testing Gemini API with key starting with: {api_key[:5]}...")
    genai.configure(api_key=api_key)
    
    print("Available models:")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)
    
    print("SUCCESS: API connection works!")
    print("Gemini says:", response.text.strip())
except Exception as e:
    print("ERROR: API connection failed.")
    print(str(e))
