from uagents import Model
# from pydantic import BasModel
from models.recommendation_agent_response import RecommendationAgentResponse

class DiagnosisResponse(Model):
    diagnosis: str
    recommendation_agent_response: RecommendationAgentResponse