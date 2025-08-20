import logging
import sys
import traceback
from uagents import Agent, Context
from database import build_all_index
from models import DiagnosisResponse, DiagnosisFromSymptomsRequest, DiagonsisRawRequest
from helpers import env_helper
from processes.entry import get_diagnosis, get_diagnosis_raw
from models.diagnosis_raw_request import DiagonsisRawRequest

agent = Agent(name="Diagnosis Agent", seed=env_helper.SEED_SECRET, port=8000, endpoint=["http://localhost:8000/submit"])

@agent.on_event("startup")
async def start_application(ctx: Context):
    try:
        setup_logging()
        build_all_index()
    except Exception as e:
        ctx.logger.error(e)
        traceback.print_exc()

@agent.on_message(model=DiagnosisFromSymptomsRequest, replies=DiagnosisResponse)
async def answer_question(ctx: Context, sender: str, msg: DiagnosisFromSymptomsRequest):
    ctx.logger.info(f"Received question from {sender}: {msg}")

    diagnosis = get_diagnosis(msg)

    await ctx.send(
        sender, diagnosis
    )

@agent.on_message(model=DiagonsisRawRequest, replies=DiagnosisResponse)
async def answer_question(ctx: Context, sender: str, msg: DiagnosisFromSymptomsRequest):
    ctx.logger.info(f"Received question from {sender}: {msg}")

    diagnosis = get_diagnosis_raw(msg)

    await ctx.send(
        sender, diagnosis
    )

@agent.on_rest_post("/diagnosis/from-symptoms", request=DiagnosisFromSymptomsRequest, response=DiagnosisResponse)
async def diagnosis_from_symptoms(ctx: Context, req: DiagnosisFromSymptomsRequest) -> DiagnosisResponse:
    ctx.logger.info(f"Received REST request: {req}")
    diagnosis = get_diagnosis(req)
    return diagnosis


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

if __name__ == "__main__":
    # main()
    agent.run()