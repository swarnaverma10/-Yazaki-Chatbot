from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional
import uvicorn
import os

from app.config import config
from app.services.rag import rag_service
from app.services.images import image_service
from app.services.scraper import scraper

app = FastAPI(
    title=config.APP_NAME,
    description="AI-Powered Voice Knowledge Assistant for Metaverse911",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[config.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Static files — images serve karne ke liye
static_dir = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(static_dir, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")
# ── Startup Event ──────────────────────────────────────────  ← YE YAHAN ADD KARO
@app.on_event("startup")
async def startup_event():
    if rag_service.chroma.get_count() == 0:
        await rag_service.refresh_knowledge_base()
# ── Request Models ──────────────────────────────────────────
class ChatRequest(BaseModel):
    question: str
    conversation_history: Optional[list] = []

class ScrapeRequest(BaseModel):
    max_pages: Optional[int] = 50

# ── In-memory conversation store ────────────────────────────
conversation_store = {}

# ── Routes ──────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "app": config.APP_NAME,
        "chunks_in_db": rag_service.chroma.get_count()
    }

@app.post("/chat")
async def chat(request: ChatRequest):
    if not request.question or not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    question = request.question.strip()

    blocked = ["ignore previous", "forget instructions", "system prompt", "jailbreak", "act as"]
    for phrase in blocked:
        if phrase in question.lower():
            raise HTTPException(status_code=400, detail="Invalid input detected")

    result = await rag_service.query(question)
    image_result = image_service.get_images_for_query(question)

    return {
        "answer": result["answer"],
        "sources": result["sources"],
        "images": image_result["images"],
        "topic": image_result["topic"],
        "chunks_found": result["chunks_found"]
    }

@app.post("/voice-query")
async def voice_query(request: ChatRequest):
    return await chat(request)

@app.get("/related-image")
async def related_image(query: str):
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    result = image_service.get_images_for_query(query)
    return result

@app.get("/conversation-history")
async def conversation_history(session_id: Optional[str] = "default"):
    return {
        "session_id": session_id,
        "history": conversation_store.get(session_id, [])
    }

@app.post("/scrape-website")
async def scrape_website(request: ScrapeRequest):
    try:
        pages, images = scraper.crawl(max_pages=request.max_pages)
        chunks = scraper.get_chunks()
        return {
            "status": "success",
            "pages_scraped": len(pages),
            "images_found": len(images),
            "chunks_generated": len(chunks)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/refresh-knowledge-base")
async def refresh_knowledge_base():
    try:
        result = await rag_service.refresh_knowledge_base()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=config.DEBUG)