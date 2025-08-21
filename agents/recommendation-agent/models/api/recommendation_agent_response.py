from typing import List
from uagents import Model, Field
from models.domain import Medicine

class RecommendationAgentResponse(Model):
    answer: str
    medicines: List[Medicine] = Field(default_factory=list)
