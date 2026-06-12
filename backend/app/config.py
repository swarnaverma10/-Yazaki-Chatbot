"""
config.py — sirf OpenRouter fields dikhaye hain.
Apne existing config.py mein GROQ lines ko in lines se replace karo.
"""

from pydantic_settings import BaseSettings


class Config(BaseSettings):
    # App
    APP_NAME: str = "M911 Copilot"
    APP_URL: str = "http://localhost:8000"
    FRONTEND_URL: str = "http://localhost:5173"
    DEBUG: bool = True

    # ── OpenRouter  (GROQ_API_KEY / GROQ_MODEL hata diye) ──────
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_MODEL: str = "meta-llama/llama-3.1-8b-instruct:free"
    OPENROUTER_FALLBACK_MODEL: str = "mistralai/mistral-7b-instruct:free"

    # ChromaDB
    CHROMA_PERSIST_DIR: str = "./data/chroma_store"
    CHROMA_COLLECTION_NAME: str = "m911_knowledge"

    # Scraper
    TARGET_URL: str = "https://www.metaverse911.in"
    MAX_PAGES: int = 50

    class Config:
        env_file = ".env"


config = Config()