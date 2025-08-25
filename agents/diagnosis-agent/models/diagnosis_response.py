from uagents import Model
from models.recommendation_agent_response import RecommendationAgentResponse

class DiagnosisResponse(Model):
    title: str
    diagnosis: str
    recommendation_agent_response: RecommendationAgentResponse | None = None