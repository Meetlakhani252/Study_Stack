from fastapi import FastAPI
from app.routers import doubt_solver, paper_analyzer

app = FastAPI(title="StudyStack API")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "0.1.0"}

app.include_router(doubt_solver.router, prefix="/doubts", tags=["Doubts"])
app.include_router(paper_analyzer.router, prefix="/papers", tags=["Papers"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
