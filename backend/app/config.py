import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "gemini")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

settings = Settings()
