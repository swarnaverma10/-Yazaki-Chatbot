from app.services.chroma import chroma_service
from app.services.openrouter_service import openrouter_service
import uuid

class RAGService:
    def __init__(self):
        self.chroma = chroma_service
        self.llm = openrouter_service
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

    def is_relevant(self, chunks: list, threshold: float = 1.0) -> bool:
        if not chunks:
            return False
        best_distance = min(c.get("distance", 1.0) for c in chunks)
        return best_distance < threshold

    async def query(self, question: str) -> dict:
        chunks = self.chroma.search(question, top_k=self.top_k)

        print(f"Chunks found: {len(chunks) if chunks else 0}")
        if chunks:
            print(f"Best distance: {min(c.get('distance', 1.0) for c in chunks)}")

        if not chunks:
            return {
                "answer": "I'm sorry, I couldn't find relevant information in the Domestic Travel Policy. Please try asking something related to travel entitlements, lodging, boarding, per diem, or reimbursement policies.",
                "sources": [],
                "chunks_found": 0
            }

        if not self.is_relevant(chunks):
            return {
                "answer": "I'm sorry, your question doesn't seem to be covered in the Domestic Travel Policy document. You can ask me about travel modes, lodging limits, per diem allowances, reimbursement rules, or GST guidelines.",
                "sources": [],
                "chunks_found": len(chunks)
            }

        context = self.build_context(chunks)
        answer = await self.llm.generate_answer(question, context)
        sources = list({c["source"] for c in chunks})

        return {
            "answer": answer,
            "sources": sources,
            "chunks_found": len(chunks)
        }

    async def add_pdf(self, file) -> dict:
        import io
        try:
            from pypdf import PdfReader
        except ImportError:
            raise Exception("pypdf install karo: pip install pypdf")

        contents = await file.read()
        pdf = PdfReader(io.BytesIO(contents))

        chunks = []
        for page_num, page in enumerate(pdf.pages):
            text = page.extract_text() or ""
            text = text.strip()
            if len(text) < 50:
                continue

            words = text.split()
            for i in range(0, len(words), 450):
                chunk_text = " ".join(words[i:i+500])
                if len(chunk_text) > 100:
                    chunks.append({
                        "text": chunk_text,
                        "source": f"PDF: {file.filename} (page {page_num+1})",
                        "title": file.filename,
                        "chunk_id": str(uuid.uuid4())
                    })

        if not chunks:
           return {"status": "error", "message": "No readable text found in the knowledge base."}

        self.chroma.insert_chunks(chunks)

        return {
            "status": "success",
            "filename": file.filename,
            "pages": len(pdf.pages),
            "chunks_inserted": len(chunks)
        }


rag_service = RAGService()