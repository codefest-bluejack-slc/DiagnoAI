import os
from uagents import Agent, Context
from models.api import RecommendationAgentRequest, RecommendationAgentResponse
from config import EnvLoader
from services import OpenFDAService, RecommendationService

class RecommendationAgent:
    def __init__(self):
        self.seed_value = EnvLoader.get_str("SEED_VALUE")
        self.recommendation_service = RecommendationService()
        
        self.agent = Agent(
            name="Recommendation Agent",
            seed=self.seed_value,
            port=8000,
            mailbox=True,
            publish_agent_details=True,
        )
        
        self._register_handlers()
    
    def _register_handlers(self):
        self.agent.on_message(model=RecommendationAgentRequest, replies=RecommendationAgentResponse)(self.handle_ai_request)
        self.agent.on_event("startup")(self._startup_handler)
    
    async def handle_ai_request(self, ctx: Context, sender: str, msg: RecommendationAgentRequest):
        ctx.logger.info(f"Received question from {sender}: {msg.question}")
        response_text, medicine_list = self.recommendation_service.send_query(msg.question)
        ctx.logger.info(f"Response: {response_text}")
        ctx.logger.info(f"Medicines: {medicine_list}")
        await ctx.send(sender, RecommendationAgentResponse(answer=response_text, medicines=medicine_list))
    
    async def _startup_handler(self, ctx: Context):
        ctx.logger.info(f"Agent address: {self.agent.address}")
        
        try:
            await self._initialize_elasticsearch(ctx)
        except Exception as e:
            ctx.logger.error(f"Error initializing Elasticsearch: {e}")
    
    async def _initialize_elasticsearch(self, ctx: Context):
        openfda_service = OpenFDAService()
        
        if not openfda_service.check_connection():
            ctx.logger.error("Failed to connect to Elasticsearch")
            return
            
        ctx.logger.info("Elasticsearch connection successful")
        
        if not openfda_service.es_client.indices.exists(index=openfda_service.index_name):
            ctx.logger.info("Creating index and indexing data...")
            openfda_service.create_index()
            await self._index_openfda_data(ctx, openfda_service)
        else:
            doc_count = openfda_service.es_client.count(index=openfda_service.index_name)['count']
            if doc_count == 0:
                ctx.logger.info("Index exists but is empty. Indexing data...")
                await self._index_openfda_data(ctx, openfda_service)
            else:
                ctx.logger.info(f"Index already exists with {doc_count} documents. Skipping indexing.")
    
    async def _index_openfda_data(self, ctx: Context, openfda_service: OpenFDAService):
        openfda_dir = "./data/openfda/filtered"
        json_files = [f for f in os.listdir(openfda_dir) if f.endswith('.json')]
        ctx.logger.info(f"Found {len(json_files)} JSON files to index")
        
        for json_file in sorted(json_files):
            file_path = os.path.join(openfda_dir, json_file)
            ctx.logger.info(f"Indexing {json_file}...")
            openfda_service.index_data(file_path=file_path)
    
    def run(self):
        self.agent.run()
    
    @property
    def address(self):
        return self.agent.address