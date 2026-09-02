from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy import DateTime
from sqlalchemy import Column, SmallInteger, String, Numeric, Text, JSON, Integer
from sqlalchemy.sql import func
from database.database import Base

class Trip(Base):
    __tablename__ = "trips"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    destination = Column(String, nullable=False)
    days = Column(SmallInteger, nullable=False)
    currency = Column(String(50), nullable=False)
    budget = Column(Numeric(15, 2), nullable=False)
    category = Column(String(50), nullable=False)
    daily_budget = Column(Numeric(15, 2), nullable=False)
    travel_style = Column(String(100), nullable=False)
    additional_context = Column(Text, nullable=True)
    ai_recommendation = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("User", back_populates="trips")