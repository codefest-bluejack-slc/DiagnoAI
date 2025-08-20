import json
import re
from models import DiagnosisFromSymptomsRequest, DiagnosisResponse, DiagonsisRawRequest, RecommendationAgentRequest, RecommendationAgentResponse
from processes.fetch_documents import fetch_documents
from processes.process_documents import process_documents
from llm import gemini_llm
from uagents.query import send_sync_message
from helpers import env_helper

def get_diagnosis(request: DiagnosisFromSymptomsRequest) -> DiagnosisResponse:
    symptom_formatted = ", ".join(symptom.name for symptom in request.symptoms)
    documents = fetch_documents(query=symptom_formatted)
    result = process_documents(
        request=request,
        documents=documents
    )
    return DiagnosisResponse(diagnosis=str(result))

def clean_llm_json(raw: str) -> str:
    """
    Remove markdown code fences and extra whitespace.
    """
    cleaned = raw.strip()

    cleaned = re.sub(r"^```(json)?", "", cleaned).strip()

    cleaned = re.sub(r"```$", "", cleaned).strip()

    return cleaned

def get_diagnosis_raw(request: DiagonsisRawRequest) -> DiagnosisResponse:
    prompt = request.text + '\n'
    prompt += "can you format the following information in JSON format:\n"
    prompt += "{\n"
    prompt += '    "description": "",\n'
    prompt += '    "symptoms": [\n'
    prompt += '        {"name": "", "severity": ""},\n'
    prompt += '        {"name": "", "severity": ""},\n'
    prompt += '        {"name": "", "severity": ""}\n'
    prompt += '    ],\n'
    prompt += '    "since": ""\n //please provide the date in YYYY-MM-DD format\n'
    prompt += "}\n"

    try:
        req_json_result = gemini_llm.answer(prompt)
        req_json_result = clean_llm_json(req_json_result)
        print(f'Cleaned: {req_json_result}')
        parsed = json.loads(req_json_result)
        diagnosis = DiagnosisFromSymptomsRequest(**parsed)
        print(diagnosis)

        return get_diagnosis(diagnosis)

    except Exception as e:
        print(f"Error parsing JSON: {e}")
        return DiagnosisResponse(diagnosis="Error parsing the response from the LLM.")
    
def get_recommended_medicine(disease: str) -> RecommendationAgentResponse:
    message = RecommendationAgentRequest(
        question=disease
    )

    response = send_sync_message(
        destination=env_helper.RECOMMENDATION_AGENT_ADDRESS,
        message=message
    )

    return response