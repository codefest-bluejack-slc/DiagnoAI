from pydantic import BaseModel, Field
from typing import Optional

class AIRequest(BaseModel):
    """
    Metadata for an AI speech-to-text request.
    The audio file itself will come via multipart/form-data (UploadFile).
    """
    language: Optional[str] = Field(
        default='en',
        description="Optional language code of the audio (e.g., 'en', 'id')."
    )
