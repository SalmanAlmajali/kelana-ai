from services.bedrock_service import BedrockService
import os

class KnowledgeBaseService:
    def __init__(self):
        self.client = BedrockService.get_client("bedrock-agent-runtime")

    def get_knowledge_base_id(self):
        return os.getenv("KNOWLEDGE_BASE_ID")
    
    def ask_knowledge_base(self, query: str):
        response = self.client.retrieve(
            knowledgeBaseId=self.get_knowledge_base_id(),
            retrievalConfiguration={
                "managedSearchConfiguration": {
                    "numberOfResults": 1,
                }
            },
            retrievalQuery={
                "text": query
            }            
        )
        return response["retrievalResults"][0]
        
    