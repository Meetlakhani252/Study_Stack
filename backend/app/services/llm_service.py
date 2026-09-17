import os
from app.config import settings

async def get_llm_response(prompt: str) -> str:
    provider = settings.LLM_PROVIDER.lower()
    
    if provider == "gemini":
        # Placeholder for Gemini 1.5 Flash
        return f"[Gemini Response] Processed prompt: {prompt}"
    elif provider == "gpt":
        # Placeholder for GPT-4o-mini
        return f"[GPT Response] Processed prompt: {prompt}"
    else:
        return "Unsupported LLM provider"
