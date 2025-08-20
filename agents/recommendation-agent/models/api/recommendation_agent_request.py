from pydantic import BaseModel, Field

class RecommendationAgentRequest(BaseModel):
    question: str = Field(
        description="The question that the user wants to have an answer for."
    )