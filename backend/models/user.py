from sqlalchemy.orm import deferred
from sqlalchemy.orm import relationship
from sqlalchemy import DateTime
from sqlalchemy import Column, Integer, String
from sqlalchemy.sql import func
from database.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String, nullable=False, unique=True)
    password_hash = deferred(Column(String, nullable=False))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    trips = relationship("Trip", back_populates="user")
    conversations = relationship("Conversation", back_populates="user")