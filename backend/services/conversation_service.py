from fastapi import status
from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from models.conversation import Conversation

class ConversationService:

    @classmethod
    def store(cls, request: object, user_id: int, db: Session) -> Conversation:
        new_conversation = Conversation(
            user_id = user_id,
            title = request.title
        )

        try:
            db.add(new_conversation)
            db.commit()
            db.refresh(new_conversation)

            return new_conversation
        except SQLAlchemyError as e:
            db.rollback()
            raise ValueError(f"Error occured: {e}")

    @classmethod
    def get_conversations(cls, user_id: int, db: Session) -> list[Conversation]:
        try:
            return db.query(Conversation).filter(
                Conversation.user_id == user_id
            ).order_by(Conversation.created_at.desc()).all()
        except SQLAlchemyError as e:
            raise ValueError(f"Error occured: {e}")

    @classmethod
    def get_conversation(cls, conversation_id: int, user_id: int, db: Session) -> Conversation:
        try:
            conversation = db.query(Conversation).filter(
                Conversation.id == conversation_id,
                Conversation.user_id == user_id
            ).first()
        except SQLAlchemyError as e:
            raise ValueError(f"Error occured: {e}")

        if conversation is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")

        if conversation.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this conversation")

        return conversation
    
    @classmethod
    def update_conversation(cls, conversation_id: int, request: object, user_id: int, db: Session) -> Conversation:
        try:
            conversation = db.query(Conversation).filter(
                Conversation.id == conversation_id,
                Conversation.user_id == user_id
            ).first()
        except SQLAlchemyError as e:
            raise ValueError(f"Error occured: {e}")

        if conversation is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")

        if conversation.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this conversation")

        conversation.title = request.title

        try:
            db.commit()
            db.refresh(conversation)

            return conversation
        except SQLAlchemyError as e:
            db.rollback()
            raise ValueError(f"Error occured: {e}")
    
    @classmethod
    def delete_conversation(cls, conversation_id: int, user_id: int, db: Session) -> Conversation:
        try:
            conversation = db.query(Conversation).filter(
                Conversation.id == conversation_id,
                Conversation.user_id == user_id
            ).first()
        except SQLAlchemyError as e:
            raise ValueError(f"Error occured: {e}")

        if conversation is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")

        if conversation.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this conversation")

        try:
            db.delete(conversation)
            db.commit()

            return conversation
        except SQLAlchemyError as e:
            db.rollback()
            raise ValueError(f"Error occured: {e}")