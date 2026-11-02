from fastapi import APIRouter, HTTPException
from app.models.schemas import DoubtRequest, DoubtResponse
from app.services.llm_service import get_llm_response

router = APIRouter()

@router.post("/solve", response_model=DoubtResponse)
async def solve_doubt(payload: DoubtRequest):
    try:
        answer = await get_llm_response(
            prompt=payload.question_text,
            image_base64=payload.image_base64,
            mime_type=payload.mime_type or "image/jpeg"
        )
        return DoubtResponse(answer_text=answer, sources=[])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
