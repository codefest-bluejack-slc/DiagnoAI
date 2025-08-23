from uuid import uuid4
from datetime import datetime

from agent import RecommendationAgent
from models.api import RecommendationAgentRequest, RecommendationAgentResponse

from uagents import Context, Protocol
from uagents_core.contrib.protocols.chat import (
    ChatAcknowledgement,
    ChatMessage,
    StartSessionContent,
    TextContent,
    chat_protocol_spec,
)
from dotenv import load_dotenv

load_dotenv()
agent = RecommendationAgent()


protocol = Protocol(spec=chat_protocol_spec)
@protocol.on_message(ChatMessage)
async def handle_message(ctx: Context, sender: str, msg: ChatMessage):
    await ctx.send(
        sender,
        ChatAcknowledgement(timestamp=datetime.now(), acknowledged_msg_id=msg.msg_id),
    )

    print(f"======= RECEIVED MESSAGE =======")
    print(msg.content)

    if isinstance(msg.content, list) and len(msg.content) > 0:
        if isinstance(msg.content[0], StartSessionContent):
            return
    elif isinstance(msg.content, StartSessionContent):
        return

    text = ""
    for item in msg.content:
        if isinstance(item, TextContent):
            text += item.text

    response = "I am afraid something went wrong and I am unable to answer your question at the moment"
    try:
        request = RecommendationAgentRequest(question=text)
        recommendation_result = agent.recommendation_service.send_query(request.question)
        response = RecommendationAgentResponse(answer=recommendation_result[0], medicines=recommendation_result[1])
    except:
        ctx.logger.exception("Error querying model")

    await ctx.send(
        sender,
        ChatMessage(
            timestamp=datetime.utcnow(),
            msg_id=uuid4(),
            content=[
                TextContent(type="text", text=response.answer),
                # EndSessionContent(type="end-session"),
            ],
        ),
    )

@protocol.on_message(ChatAcknowledgement)
async def handle_ack(ctx: Context, sender: str, msg: ChatAcknowledgement):
    pass
 
agent.agent.include(protocol, publish_manifest=True)

if __name__ == "__main__":    
    agent.run()