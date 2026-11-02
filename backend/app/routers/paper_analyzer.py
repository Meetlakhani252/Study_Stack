from fastapi import APIRouter, HTTPException
from app.models.schemas import PaperAnalyzeRequest, PaperAnalyzeResponse, ExtractedQuestion
from app.config import settings
import httpx
import json

router = APIRouter()

@router.post("/analyze", response_model=PaperAnalyzeResponse)
async def analyze_paper(payload: PaperAnalyzeRequest):
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        raise HTTPException(status_code=500, detail="Gemini API key is not configured.")

    topics_prompt = f"Syllabus topics to match against: {payload.syllabus_topics}" if payload.syllabus_topics else "Extract and categorize into concise topic names."
    prompt = f"""You are an examination question paper analyzer.
{topics_prompt}

Extract each individual question from the paper.
Classify each question under the most appropriate syllabus topic.
Respond ONLY with a JSON array of objects with keys:
- "question_text": string
- "topic": string"""

    parts = []
    if payload.pdf_base64:
        parts.append({
            "inline_data": {
                "mime_type": "application/pdf",
                "data": payload.pdf_base64
            }
        })
    if payload.paper_text:
        parts.append({"text": f"Paper Content:\n{payload.paper_text}"})

    parts.append({"text": prompt})

    body = {
        "generationConfig": {"responseMimeType": "application/json"},
        "contents": [{"parts": parts}]
    }

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent?key={api_key}"

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(url, json=body)
            resp.raise_for_status()
            data = resp.json()
            raw_text = data.get("candidates", [])[0].get("content", {}).get("parts", [])[0].get("text", "[]")
            extracted = json.loads(raw_text)

            questions = [
                ExtractedQuestion(
                    question_text=q.get("question_text", ""),
                    topic=q.get("topic", "General")
                )
                for q in extracted if q.get("question_text")
            ]

            topics_set = list({q.topic for q in questions})
            return PaperAnalyzeResponse(
                questions=questions,
                total_extracted=len(questions),
                matched_topics=topics_set
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Paper analysis error: {str(e)}")
