import json
import re
import asyncio
from models import DiagnosisFromSymptomsRequest, DiagnosisResponse, DiagonsisRawRequest, Symptom, RecommendationAgentResponse, RecommendationAgentRequest
from processes.fetch_documents import fetch_documents
from processes.process_documents import process_documents, get_title_from_result
from llm import gemini_llm
from uagents.query import send_sync_message
from helpers import env_helper
from datetime import date
from uagents import Context

async def get_diagnosis(ctx: Context, request: DiagnosisFromSymptomsRequest) -> DiagnosisResponse:
    symptom_formatted = ", ".join(symptom.name for symptom in request.symptoms)
    documents = fetch_documents(query=symptom_formatted)
    
    if not documents:
        return DiagnosisResponse(diagnosis="No matching medical conditions found for your symptoms.")
    
    result = process_documents(
        request=request,
        documents=documents
    )

    title = get_title_from_result(result)

    disease = documents[0].name
    res = await get_recommended_medicine(ctx, disease=disease)
    print(f"Get Recommended Medicine At Get Diagnosis: {res}")

    return DiagnosisResponse(diagnosis=str(result), recommendation_agent_response=res, title=title)

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
    print(f"Structuring raw text: {raw_text}")
    
    if not raw_text.strip():
        raise ValueError("Empty input text provided")
    
    prompt = f"""
Please extract medical information from the following text and format it as JSON:

"{raw_text}"

Extract the symptoms mentioned, their severity levels, and any timeline information. Format the response as JSON with this exact structure:

{{
    "description": "Brief description of the condition/situation",
    "symptoms": [
        {{"name": "symptom_name", "severity": "mild|moderate|high|severe"}},
        {{"name": "symptom_name", "severity": "mild|moderate|high|severe"}}
    ],
    "since": "YYYY-MM-DD"
}}

Important:
- Extract actual symptoms mentioned in the text (headache, fever, nausea, etc.)
- Use severity levels: mild, moderate, high, or severe
- For the date, use the format YYYY-MM-DD. If no specific date is mentioned, estimate based on "3 days ago" etc.
- Only include symptoms that are actually mentioned in the text
- Provide a meaningful description based on the text

Respond only with the JSON, no additional text.
"""

    try:
        print("Calling Gemini LLM for text structuring...")
        req_json_result = gemini_llm.answer(prompt)
        print(f'Raw LLM result: {req_json_result}')

        req_json_result = clean_llm_json(req_json_result)
        print(f'Cleaned: {req_json_result}')

        parsed = json.loads(req_json_result)

        response = DiagnosisFromSymptomsRequest(
            description=parsed['description'],
            symptoms=[Symptom(**s) for s in parsed["symptoms"]],
            since=date.fromisoformat(parsed["since"])
        )

        print(f'Successfully structured: {response}')
        return response

    except Exception as e:
        print(f"Error parsing JSON: {e}")
        raise


async def get_diagnosis_raw(ctx: Context, request: DiagonsisRawRequest) -> DiagnosisResponse:
    """
    Handles raw text input by converting it into structured format
    and then running the normal diagnosis pipeline.
    """
    try:
        diagnosis_request = get_structure_from_raw_text(request.text)
        print(diagnosis_request)

        return await get_diagnosis(ctx, diagnosis_request)

    except Exception as e:
        print(f"Error in get_diagnosis_raw: {e}")
        return DiagnosisResponse(diagnosis="Error parsing the response from the LLM.")
    
async def get_recommended_medicine(ctx: Context, disease: str) -> RecommendationAgentResponse:
    try:
        message = RecommendationAgentRequest(
            question=disease
        )
        
        print(f"Requesting medicine for disease: {disease}")

        reply, status = await ctx.send_and_receive (
            'agent1qf6c3hmq7l83fepc9u5z86m65m7khul6wnaschjgjp2de8vc8jwfxu8w0m7',
            message,
            response_type=RecommendationAgentResponse,
            timeout=60
        )
        
        print(f"Get Recommended Medicine Status: {status}")
        print(f"Get Recommended Medicine Reply: {reply}")

        return reply
    except Exception as e:
        print(f"Error getting recommended medicine: {e}")
        return RecommendationAgentResponse(answer="Unable to get medicine recommendations at this time.")