from app.services.scraper import scraper
import re

class ImageService:
    def __init__(self):
        self.scraped_images = []
        self.topic_keywords = {
            "oculus": ["oculus", "quest", "rift", "vr headset", "meta quest"],
            "vr_training": ["training", "simulation", "learning", "education", "virtual training"],
            "metaverse": ["metaverse", "virtual world", "digital world", "virtual reality"],
            "ar": ["augmented reality", "ar", "mixed reality", "mr"],
            "projects": ["project", "portfolio", "case study", "work", "client"],
            "services": ["service", "solution", "offering", "consulting", "development"],
            "team": ["team", "staff", "people", "expert", "founder"],
            "contact": ["contact", "reach", "touch", "location", "address"],
            "about": ["about", "company", "who we are", "story", "mission"],
            "gaming": ["game", "gaming", "esports", "interactive"],
        }

    def load_scraped_images(self):
        if not self.scraped_images and scraper.images_data:
            self.scraped_images = scraper.images_data

    def detect_topic(self, query: str) -> str:
        query_lower = query.lower()
        for topic, keywords in self.topic_keywords.items():
            for keyword in keywords:
                if keyword in query_lower:
                    return topic
        return "general"

    def find_relevant_images(self, query: str, max_images: int = 3) -> list:
        self.load_scraped_images()

        if not self.scraped_images:
            return []

        query_lower = query.lower()
        scored_images = []

        for image in self.scraped_images:
            score = 0
            alt_lower = image.get("alt", "").lower()
            page_lower = image.get("page", "").lower()

            # Score by alt text match
            query_words = query_lower.split()
            for word in query_words:
                if len(word) > 3 and word in alt_lower:
                    score += 3
                if len(word) > 3 and word in page_lower:
                    score += 1

            # Score by topic
            topic = self.detect_topic(query)
            if topic != "general":
                for keyword in self.topic_keywords[topic]:
                    if keyword in alt_lower:
                        score += 2
                    if keyword in page_lower:
                        score += 1

            if score > 0:
                scored_images.append({
                    "url": image["url"],
                    "alt": image.get("alt", "Metaverse911 Image"),
                    "page": image.get("page", ""),
                    "score": score
                })

        # Sort by score
        scored_images.sort(key=lambda x: x["score"], reverse=True)

        # Return top images without score field
        result = []
        for img in scored_images[:max_images]:
            result.append({
                "url": img["url"],
                "alt": img["alt"],
                "page": img["page"]
            })

        return result

    def get_fallback_images(self, topic: str) -> list:
        # Return images from scraped data based on topic page URL
        self.load_scraped_images()
        fallback = []
        for image in self.scraped_images[:10]:
            page_lower = image.get("page", "").lower()
            if topic in page_lower:
                fallback.append({
                    "url": image["url"],
                    "alt": image.get("alt", "Metaverse911"),
                    "page": image.get("page", "")
                })
            if len(fallback) >= 3:
                break
        return fallback

    def get_images_for_query(self, query: str) -> dict:
        images = self.find_relevant_images(query)
        topic = self.detect_topic(query)

        if not images:
            images = self.get_fallback_images(topic)

        return {
            "topic": topic,
            "images": images,
            "total": len(images)
        }

image_service = ImageService()