from pydantic import BaseModel
from typing import Optional, List

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
