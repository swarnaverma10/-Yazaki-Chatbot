import os
import json

CACHE_FILE = os.path.join(os.path.dirname(__file__), "images_cache.json")

class ImageService:
    def __init__(self):
        self.cached_images = []
        self.topic_keywords = {
            "holobox": ["holobox", "holo box", "holo-box"],
            "holofan": ["holofan", "holo fan", "holo-fan"],
            "anamorphic": ["anamorphic", "led wall", "3d billboard", "naked eye"],
            "ai_kiosk": ["kiosk", "ai kiosk"],
            "holocube": ["holocube", "holo cube"],
            "vr": ["vr", "virtual reality", "virtual-reality"],
            "ar": ["ar", "augmented reality", "augmented-reality", "mixed reality"],
            "virtual_tour": ["virtual tour", "360", "tour"],
            "metaverse": ["metaverse", "virtual world"],
            "training": ["training", "simulation", "learning", "education"],
            "healthcare": ["healthcare", "medical", "hospital"],
            "gaming": ["game", "gaming", "esports"],
            "animated_video": ["animated", "animation", "3d animated", "video"],
            "about": ["about", "team", "founder", "company"],
            "projects": ["project", "portfolio", "case study"],
            "services": ["service", "solution", "offering"],
        }
        self.load_cache()

    def load_cache(self):
        if os.path.exists(CACHE_FILE):
            try:
                with open(CACHE_FILE, "r") as f:
                    self.cached_images = json.load(f)
                print(f"Loaded {len(self.cached_images)} images from cache")
            except:
                self.cached_images = []

    def detect_topic(self, query: str) -> str:
        query_lower = query.lower()
        for topic, keywords in self.topic_keywords.items():
            for keyword in keywords:
                if keyword in query_lower:
                    return topic
        return "general"

    def find_images(self, query: str, max_images: int = 3) -> list:
        if not self.cached_images:
            self.load_cache()
        if not self.cached_images:
            return []

        query_lower = query.lower()
        query_words = [w for w in query_lower.split() if len(w) > 2]
        topic = self.detect_topic(query)

        scored = []
        for image in self.cached_images:
            score = 0
            alt_lower = image.get("alt", "").lower()
            page_lower = image.get("page", "").lower()
            url_lower = image.get("url", "").lower()

            # Match query words against filename/alt
            for word in query_words:
                if word in alt_lower: score += 6
                if word in url_lower: score += 4
                if word in page_lower: score += 2

            # Match topic keywords
            if topic != "general":
                for keyword in self.topic_keywords[topic]:
                    if keyword in alt_lower: score += 8
                    if keyword in url_lower: score += 5

            scored.append({
                "url": image.get("url", ""),
                "alt": image.get("alt", "Metaverse911"),
                "page": image.get("page", ""),
                "score": score
            })

        scored.sort(key=lambda x: x["score"], reverse=True)

        seen = set()
        unique = []
        for img in scored:
            if not img["url"]:
                continue
            if img["url"] not in seen:
                seen.add(img["url"])
                unique.append({
                    "url": img["url"],
                    "alt": img["alt"],
                    "page": img["page"],
                })
            if len(unique) >= max_images:
                break

        return unique

    def get_images_for_query(self, query: str) -> dict:
        images = self.find_images(query)
        topic = self.detect_topic(query)
        return {
            "topic": topic,
            "images": images,
            "total": len(images)
        }

image_service = ImageService()