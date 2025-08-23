from typing import List
from uagents import Model, Field
from models.medicine import Medicine

class RecommendationAgentResponse(Model):
    answer: str
    medicines: List[Medicine] = Field(default_factory=list)
