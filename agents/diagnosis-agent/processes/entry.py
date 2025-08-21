import json
import re
import asyncio
from models import DiagnosisFromSymptomsRequest, DiagnosisResponse, DiagonsisRawRequest, Symptom, RecommendationAgentResponse, RecommendationAgentRequest
from processes.fetch_documents import fetch_documents
from processes.process_documents import process_documents
from llm import gemini_llm
from uagents.query import send_sync_message
from helpers import env_helper
from datetime import date
from uagents import Context

async def get_diagnosis(ctx: Context, request: DiagnosisFromSymptomsRequest) -> DiagnosisResponse:
    symptom_formatted = ", ".join(symptom.name for symptom in request.symptoms)
    documents = fetch_documents(query=symptom_formatted)
    result = process_documents(
        request=request,
        documents=documents
    )

    disease = documents[0].name
    res = await get_recommended_medicine(ctx, disease=disease)
    print(f"Get Recommended Medicine At Get Diagnosis: {res}")

    return DiagnosisResponse(diagnosis=str(result), recommendation_agent_response=res)

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
    
async def get_recommended_medicine(ctx: Context, disease: str) -> RecommendationAgentResponse:
    message = RecommendationAgentRequest(
        question=disease
    )
    
    print(f"Requesting medicine...")

    reply, status = await ctx.send_and_receive (
        'agent1qgjequt609avltyjtg6xwzt87u7qu0e0666j72kygqu02tamh2ya2x53ksn',
        message,
        response_type=RecommendationAgentResponse
    )
    
    print(f"Get Recommended Medicine Status: {status}")
    print(f"Get Recommended Medicine Reply: {reply}")

    return reply