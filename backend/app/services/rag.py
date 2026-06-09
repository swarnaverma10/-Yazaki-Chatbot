from app.services.chroma import chroma_service
from app.services.openrouter import openrouter_service

class RAGService:
    def __init__(self):
        self.chroma = chroma_service
        self.openrouter = openrouter_service
        self.min_chunks = 1
        self.top_k = 5

    def build_context(self, chunks: list) -> str:
        if not chunks:
            return ""

        context_parts = []
        for i, chunk in enumerate(chunks):
            context_parts.append(
                f"[Source {i+1}: {chunk['title']}]\n{chunk['text']}\nURL: {chunk['source']}"
            )

        return "\n\n---\n\n".join(context_parts)

    def is_relevant(self, chunks: list, threshold: float = 0.7) -> bool:
        if not chunks:
            return False
        # cosine distance: lower = more similar
        # 0.0 = identical, 2.0 = opposite
        best_distance = min(c.get("distance", 1.0) for c in chunks)
        return best_distance < threshold

    async def query(self, question: str) -> dict:
        # Step 1: Search ChromaDB
        chunks = self.chroma.search(question, top_k=self.top_k)

        if not chunks:
            return {
                "answer": "Sorry, I couldn't find that information in Metaverse911 resources.",
                "sources": [],
                "chunks_found": 0
            }

        # Step 2: Check relevance
        if not self.is_relevant(chunks):
            return {
                "answer": "Sorry, I couldn't find that information in Metaverse911 resources.",
                "sources": [],
                "chunks_found": len(chunks)
            }

        # Step 3: Build context
        context = self.build_context(chunks)

        # Step 4: Generate answer
        answer = await self.openrouter.generate_answer(question, context)

        # Step 5: Extract unique sources
        sources = list({c["source"] for c in chunks})

        return {
            "answer": answer,
            "sources": sources,
            "chunks_found": len(chunks)
        }

    async def refresh_knowledge_base(self) -> dict:
        from app.services.scraper import scraper

        print("Starting knowledge base refresh...")

        # Step 1: Crawl website
        pages, images = scraper.crawl()

        if not pages:
            return {"status": "error", "message": "No pages scraped"}

        # Step 2: Get chunks
        chunks = scraper.get_chunks()

        if not chunks:
            return {"status": "error", "message": "No chunks generated"}

        # Step 3: Clear old data
        self.chroma.delete_all()

        # Step 4: Insert new chunks
        self.chroma.insert_chunks(chunks)

        return {
            "status": "success",
            "pages_scraped": len(pages),
            "chunks_inserted": len(chunks),
            "images_found": len(images)
        }

rag_service = RAGService()