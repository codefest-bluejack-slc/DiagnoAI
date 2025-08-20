from elasticsearch import Elasticsearch
from helpers import env_helper

es = Elasticsearch(env_helper.ELASTIC_HOST)

class ElasticsearchRetriever:
    @staticmethod
    def search(index: str, query: str, total_result: int, column: str):
        print("Searching not from cache")
        query_result = es.search(
            index=index,
            size=total_result,
            query={
                'match': {
                    column: query
                }
            }
        )

        hits = query_result['hits']['hits']
        return hits

    @staticmethod
    def search_all(index: str):
        res = es.search(
            index=index,
            query={
                "match_all": {}
            }
        )

        print(res)