from sqlalchemy import null
from sqlalchemy import DateTime
from sqlalchemy import Column, Integer, String, Float, Text, JSON
from sqlalchemy.sql import func
from database import Base

class Trip(Base):
    __tablename__ = "trips"
    id = Column(Integer, primary_key=True)
    destination = Column(String, nullable=False)
    days = Column(Integer, nullable=False)
    currency = Column(String, nullable=False)
    budget = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    daily_budget = Column(Float, nullable=False)
    travel_style = Column(Text, nullable=False)
    ai_recommendation = Column(JSON, nullable=True)  # Changed to JSON to store structured data
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)