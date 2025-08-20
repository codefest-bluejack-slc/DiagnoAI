from uagents import Agent, Context
from models.api import RecommendationAgentRequest, RecommendationAgentResponse
 
agent = Agent (
    name="simple test agent",
    seed="your seed value alt",
    port=8001,
    endpoint=["http://localhost:8001/submit"]
)
 
QUESTION = "Diarrhea"
 
@agent.on_event("startup")
async def ask_question(ctx: Context):
    ctx.logger.info (
        f"Asking AI agent to answer {QUESTION}"
    )
    await ctx.send (
        'agent1qgjequt609avltyjtg6xwzt87u7qu0e0666j72kygqu02tamh2ya2x53ksn', RecommendationAgentRequest(question=QUESTION)
    )
 
@agent.on_message(model=RecommendationAgentResponse)
async def handle_data(ctx: Context, sender: str, data: RecommendationAgentResponse):
    ctx.logger.info(f"Got response from AI agent: \n{data.answer}")
    
    if data.medicines:
        ctx.logger.info("Recommended medicines for purchase:")
        for i, medicine in enumerate(data.medicines, 1):
            ctx.logger.info(f"{i}. {medicine.brand_name} ({medicine.generic_name})")
    else:
        ctx.logger.info("No specific medicines recommended.")
 
agent.run()