from typing import List
from uagents import Model
from models.medicine import Medicine

class RecommendationAgentResponse(Model):
    answer: str
    medicines: List[Medicine] = []
