from pydantic import Field
from pydantic import BaseModel

class QuestionRequest(BaseModel):
    query: str = Field(..., description="User query")

