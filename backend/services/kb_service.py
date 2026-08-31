from urllib.parse import unquote
from urllib.parse import urlparse
from services.bedrock_service import BedrockService
import os

class KnowledgeBaseService:
    def __init__(self):
        self.client = BedrockService.get_client("bedrock-agent-runtime")

    @staticmethod
    def get_knowledge_base_id():
        return os.getenv("KNOWLEDGE_BASE_ID")

    @staticmethod
    def get_source_uri(location: dict) -> str | None:
        if not location:
            return None

        location_type = location.get("type")
        if not location_type:
            return None

        source = location.get(f"{location_type.lower()}Location", {})
        return source.get("uri") or source.get("url")

    @staticmethod
    def get_document_title(self, result: dict) -> str:
        metadata = result.get("metadata", {})

        for key in ("title", "document_title", "documentTitle", "file_name", "filename"):
            if metadata.get(key):
                return str(metadata[key])

        source_uri = self.get_source_uri(result.get("location", {}))
        if source_uri:
            path = urlparse(source_uri).path
            filename = os.path.basename(unquote(path))
            if filename:
                return filename

        return "Untitled source"

    def get_context(self, query: str):
        kb_context = self.client.retrieve(
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

        chunks = []
        documents = []
        seen_documents = set()

        for result in kb_context.get("retrievalResults", []):
            text= result.get("content", {}).get("text")
            
            if not text:
                continue

            chunks.append(text)
            
            title = self.get_document_title(self, result)

            if title not in seen_documents:
                seen_documents.add(title)
                documents.append(title)

        context = "\n\n".join(chunks) or "No relevant context was found in our knowledge base. Please check the documents or try a different question."
        
        return context, documents
    
    def ask_knowledge_base(self, query: str):
        context, documents = self.get_context(query)
        
        prompt = (
            "You are a helpful travel assistant.\n"
            "\n"
            "Answer the users question based on the context below.\n"
            "If the answer is not in the context, say so.\n"
            "Do not answer questions that are not related to travel or Kelana AI.\n\n"
            f"Context:\n{context}\n\n"
            f"Question:\n{query}\n\n"
            "- Use markdown formatting (bold, lists, etc.) within the answer field\n\n"
            "- Return ONLY the answer text, no JSON object, no answer as JSON object, no documents as JSON object, no additional text, just pure text\n"
        )

        generated_response = BedrockService.get_ai_recommendation(None, prompt)
        
        return {
            "answer": generated_response,
            "documents": documents,
        }
        # return response["retrievalResults"][0]
        
    