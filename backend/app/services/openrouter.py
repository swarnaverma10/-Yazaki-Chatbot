import httpx
import asyncio
from app.config import config


class OpenRouterService:
    def __init__(self):
        self.api_url = "https://openrouter.ai/api/v1/chat/completions"
        self.api_key = config.OPENROUTER_API_KEY
        self.model = config.OPENROUTER_MODEL
        self.fallback_model = config.OPENROUTER_FALLBACK_MODEL

    def _get_headers(self):
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "Yazaki Copilot",
        }

    def _friendly_error(self, status_code: int, detail: str) -> str:
        if status_code == 401:
            return "OpenRouter API key is invalid or missing. Please check your OPENROUTER_API_KEY."
        if status_code == 429:
            return "Rate limit reached. Please wait a moment and try again."
        if status_code == 503 or "unavailable" in detail.lower():
            return "The AI model is temporarily unavailable. Please try again shortly."
        if status_code >= 500:
            return "OpenRouter server error. Please try again in a few seconds."
        return f"AI service error ({status_code}): {detail}"

    async def _call_model(self, messages: list, model: str) -> str:
        """Single attempt against one model. Raises on failure."""
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                self.api_url,
                headers=self._get_headers(),
                json={
                    "model": model,
                    "messages": messages,
                    "max_tokens": 300,
                    "temperature": 0.3,
                }
            )

            if response.status_code != 200:
                try:
                    detail = response.json().get("error", {}).get("message", response.text)
                except Exception:
                    detail = response.text
                raise httpx.HTTPStatusError(
                    self._friendly_error(response.status_code, detail),
                    request=response.request,
                    response=response
                )

            data = response.json()
            return data["choices"][0]["message"]["content"].strip()

    async def chat(self, messages: list) -> str:
        """Try primary model, fall back to fallback model automatically."""
        if not self.api_key:
            return "OpenRouter API key not configured. Please set OPENROUTER_API_KEY in .env"

        # ── Primary model ─────────────────────────────────────────────────────
        try:
            print(f"OpenRouter request → model={self.model}")
            reply = await self._call_model(messages, self.model)
            print(f"OpenRouter success  → model={self.model}")
            return reply

        except httpx.TimeoutException:
            print(f"OpenRouter timeout on primary model {self.model}")
            primary_error = "Request timed out."

        except httpx.NetworkError as e:
            print(f"OpenRouter network error: {e}")
            primary_error = "Network error reaching AI service."

        except httpx.HTTPStatusError as e:
            print(f"OpenRouter HTTP error (primary): {e}")
            primary_error = str(e)

        except Exception as e:
            print(f"OpenRouter unexpected error (primary): {e}")
            primary_error = "An unexpected error occurred."

        # ── Fallback model ────────────────────────────────────────────────────
        if self.model != self.fallback_model:
            try:
                print(f"OpenRouter fallback → model={self.fallback_model}")
                reply = await self._call_model(messages, self.fallback_model)
                print(f"OpenRouter fallback success → model={self.fallback_model}")
                return reply

            except httpx.TimeoutException:
                print(f"OpenRouter timeout on fallback model {self.fallback_model}")
                return "Request timed out. Please try again."

            except httpx.NetworkError as e:
                print(f"OpenRouter fallback network error: {e}")
                return "Network error reaching AI service. Please check your connection."

            except httpx.HTTPStatusError as e:
                print(f"OpenRouter HTTP error (fallback): {e}")
                return str(e)

            except Exception as e:
                print(f"OpenRouter unexpected error (fallback): {e}")
                return "An unexpected error occurred. Please try again."

        return primary_error

    async def generate_answer(self, question: str, context: str) -> str:
        """Drop-in replacement for GroqService.generate_answer — same signature."""
        context_lines = context.split('\n')
        short_context = '\n'.join(context_lines[:40])

        system_prompt = """You are Yazaki Copilot, an AI assistant for Yazaki India.
Answer ONLY from the context provided, which is based on the Yazaki Domestic Travel Policy.
If the answer is not found in the context, say: "I'm sorry, I couldn't find that in the Yazaki Domestic Travel Policy. Please contact the HR department for assistance."
Be concise and professional."""

        user_message = f"""Context:
{short_context}

Question: {question}
Answer:"""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": user_message},
        ]

        return await self.chat(messages)


openrouter_service = OpenRouterService()