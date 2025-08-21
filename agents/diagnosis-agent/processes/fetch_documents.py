from database import ElasticsearchRetriever
from helpers import env_helper
from models import DiagnosisDocument
from typing import List

def fetch_documents(query: str, size: int = 5) -> List[DiagnosisDocument]:
    """
    Fetch documents from the Elasticsearch index based on the provided query.
    
    Args:
        query (str): The search query to use for fetching documents.
        size (int): The number of documents to return. Default is 5.
    
    Returns:
        list: A list of documents matching the query.
    """
    try:
        print(f"Query: {query} Index: {env_helper.MEDICAL_INDEX}")
        informations: List[DiagnosisDocument] = []
        documents = ElasticsearchRetriever.search(
            index=env_helper.MEDICAL_INDEX,
            query=query,
            total_result=size,
            column="Symptoms"
        )

        for document in documents:
            source = document['_source']
            diagnosis_document = DiagnosisDocument(
                name=source['Name'],
                symptoms=source['Symptoms'].split(','),
                treatments=source['Treatments'].split(','),
                symptoms_formatted=source['Symptoms'],
                treatments_formatted=source['Treatments'],
            )

            informations.append(diagnosis_document)

        return informations
    except Exception as e:
        print(f"Error fetching documents: {e}")
        return []