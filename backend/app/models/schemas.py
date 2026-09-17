from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class DoubtRequest(BaseModel):
    subject_id: str
    question_text: str
    image_url: Optional[str] = None

class DoubtResponse(BaseModel):
    answer_text: str
    sources: List[str] = []

class PaperRequest(BaseModel):
    subject_id: str
    file_url: str
