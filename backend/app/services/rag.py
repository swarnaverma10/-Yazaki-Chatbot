from app.services.chroma import chroma_service
from app.services.openrouter_service import openrouter_service   # ← changed


class RAGService:
    def __init__(self):
        self.chroma = chroma_service
        self.llm = openrouter_service                            # ← changed
        self.min_chunks = 1
        self.top_k = 3

    def build_context(self, chunks: list) -> str:
        if not chunks:
            return ""
        context_parts = []
        for i, chunk in enumerate(chunks):
            context_parts.append(
                f"[Source {i+1}: {chunk['title']}]\n{chunk['text']}\nURL: {chunk['source']}"
            )
        return "\n\n---\n\n".join(context_parts)

    def is_relevant(self, chunks: list, threshold: float = 0.85) -> bool:
        if not chunks:
            return False
        best_distance = min(c.get("distance", 1.0) for c in chunks)
        return best_distance < threshold

    async def query(self, question: str) -> dict:
        # Step 1: Search ChromaDB
        chunks = self.chroma.search(question, top_k=self.top_k)

        print(f"Chunks found: {len(chunks) if chunks else 0}")
        if chunks:
            print(f"Best distance: {min(c.get('distance', 1.0) for c in chunks)}")

        if not chunks:
            return {
                "answer": "I couldn't find relevant information in the Metaverse911 knowledge base.",
                "sources": [],
                "chunks_found": 0
            }

        # Step 2: Check relevance — threshold raised to 0.85 so more results pass
        if not self.is_relevant(chunks):
            return {
                "answer": "I couldn't find closely matching information. Please try rephrasing your question.",
                "sources": [],
                "chunks_found": len(chunks)
            }

        # Step 3: Build context
        context = self.build_context(chunks)

        # Step 4: Generate answer via OpenRouter  ← changed comment only
        answer = await self.llm.generate_answer(question, context)

        # Step 5: Unique sources
        sources = list({c["source"] for c in chunks})

        return {
            "answer": answer,
            "sources": sources,
            "chunks_found": len(chunks)
        }

    async def refresh_knowledge_base(self) -> dict:
        from app.services.scraper import scraper

        print("Starting knowledge base refresh...")

        pages, images = scraper.crawl()
        if not pages:
            return {"status": "error", "message": "No pages scraped"}

        chunks = scraper.get_chunks()
        if not chunks:
            return {"status": "error", "message": "No chunks generated"}

        self.chroma.delete_all()
        self.chroma.insert_chunks(chunks)

        return {
            "status": "success",
            "pages_scraped": len(pages),
            "chunks_inserted": len(chunks),
            "images_found": len(images)
        }


rag_service = RAGService()