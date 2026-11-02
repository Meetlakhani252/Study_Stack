from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class DoubtRequest(BaseModel):
    subject_id: str
    question_text: str
    image_base64: Optional[str] = None
    mime_type: Optional[str] = "image/jpeg"

class DoubtResponse(BaseModel):
    answer_text: str
    sources: List[str] = []

class PaperRequest(BaseModel):
    subject_id: str
    file_url: str

class PaperAnalyzeRequest(BaseModel):
    subject_id: str
    year: int
    paper_type: Optional[str] = "Final Exam"
    pdf_base64: Optional[str] = None
    paper_text: Optional[str] = None
    syllabus_topics: Optional[List[str]] = []

class ExtractedQuestion(BaseModel):
    question_text: str
    topic: str

class PaperAnalyzeResponse(BaseModel):
    questions: List[ExtractedQuestion]
    total_extracted: int
    matched_topics: List[str]
