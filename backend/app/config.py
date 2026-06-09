from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    # OpenRouter
    OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
    OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "deepseek/deepseek-chat")
    OPENROUTER_FALLBACK_MODEL = os.getenv("OPENROUTER_FALLBACK_MODEL", "qwen/qwen3-235b-a22b")

    # App
    APP_NAME = os.getenv("APP_NAME", "M911 Copilot")
    APP_URL = os.getenv("APP_URL", "http://localhost:8000")
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

    # ChromaDB
    CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", "./data/chroma_store")
    CHROMA_COLLECTION_NAME = os.getenv("CHROMA_COLLECTION_NAME", "m911_knowledge")

    # Scraper
    TARGET_URL = os.getenv("TARGET_URL", "https://metaverse911.com")
    MAX_PAGES = int(os.getenv("MAX_PAGES", 50))

    # Debug
    DEBUG = os.getenv("DEBUG", "True") == "True"

config = Config()