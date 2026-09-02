from pydantic import BaseModel, Field
class MessageRequest(BaseModel):
    content: str = Field(..., description="Message content")