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

pending_response: asyncio.Future[RecommendationAgentResponse] | None = None

@agent.on_rest_post("/diagnosis/from-symptoms", request=DiagnosisFromSymptomsRequest, response=DiagnosisResponse)
async def diagnosis_from_symptoms(ctx: Context, req: DiagnosisFromSymptomsRequest) -> DiagnosisResponse:
    # global pending_response
    # pending_response = asyncio.get_event_loop().create_future()

    ctx.logger.info(f"Received REST request: {req}")
    diagnosis = await get_diagnosis(ctx, req)

    return diagnosis

@agent.on_message(model=RecommendationAgentResponse)
async def receive_message_recommendation(ctx: Context, sender: str, data: RecommendationAgentResponse) -> DiagnosisResponse:
    global pending_response
    ctx.logger.info(f"Got response from AI agent: {data.answer}")

    if pending_response and not pending_response.done():
        pending_response.set_result(data)

@agent.on_rest_post("/diagnosis/get_structure", request=DiagonsisRawRequest, response=StringResponse)
async def diagnosis_from_symptoms(ctx: Context, req: DiagonsisRawRequest) -> StringResponse:
    ctx.logger.info(f"Received REST request: {req}")
    diagnosis_structured = get_structure_from_raw_text(req.text)

    print(f'Diagnosis Structured : {diagnosis_structured}')

    return StringResponse(result=diagnosis_structured.json())

@agent.on_rest_post("/diagnosis/raw", request=DiagonsisRawRequest, response=DiagnosisResponse)
async def diagnosis_raw(ctx: Context, req: DiagonsisRawRequest) -> DiagnosisResponse:
    ctx.logger.info(f"Received REST raw request: {req}")
    diagnosis = get_diagnosis_raw(req)

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
    text = "I have been sick for around 3 days after eating a lot of seafood. I have a mild fever, light migraine, and mild diarrhea."
    request = DiagonsisRawRequest(text=text)

    result = get_diagnosis_raw(request)

    print(result)

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
 
@protocol.on_message(ChatMessage)
async def handle_message(ctx: Context, sender: str, msg: ChatMessage):
    ctx.logger.info(f'Got message: {msg}')
    await ctx.send(
        sender,
        ChatAcknowledgement(timestamp=datetime.now(), acknowledged_msg_id=msg.msg_id),
    )
 
    text = ''
    for item in msg.content:
        if isinstance(item, TextContent):
            text += item.text
 
    response = 'I am afraid something went wrong and I am unable to answer your question at the moment'
    try:
        request = DiagonsisRawRequest(text=text)
        diagnosis_result = get_diagnosis_raw(request)

        response = diagnosis_result.diagnosis
    except:
        ctx.logger.exception('Error querying model')
 
    await ctx.send(sender, ChatMessage(
        timestamp=datetime.utcnow(),
        msg_id=uuid4(),
        content=[
            TextContent(type="text", text=response),
            EndSessionContent(type="end-session"),
        ]
    ))

@protocol.on_message(ChatAcknowledgement)
async def handle_ack(_ctx: Context, sender: str, msg: ChatAcknowledgement):
    print('I got a chat acknowledgement', sender, msg)
 
agent.include(protocol, publish_manifest=True)

if __name__ == "__main__":
    # main()
    agent.run()