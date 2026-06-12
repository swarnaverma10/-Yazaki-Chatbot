class ImageService:
    def __init__(self):
        self.base_url = "/static/images"
        self.topic_images = {
            "holobox": {"file": "holobox.avif", "alt": "HoloBox Holographic Display"},
            "holographic": {"file": "Holographic.avif", "alt": "Holographic Display"},
            "holofan": {"file": "holobox.avif", "alt": "HoloFan Display"},
            "ai_kiosk": {"file": "AI Kiosk.avif", "alt": "AI Kiosk Interactive Display"},
            "anamorphic": {"file": "LED Wall.avif", "alt": "Anamorphic LED Wall"},
            "led_wall": {"file": "LED Wall.avif", "alt": "LED Wall Display"},
            "xwall": {"file": "XWall Gamification.avif", "alt": "XWall Gamification"},
            "vr": {"file": "VR.avif", "alt": "Virtual Reality Experience"},
            "ar": {"file": "AR.avif", "alt": "Augmented Reality Experience"},
            "mr": {"file": "MR.avif", "alt": "Mixed Reality Experience"},
            "virtual_tour": {"file": "360 virtual tour.avif", "alt": "360 Virtual Tour"},
            "animated_video": {"file": "3D aminated videos.avif", "alt": "3D Animated Videos"},
            "touch_kiosk": {"file": "Touch Kiosk.avif", "alt": "Touch Screen Kiosk"},
            "product": {"file": "Product Configurators.avif", "alt": "Product Configurators"},
        }
        self.topic_keywords = {
            "holobox": ["holobox", "holo box", "holographic box"],
            "holographic": ["holographic", "hologram", "holo"],
            "holofan": ["holofan", "holo fan"],
            "ai_kiosk": ["ai kiosk", "kiosk", "interactive kiosk", "virtual representative"],
            "anamorphic": ["anamorphic", "3d billboard", "naked eye 3d"],
            "led_wall": ["led wall", "led"],
            "xwall": ["xwall", "x wall", "gamification"],
            "vr": ["vr", "virtual reality", "oculus", "meta quest", "headset"],
            "ar": ["ar", "augmented reality"],
            "mr": ["mr", "mixed reality"],
            "virtual_tour": ["virtual tour", "360", "immersive tour"],
            "animated_video": ["animated", "animation", "3d video"],
            "touch_kiosk": ["touch kiosk", "touch screen", "touchscreen"],
            "product": ["product configurator", "configurator"],
        }

    def detect_topic(self, query: str) -> str:
        query_lower = query.lower()
        for topic, keywords in self.topic_keywords.items():
            for keyword in keywords:
                if keyword in query_lower:
                    return topic
        return "holographic"

    def get_images_for_query(self, query: str) -> dict:
        topic = self.detect_topic(query)
        image_data = self.topic_images.get(topic, self.topic_images["holographic"])
        image_url = f"{self.base_url}/{image_data['file']}"
        return {
            "topic": topic,
            "images": [{"url": image_url, "alt": image_data["alt"], "page": ""}],
            "total": 1
        }

image_service = ImageService()