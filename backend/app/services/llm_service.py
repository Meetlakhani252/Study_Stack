import httpx
from app.config import settings

SYSTEM_INSTRUCTION = """You are an expert academic tutor for college students.
When a student asks a doubt or shares a question:
1. Provide a clear, step-by-step conceptual explanation.
2. If mathematical or technical, show all intermediate steps clearly.
3. Highlight key formulas, definitions, or principles.
4. Conclude with a brief 'Key Takeaway' summary.
Keep your explanation encouraging, structured, and easy to understand."""

async def get_llm_response(prompt: str, image_base64: str = None, mime_type: str = "image/jpeg") -> str:
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        raise ValueError("Gemini API key is not configured.")

    parts = []
    if image_base64:
        parts.append({
            "inline_data": {
                "mime_type": mime_type,
                "data": image_base64
            }
        })

    parts.append({"text": prompt or "Please explain the concept or solve the question shown in the image."})

    payload = {
        "system_instruction": {
            "parts": [{"text": SYSTEM_INSTRUCTION}]
        },
        "contents": [
            {"parts": parts}
        ]
    }

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent?key={api_key}"
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(url, json=payload)
        response.raise_for_status()
        data = response.json()
        candidates = data.get("candidates", [])
        if candidates:
            content_parts = candidates[0].get("content", {}).get("parts", [])
            text_result = "\n".join([p.get("text", "") for p in content_parts if "text" in p])
            return text_result.strip()
        return "No explanation could be generated."
