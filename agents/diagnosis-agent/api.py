import json
from datetime import date
from fastapi import FastAPI, Body, HTTPException
from uagents import Model
from uagents.query import send_sync_message
from models import DiagnosisFromSymptomsRequest, DiagonsisRawRequest
from helpers import env_helper

app = FastAPI()

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Diagnosis Agent API"}

@app.post("/diagnosis/from-symptoms")
async def get_diagnosis_from_symptoms(request: dict = Body(...)):
    """
    {
        "description": "I have been sick for around 3 days after eating a lot of seafood",
        "symptoms": [
            {"name": "headache", "severity": "mild"},
            {"name": "fever", "severity": "high"},
            {"name": "diarrhea", "severity": "high"}
        ],
        "since": "2025-08-10"
    }
    """
    request['since'] = date.fromisoformat(request['since'])
    message = DiagnosisFromSymptomsRequest(**request)

    print(message)

    try:
        result = await send_sync_message(
            destination=env_helper.AGENT_ADRESS,
            message=message,
        )
        
        return json.loads(result)

    except Exception as e:
        print(f"Error sending message: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/diagnosis/get_structure")
async def get_diagnosis_unstructured(request: dict = Body(...)):
    """
    {"text": "I have been sick for around 3 days after eating a lot of seafood, the symptoms include a mild headache, high fever, and high diarrhea. The symptoms started on august 10"}
    """

    message = DiagonsisRawRequest(text=request['text'])

    try:
        result = await send_sync_message(
            destination=env_helper.AGENT_ADRESS,
            message=message,
        )
        
        return json.loads(result)

    except Exception as e:
        print(f"Error sending message: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")