from pydantic import Field
from pydantic import BaseModel
class ConversationRequest(BaseModel):
    title: str = Field(..., max_length=255, description="Conversation title")
