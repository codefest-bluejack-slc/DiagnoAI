from datetime import date, timedelta
from uagents import Agent, Context
from models import DiagnosisResponse, DiagnosisFromSymptomsRequest, Symptom

agent = Agent(name="Main Agent",
              seed="KelvinKlevin",
              port=8001,
              endpoint=["http://127.0.0.1:8001/submit"]
              )

@agent.on_event("startup")
async def ask_question(ctx: Context):
    symptoms = [
        Symptom(name='fever', severity='mild'),
        Symptom(name='migraine', severity='light'),
        Symptom(name='diarrhea', severity='mild'),
    ]

    background = "I have been sick for around 3 days after eating a lot of seafood"
    since = date.today() - timedelta(days=3)

    request = DiagnosisFromSymptomsRequest(symptoms=symptoms, background=background, since=since)

    await ctx.send(
        'agent1q2x0x64tll74y2zn8jtq3redpypjvxtgypsk3dy9qzs7e286ztfaspepy2v', request
    )

@agent.on_message(model=DiagnosisResponse)
async def handle_data(ctx: Context, sender: str, data: DiagnosisResponse):
    ctx.logger.info(f"Got response from AI agent: {data.diagnosis}")

if __name__ == "__main__":
    agent.run()