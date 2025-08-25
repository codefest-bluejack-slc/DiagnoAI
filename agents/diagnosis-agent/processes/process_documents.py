from models import DiagnosisDocument, DiagnosisFromSymptomsRequest
from llm import gemini_llm
from typing import List

def format_informations(request: DiagnosisFromSymptomsRequest, documents: List[DiagnosisDocument]) -> str:
    symptoms_formatted = "".join([f'- {symptom.name} - {symptom.severity}\n' for symptom in request.symptoms])

    patient_description = (
        f"Description: {request.description}\n\n"
        f"Since: {request.since}\n"
        f"Symptoms:\n"
        f"{symptoms_formatted}\n"
    )

    documents_formatted = ''
    for document in documents:
        information = ''.join([
            f'Disease: {document.name}\n',
            f'Symptoms: {document.symptoms_formatted}\n\n'
        ])

        documents_formatted += information

    database_information = 'Information that have been gathered from our dataset\n'
    database_information += documents_formatted

    return patient_description + database_information

def process_documents(request: DiagnosisFromSymptomsRequest, documents: List[DiagnosisDocument]):
    prompt = format_informations(request, documents)
    print(f"prompt: {prompt}")

    return gemini_llm.answer(prompt)

def get_title_from_result(result: str) -> str:
    prompt = "".join([
        'Can you make me a title from the sentence below\n',
        result
    ])

    return gemini_llm.answer(prompt)