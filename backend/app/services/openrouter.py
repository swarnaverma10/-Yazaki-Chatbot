import httpx
import asyncio
from app.config import config

class OpenRouterService:
    def __init__(self):
        self.api_url = "https://openrouter.ai/api/v1/chat/completions"
        self.headers = {
            "Authorization": f"Bearer {config.OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": config.APP_URL,
            "X-Title": config.APP_NAME
        }

    async def chat(self, messages: list, model: str = None, retries: int = 3):
        model = model or config.OPENROUTER_MODEL

        for attempt in range(retries):
            try:
                async with httpx.AsyncClient(timeout=30) as client:
                    response = await client.post(
                        self.api_url,
                        headers=self.headers,
                        json={
                            "model": model,
                            "messages": messages,
                            "max_tokens": 1024,
                            "temperature": 0.3
                        }
                    )
                    response.raise_for_status()
                    data = response.json()
                    return data["choices"][0]["message"]["content"]

            except httpx.HTTPStatusError as e:
                print(f"HTTP error on attempt {attempt+1}: {e}")
                if attempt == retries - 1:
                    # Try fallback model
                    if model != config.OPENROUTER_FALLBACK_MODEL:
                        print("Switching to fallback model...")
                        return await self.chat(messages, model=config.OPENROUTER_FALLBACK_MODEL, retries=2)
                    return "Sorry, I couldn't process your request right now. Please try again."

            except httpx.TimeoutException:
                print(f"Timeout on attempt {attempt+1}")
                if attempt < retries - 1:
                    await asyncio.sleep(2)
                else:
                    return "Request timed out. Please try again."

            except Exception as e:
                print(f"Unexpected error: {e}")
                return "An unexpected error occurred. Please try again."

    async def generate_answer(self, question: str, context: str):
        system_prompt = """You are M911 Copilot, an AI assistant exclusively for Metaverse911.

STRICT RULES:
1. Answer ONLY from the provided context below.
2. If the answer is not in the context, say: "Sorry, I couldn't find that information in Metaverse911 resources."
3. Never use outside knowledge.
4. Never hallucinate or make up information.
5. Keep answers clear, helpful, and professional.
6. Focus on Metaverse911 services, products, and information only."""

        user_message = f"""Context from Metaverse911 website:
{context}

User Question: {question}

Answer based strictly on the context above:"""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]

        return await self.chat(messages)

openrouter_service = OpenRouterService()