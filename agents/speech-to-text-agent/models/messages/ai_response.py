from pydantic import BaseModel, Field

class AIResponse(BaseModel):
    """
    The transcription response containing only text.
    """
    text: str = Field(
        ...,
        description="The transcribed text from the input audio."
    )
