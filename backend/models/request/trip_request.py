from decimal import Decimal
from pydantic import PositiveInt
from pydantic import BaseModel, Field, field_validator

class TripRequest(BaseModel):
    destination: str = Field(..., max_length=255, description="Trip destination")
    days: PositiveInt = Field(..., le=365, description="Number of days (1-365)")
    currency: str = Field(..., max_length=3, description="Currency code (3 letters)")
    budget: Decimal = Field(..., gt=0, max_digits=15, decimal_places=2, description="Total budget (must be positive)")
    travel_style: str = Field(..., max_length=100, description="Travel style")
    additional_context: str = Field(description="Additional Context")

    @field_validator('currency')
    @classmethod
    def validate_currency(cls, v: str) -> str:
        return v.upper()
    
    @field_validator('destination', 'travel_style')
    @classmethod
    def validate_strings(cls, v: str) -> str:
        if not v.strip():
            raise ValueError('Field cannot be empty or contain only whitespace')
        return v.strip()