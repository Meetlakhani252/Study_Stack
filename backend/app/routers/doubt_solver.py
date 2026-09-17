from fastapi import APIRouter

router = APIRouter()

@router.post("/solve")
async def solve_doubt():
    return {"message": "Doubt solver endpoint"}
