import logging
import sys
import traceback
import asyncio
from uagents import Agent, Context
from database import build_all_index
from models import DiagnosisResponse, DiagnosisFromSymptomsRequest, DiagonsisRawRequest, StringResponse, RecommendationAgentResponse
from helpers import env_helper
from processes.entry import get_diagnosis, get_diagnosis_raw, get_structure_from_raw_text
from models.diagnosis_raw_request import DiagonsisRawRequest
from datetime import datetime
from uuid import uuid4
from uagents import Context, Protocol, Agent
from uagents_core.contrib.protocols.chat import (
    ChatAcknowledgement,
    ChatMessage,
    EndSessionContent,
    TextContent,
    chat_protocol_spec,
)

agent = Agent(name="Diagnosis Agent",
              seed=env_helper.SEED_SECRET,
              port=8001,
              mailbox=True,
              publish_agent_details=True,
              readme_path='./README.md')

@agent.on_event("startup")
async def start_application(ctx: Context):
    try:
        setup_logging()
        build_all_index()
    except Exception as e:
        ctx.logger.error(e)
        traceback.print_exc()

@agent.on_rest_post("/diagnosis/from-symptoms", request=DiagnosisFromSymptomsRequest, response=DiagnosisResponse)
async def diagnosis_from_symptoms(ctx: Context, req: DiagnosisFromSymptomsRequest) -> DiagnosisResponse:
    ctx.logger.info(f"Received REST request: {req}")
    diagnosis = await get_diagnosis(ctx, req)

    return diagnosis

@agent.on_message(model=RecommendationAgentResponse)
async def receive_message_recommendation(ctx: Context, sender: str, data: RecommendationAgentResponse) -> DiagnosisResponse:
    ctx.logger.info(f"Got response from AI agent: {data.answer}")

@agent.on_rest_post("/diagnosis/get_structure", request=DiagonsisRawRequest, response=StringResponse)
async def diagnosis_from_symptoms(ctx: Context, req: DiagonsisRawRequest) -> StringResponse:
    ctx.logger.info(f"Received REST request: {req}")
    diagnosis_structured = get_structure_from_raw_text(req.text)

    print(f'Diagnosis Structured : {diagnosis_structured}')

    return StringResponse(result=diagnosis_structured.json())

@agent.on_rest_post("/diagnosis/raw", request=DiagonsisRawRequest, response=DiagnosisResponse)
async def diagnosis_raw(ctx: Context, req: DiagonsisRawRequest) -> DiagnosisResponse:
    ctx.logger.info(f"Received REST raw request: {req}")
    diagnosis = await get_diagnosis_raw(ctx, req)

    return diagnosis

def main():
    setup_logging()
    build_all_index()

    test_raw()

def test_formatted():
    from datetime import date, timedelta
    from models import Symptom
    symptoms = [
        Symptom(name='fever', severity='mild'),
        Symptom(name='migraine', severity='light'),
        Symptom(name='diarrhea', severity='mild'),
    ]

    description = "I have been sick for around 3 days after eating a lot of seafood"
    since = date.today() - timedelta(days=3)

    request = DiagnosisFromSymptomsRequest(
        symptoms=symptoms,
        description=description,
        since=since)

    result = get_diagnosis(request)

    print(result)

def test_raw():
    from models import DiagonsisRawRequest
    import asyncio
    text = "I have been sick for around 3 days after eating a lot of seafood. I have a mild fever, light migraine, and mild diarrhea."
    request = DiagonsisRawRequest(text=text)

    # This would need a proper context in a real test
    # result = asyncio.run(get_diagnosis_raw(ctx, request))
    # print(result)
    print("Test function needs proper context to run")

def setup_logging(log_file: str = "app.log"):
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)

    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    file_handler = logging.FileHandler(log_file)
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    return logger

protocol = Protocol(spec=chat_protocol_spec)
 
# Track processed messages to prevent duplicates and handle concurrent processing
processed_messages = set()
processing_messages = set()

@protocol.on_message(ChatMessage)
async def handle_message(ctx: Context, sender: str, msg: ChatMessage):
    ctx.logger.info(f'Got message: {msg} from sender: {sender}')
    
    # Check if we've already processed this message
    if msg.msg_id in processed_messages:
        ctx.logger.info(f'Message {msg.msg_id} already processed, skipping')
        return
    
    # Check if we're currently processing this message
    if msg.msg_id in processing_messages:
        ctx.logger.info(f'Message {msg.msg_id} currently being processed, skipping duplicate')
        return
    
    # Extract text content
    text = ''
    for item in msg.content:
        if isinstance(item, TextContent):
            text += item.text
    
    # Skip empty messages or session control messages
    if not text.strip():
        ctx.logger.info(f'Skipping message with empty text content: {msg.content}')
        await ctx.send(
            sender,
            ChatAcknowledgement(timestamp=datetime.now(), acknowledged_msg_id=msg.msg_id),
        )
        processed_messages.add(msg.msg_id)
        return
    
    # Add to processing messages
    processing_messages.add(msg.msg_id)
    
    try:
        await ctx.send(
            sender,
            ChatAcknowledgement(timestamp=datetime.now(), acknowledged_msg_id=msg.msg_id),
        )
     
        ctx.logger.info(f'Processing text: {text}')
        response = 'I am afraid something went wrong and I am unable to answer your question at the moment'
        try:
            request = DiagonsisRawRequest(text=text)
            diagnosis_result = await get_diagnosis_raw(ctx, request)

            response = diagnosis_result.diagnosis
            ctx.logger.info(f'Generated response: {response}')
        except Exception as e:
            ctx.logger.error(f'Error querying model: {e}')
            ctx.logger.exception('Full error details:')
     
        await ctx.send(sender, ChatMessage(
            timestamp=datetime.utcnow(),
            msg_id=uuid4(),
            content=[
                TextContent(type="text", text=response),
                EndSessionContent(type="end-session"),
            ]
        ))
        
        # Mark as processed and remove from processing
        processed_messages.add(msg.msg_id)
        
    finally:
        # Always remove from processing set
        processing_messages.discard(msg.msg_id)

@protocol.on_message(ChatAcknowledgement)
async def handle_ack(_ctx: Context, sender: str, msg: ChatAcknowledgement):
    print('I got a chat acknowledgement', sender, msg)
 
agent.include(protocol, publish_manifest=True)

if __name__ == "__main__":
    agent.run()