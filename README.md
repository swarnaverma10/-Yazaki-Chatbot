# M911 Copilot 🤖

AI-powered voice knowledge assistant for **Metaverse911** — built with FastAPI, ChromaDB, OpenRouter, and React.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Framer Motion |
| Backend | FastAPI + Uvicorn |
| Vector DB | ChromaDB |
| Embeddings | sentence-transformers/all-MiniLM-L6-v2 |
| LLM | OpenRouter (gpt-oss-120b:free + fallback) |
| Voice | Web Speech API (STT + TTS) |

---

## 📁 Project Structure

```
M911 Copilot/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI entry point
│   │   ├── config.py                # Environment config
│   │   └── services/
│   │       ├── rag.py               # RAG pipeline
│   │       ├── openrouter_service.py # LLM service (OpenRouter)
│   │       ├── chroma.py            # ChromaDB vector store
│   │       ├── images.py            # Image matching service
│   │       └── scraper.py           # Website scraper
│   ├── data/
│   │   └── chroma_store/            # Persistent vector DB
│   ├── static/
│   │   └── images/                  # Cached product images
│   ├── .env                         # Environment variables (git ignored)
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── components/
    │   │   ├── AssistantAvatar.jsx
    │   │   ├── ChatSidebar.jsx
    │   │   ├── ProductImageGrid.jsx  # Lightbox image viewer
    │   │   ├── VoiceControls.jsx
    │   │   ├── InputBox.jsx
    │   │   └── Navbar.jsx
    │   ├── hooks/
    │   │   └── useVoice.js
    │   └── store/
    │       └── ChatContext.jsx
    └── package.json
```

---

## ⚙️ Setup

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/m911-copilot.git
cd m911-copilot
```

### 2. Backend setup

```bash
cd backend
pip install -r requirements.txt
```

Create `.env` file:

```env
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=openai/gpt-oss-120b:free
OPENROUTER_FALLBACK_MODEL=google/gemma-4-31b-it:free

APP_NAME=M911 Copilot
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

CHROMA_PERSIST_DIR=./data/chroma_store
CHROMA_COLLECTION_NAME=m911_knowledge

TARGET_URL=https://www.metaverse911.in
MAX_PAGES=50
DEBUG=True
```

Start backend:

```bash
uvicorn app.main:app --reload
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Getting OpenRouter API Key

1. Go to [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. Sign up (free, no credit card needed)
3. Click **Create Key**
4. Copy and paste into `.env`

Free models used:
- Primary: `openai/gpt-oss-120b:free`
- Fallback: `google/gemma-4-31b-it:free`

---

## 🧠 How It Works

```
User Question
     ↓
ChromaDB Semantic Search (top 3 chunks)
     ↓
Relevance Check (distance < 0.85)
     ↓
Context Builder
     ↓
OpenRouter LLM (primary → fallback)
     ↓
Answer + Sources + Product Images
```

---

## ✨ Features

- 🎙️ **Voice Input** — speak your question
- 🔊 **Voice Output** — assistant speaks the answer
- 🖼️ **Product Images** — relevant images shown with lightbox
- 📚 **Knowledge Sources** — shows which pages were used
- 🔄 **Auto Fallback** — if primary LLM fails, fallback kicks in
- 💾 **Persistent Vector DB** — ChromaDB stores scraped knowledge

---

## 🔄 Refresh Knowledge Base

To re-scrape Metaverse911 website and update ChromaDB:

```bash
POST http://localhost:8000/refresh-knowledge-base
```

Or via health check:

```bash
GET http://localhost:8000/health
```

---

## 🛠️ Migration Notes

- **v1.0** — Groq LLM
- **v1.1** — Migrated to OpenRouter (Groq free tier exhausted)

---

## 📝 License

MIT — built for Metaverse911.