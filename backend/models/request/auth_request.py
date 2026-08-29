from pydantic import EmailStr
from pydantic import Field
from pydantic import BaseModel

class AuthRequest(BaseModel):
    email: EmailStr = Field(..., max_length=255, description="Registered user email address")
    password: str = Field(..., min_length=6, description="Registered user password")

class RegisterRequest(BaseModel):
    name: str = Field(..., max_length=255, description="User name to be registered")
    email: EmailStr = Field(..., max_length=255, description="User email address to be registered")
    password: str = Field(..., min_length=6, description="User password to be registered")
