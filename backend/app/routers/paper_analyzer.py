from fastapi import APIRouter

router = APIRouter()

@router.post("/analyze")
async def analyze_paper():
    return {"message": "Paper analyzer endpoint"}
