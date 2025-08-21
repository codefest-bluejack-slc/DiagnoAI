import json
import re
from models import DiagnosisFromSymptomsRequest, DiagnosisResponse, DiagonsisRawRequest, RecommendationAgentRequest, RecommendationAgentResponse, Symptom
from processes.fetch_documents import fetch_documents
from processes.process_documents import process_documents
from llm import gemini_llm
from uagents.query import send_sync_message
from helpers import env_helper
from datetime import date

def get_diagnosis(request: DiagnosisFromSymptomsRequest) -> DiagnosisResponse:
    symptom_formatted = ", ".join(symptom.name for symptom in request.symptoms)
    documents = fetch_documents(query=symptom_formatted)
    result = process_documents(
        request=request,
        documents=documents
    )

    disease = documents[0].name
    recommendation_response = get_recommended_medicine(disease=disease)
    print(f'LIAT SINI PAUL {recommendation_response}')

    return DiagnosisResponse(diagnosis=str(result))

def clean_llm_json(raw: str) -> str:
    """
    Remove markdown code fences and extra whitespace.
    """
    cleaned = raw.strip()

    cleaned = re.sub(r"^```(json)?", "", cleaned).strip()

    cleaned = re.sub(r"```$", "", cleaned).strip()

    return cleaned

def get_structure_from_raw_text(raw_text: str) -> DiagnosisFromSymptomsRequest:
    """
    Converts free-text input into a structured DiagnosisFromSymptomsRequest
    using the Gemini LLM.
    """
    prompt = raw_text + '\n'
    prompt += "Can you format the following information in JSON format:\n"
    prompt += "{\n"
    prompt += '    "description": "",\n'
    prompt += '    "symptoms": [\n'
    prompt += '        {"name": "", "severity": ""},\n'
    prompt += '        {"name": "", "severity": ""},\n'
    prompt += '        {"name": "", "severity": ""}\n'
    prompt += '    ],\n'
    prompt += '    "since": ""\n // please provide the date in YYYY-MM-DD format\n'
    prompt += "}\n"

    try:
        req_json_result = gemini_llm.answer(prompt)

        req_json_result = clean_llm_json(req_json_result)
        print(f'Cleaned: {req_json_result}')

        parsed = json.loads(req_json_result)

        response = DiagnosisFromSymptomsRequest(
            description=parsed['description'],
            symptoms=[Symptom(**s) for s in parsed["symptoms"]],
            since=date.fromisoformat(parsed["since"])
        )

        return response

    except Exception as e:
        print(f"Error parsing JSON: {e}")
        raise


def get_diagnosis_raw(request: DiagonsisRawRequest) -> DiagnosisResponse:
    """
    Handles raw text input by converting it into structured format
    and then running the normal diagnosis pipeline.
    """
    try:
        diagnosis_request = get_structure_from_raw_text(request.text)
        print(diagnosis_request)

        return get_diagnosis(diagnosis_request)

    except Exception:
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