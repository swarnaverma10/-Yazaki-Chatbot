# M911 Copilot 🤖

> AI-powered voice knowledge assistant for **Metaverse911** — ask anything, get instant answers with voice, images, and sources.

![Status](https://img.shields.io/badge/status-live-brightgreen) ![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688) ![React](https://img.shields.io/badge/React-Vite-61DAFB) ![ChromaDB](https://img.shields.io/badge/ChromaDB-0.5.0-orange)

---

## ✨ Features

- 🎙️ **Voice Input** — Speak your question (Web Speech API)
- 🔊 **Voice Output** — Assistant speaks the answer back
- 🖼️ **Product Images** — Relevant images shown with lightbox viewer
- 🧠 **RAG Pipeline** — ChromaDB semantic search + OpenRouter LLM
- 📚 **Source Citations** — Shows which knowledge chunks were used
- 🔄 **Auto Fallback** — Primary LLM fails → fallback kicks in automatically
- 📄 **PDF Upload** — Add knowledge via PDF documents
- 💾 **Persistent Vector DB** — ChromaDB data survives restarts

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Framer Motion + Tailwind CSS |
| Backend | FastAPI + Uvicorn (Python 3.11) |
| Vector DB | ChromaDB 0.5.0 (persistent) |
| Embeddings | `sentence-transformers/all-MiniLM-L6-v2` |
| LLM | OpenRouter (`openai/gpt-oss-120b:free` + fallback) |
| Voice | Web Speech API (STT + TTS) |
| Deployment | Render (Docker) |

---

## 📁 Project Structure

```
M911 Copilot/
├── Dockerfile                        # Multi-stage build (Node + Python)
├── render.yaml                       # Render deployment config
├── backend/
│   ├── app/
│   │   ├── main.py                   # FastAPI entry point + routes
│   │   ├── config.py                 # Pydantic settings (env vars)
│   │   └── services/
│   │       ├── rag.py                # RAG pipeline + PDF ingestion
│   │       ├── openrouter_service.py # LLM service (primary + fallback)
│   │       ├── chroma.py             # ChromaDB vector store
│   │       └── images.py             # Image matching service
│   ├── data/
│   │   └── chroma_store/             # Persistent vector DB (git ignored)
│   ├── static/
│   │   └── images/                   # Cached product images (git ignored)
│   ├── .env                          # Secrets (git ignored)
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── components/
    │   │   ├── AssistantAvatar.jsx   # Animated AI avatar
    │   │   ├── ChatSidebar.jsx       # Chat history sidebar
    │   │   ├── ChatWindow.jsx        # Main chat interface
    │   │   ├── ProductImageGrid.jsx  # Lightbox image viewer
    │   │   ├── VoiceButton.jsx       # Mic button
    │   │   ├── VoiceControls.jsx     # STT + TTS controls
    │   │   ├── InputBox.jsx          # Text input
    │   │   ├── KnowledgePanel.jsx    # Source citations panel
    │   │   └── Navbar.jsx            # Top navigation
    │   ├── hooks/
    │   │   └── useVoice.js           # Voice hook (STT + TTS)
    │   ├── store/
    │   │   └── ChatContext.jsx       # Global state management
    │   └── styles/
    │       └── assistant.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## ⚙️ Local Setup

### Prerequisites
- Python 3.11+
- Node.js 20+
- OpenRouter API key (free — no credit card needed)

---

### 1. Clone the repo

```bash
git clone https://github.com/swarnaverma10/M911-Copilot.git
cd M911-Copilot
```

### 2. Backend setup

```bash
cd backend
pip install -r requirements.txt
```

Create `backend/.env` file:

```env
# ── OpenRouter ───────────────────────────────────────────────
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=openai/gpt-oss-120b:free
OPENROUTER_FALLBACK_MODEL=google/gemma-4-31b-it:free

# ── App ──────────────────────────────────────────────────────
APP_NAME=M911 Copilot
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
DEBUG=True

# ── ChromaDB ─────────────────────────────────────────────────
CHROMA_PERSIST_DIR=./data/chroma_store
CHROMA_COLLECTION_NAME=m911_knowledge

# ── Scraper ──────────────────────────────────────────────────
TARGET_URL=https://www.metaverse911.in
MAX_PAGES=50
```

Start backend:

```bash
uvicorn app.main:app --reload --port 8000
```

Backend live at: `http://localhost:8000`

---

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend live at: `http://localhost:5173`

---

## 🔑 Getting OpenRouter API Key

1. Go to [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. Sign up (free, no credit card needed)
3. Click **Create Key**
4. Copy and paste into `backend/.env`

**Free models used:**
| Role | Model |
|------|-------|
| Primary | `openai/gpt-oss-120b:free` |
| Fallback | `google/gemma-4-31b-it:free` |

---

## 🧠 How It Works

```
User Question (text or voice)
         ↓
ChromaDB Semantic Search
(all-MiniLM-L6-v2 embeddings, top 3 chunks)
         ↓
Relevance Check (cosine distance < 0.85)
         ↓
Context Builder (chunks + sources + titles)
         ↓
OpenRouter LLM
(primary model → auto fallback if fails)
         ↓
Answer + Source URLs + Matched Product Images
         ↓
Voice Output (TTS) + Chat Display
```

---

## 📄 Adding Knowledge via PDF

Upload a PDF to add it to the knowledge base:

```bash
POST http://localhost:8000/upload-pdf
Content-Type: multipart/form-data
file: your_document.pdf
```

Or via the UI (if PDF upload component is enabled).

PDF pages are automatically chunked (500 words, 50 word overlap) and inserted into ChromaDB.

---

## 🌐 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | App status + chunk count |
| `POST` | `/chat` | Text question → answer |
| `POST` | `/voice-query` | Voice question → answer |
| `GET` | `/related-image?query=` | Get matching images |
| `POST` | `/upload-pdf` | Add PDF to knowledge base |
| `DELETE` | `/clear-knowledge-base` | Wipe ChromaDB collection |

**Chat request body:**
```json
{
  "question": "What is Metaverse911?",
  "conversation_history": []
}
```

**Chat response:**
```json
{
  "answer": "Metaverse911 is...",
  "sources": ["https://metaverse911.in/about"],
  "images": [...],
  "topic": "about",
  "chunks_found": 3
}
```

---

## 🐳 Docker (Local)

```bash
# Build
docker build -t m911-copilot .

# Run
docker run -p 8080:8080 --env-file backend/.env m911-copilot
```

App at: `http://localhost:8080`

---

## 🚀 Deployment (Render)

This project deploys to **Render** using Docker (multi-stage build).

### Steps:
1. Push to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect GitHub repo
4. Runtime: **Docker**
5. Add environment variables in Render dashboard:
   - `OPENROUTER_API_KEY`
   - `APP_URL` = `https://m911-copilot.onrender.com`
   - `FRONTEND_URL` = `https://m911-copilot.onrender.com`
6. Deploy!

`render.yaml` is included for automatic configuration.

> **Note:** Render Starter plan ($7/mo) recommended for persistent disk (ChromaDB data survives restarts). Free tier resets data on each deploy.

---

## 📝 Changelog

| Version | Change |
|---------|--------|
| v1.0 | Initial release — Groq LLM + web scraping |
| v1.1 | Migrated to OpenRouter (Groq free tier exhausted) |
| v1.2 | Replaced web scraping with PDF-based knowledge ingestion |
| v1.3 | Docker deployment, Render support, frontend served from backend |

---

## 📜 License

MIT — Built for Metaverse911.


