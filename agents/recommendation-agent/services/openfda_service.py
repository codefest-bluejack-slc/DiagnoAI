from config import EnvLoader
import json
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk
from typing import Iterator, Dict, Any, Set
import time

class OpenFDAService:
    def __init__(self):
        self.es_host = EnvLoader.get_str("OPENFDA_URL")
        self.es_client = Elasticsearch(self.es_host, request_timeout=30)
        self.index_name = EnvLoader.get_str("OPENFDA_INDEX")
        
        self.seen_brand_names: Set[str] = set()
        self.seen_generic_names: Set[str] = set()

    def check_connection(self) -> bool:
        max_retries = 30
        retry_delay = 2
        
        for attempt in range(max_retries):
            try:
                self.es_client.cluster.health(timeout="1s")
                print("Connected to Elasticsearch!")
                return True
            except Exception as e:
                if attempt < max_retries - 1:
                    print(f"Connection attempt {attempt + 1}/{max_retries} failed, retrying in {retry_delay}s...")
                    time.sleep(retry_delay)
                else:
                    print(f"Connection failed after {max_retries} attempts: {e}")
                    return False
        return False
        
    def create_index(self):
        if self.es_client.indices.exists(index=self.index_name):
            print(f"Index '{self.index_name}' already exists. Deleting it...")
            self.es_client.indices.delete(index=self.index_name)

        mapping = {
            "mappings": {
                "properties": {
                    "searchable_text": {"type": "text"},

                    "brand_name": {
                        "type": "text",
                        "fields": {"keyword": {"type": "keyword"}}
                    },
                    "generic_name": {
                        "type": "text",
                        "fields": {"keyword": {"type": "keyword"}}
                    },
                    "manufacturer_name": {"type": "keyword"},
                    "product_ndc": {"type": "keyword"},
                    "route": {"type": "keyword"},
                    "product_type": {"type": "keyword"},
                    "set_id": {"type": "keyword"},

                    "original_document": {"type": "object", "enabled": False} # prevent indexing
                }
            }
        }

        print(f"Creating new index '{self.index_name}'...")
        self.es_client.indices.create(index=self.index_name, body=mapping)
        
        self.seen_brand_names.clear()
        self.seen_generic_names.clear()

    def _normalize_name(self, name_list):
        if not name_list:
            return set()
        return {name.lower().strip() for name in name_list if name and name.strip()}

    def _generate_documents(self, file_path: str) -> Iterator[Dict[str, Any]]:
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)
        except FileNotFoundError:
            print(f"File was not found at {file_path}")
            return

        records = data.get('results', [])
        print(f"Processing {len(records)} records from {file_path}...")

        for record in records:
            openfda = record.get('openfda', {})
            
            brand_names = openfda.get('brand_name', [])
            generic_names = openfda.get('generic_name', [])
            
            normalized_brand_names = {name.lower().strip() for name in brand_names if name and name.strip()}
            normalized_generic_names = {name.lower().strip() for name in generic_names if name and name.strip()}
            
            if not normalized_brand_names and not normalized_generic_names:
                continue
            
            if normalized_brand_names & self.seen_brand_names:
                continue
                
            if normalized_generic_names & self.seen_generic_names:
                continue
            
            self.seen_brand_names.update(normalized_brand_names)
            self.seen_generic_names.update(normalized_generic_names)

            text_fields_to_combine = [
                'indications_and_usage', 'dosage_and_administration', 'warnings',
                'active_ingredient', 'inactive_ingredient', 'purpose', 'description',
                'adverse_reactions', 'contraindications', 'drug_interactions',
                'clinical_pharmacology', 'boxed_warning', 'stop_use', 'do_not_use'
            ]

            searchable_content = []
            for field in text_fields_to_combine:
                content = record.get(field)
                if content and isinstance(content, list):
                    searchable_content.extend(content)

            processed_doc = {
                "_index": self.index_name,
                "_source": {
                    "searchable_text": " ".join(searchable_content),
                    "brand_name": openfda.get('brand_name', []),
                    "generic_name": openfda.get('generic_name', []),
                    "manufacturer_name": openfda.get('manufacturer_name', []),
                    "product_ndc": openfda.get('product_ndc', []),
                    "route": openfda.get('route', []),
                    "product_type": openfda.get('product_type', []),
                    "set_id": record.get('set_id'),
                    "original_document": record 
                }
            }
            yield processed_doc

    def index_data(self, file_path: str):
        print(f"Starting to index data from '{file_path}'...")
        start_time = time.time()

        try:
            success, errors = bulk(
                self.es_client,
                self._generate_documents(file_path),
                chunk_size=1000,
                raise_on_error=False
            )
            
            end_time = time.time()
            duration = end_time - start_time

            print(f"Indexing complete for {file_path}")
            print(f"   - Successfully indexed documents: {success}")
            print(f"   - Failed documents: {len(errors)}")
            print(f"   - Duration: {duration:.2f} seconds")
            if errors:
                print("First 5 errors:", errors[:5])

        except Exception as e:
            print(f"An error occurred during bulk indexing: {e}")

    def search(self, query_text: str, top_n: int = 4) -> list:
        print(f"Searching for {query_text}...")

        query = {
            "size": top_n,
            "query": {
                "match": {
                    "searchable_text": query_text
                }
            },
            "_source": {
                "excludes": ["original_document"]
            }
        }

        try:
            response = self.es_client.search(index=self.index_name, body=query)
            results = [hit['_source'] for hit in response['hits']['hits']]
            return results
        except Exception as e:
            print(f"Error when searching: {e}")
            return []