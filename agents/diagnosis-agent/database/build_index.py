import logging
from datasets import load_dataset
from typing import List, Dict
from elasticsearch import Elasticsearch
from helpers import env_helper
from database.elasticsearch_retriever import ElasticsearchRetriever

client = Elasticsearch(env_helper.ELASTIC_HOST)
logging = logging.getLogger(__name__)

def gather_medical_dataset():
    ds = load_dataset("QuyenAnhDE/Diseases_Symptoms")
    dataset = ds['train']
    documents = []
    for row in dataset:
        print(row)
        documents.append(row)

    return documents

def insert_documents(index: str, documents: List[Dict]):
    operations = []
    for document in documents:
        operations.append({'index': {'_index': index}})
        operations.append(document)

    client.bulk(operations=operations)

def build_medical_index():
    if client.indices.exists(index=env_helper.MEDICAL_INDEX):
        logging.info("Medical index already exists")
        return

    logging.info("Building medical index")
    documents = gather_medical_dataset()
    insert_documents(env_helper.MEDICAL_INDEX, documents)

def test_index():
    result = ElasticsearchRetriever.search_all(env_helper.MEDICAL_INDEX)
    print(result)

def build_all_index():
    logging.info("Building all index for the application")
    build_medical_index()
    # test_index()