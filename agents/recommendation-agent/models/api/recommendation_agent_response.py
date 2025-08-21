from pydantic import BaseModel, Field
from typing import List
from models.domain import Medicine

class RecommendationAgentResponse(BaseModel):
    answer: str = Field(
        description="The answer from AI agent to the user agent"
    )
    medicines: List[Medicine] = Field(
        description="List of recommended medicines with essential purchase information",
        default=[]
    )
