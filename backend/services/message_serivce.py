from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from models.message import Message
from models.request.message_request import MessageRequest
class MessageService:

    @classmethod
    def store(cls, request: MessageRequest | str, conversation_id: int, role: str, db: Session):
        try:
            if isinstance(request, str):
                request = MessageRequest(content=request)
                
            new_message = Message(
                conversation_id=conversation_id,
                role=role,
                content=request.content
            )
            db.add(new_message)
            db.commit()
            db.refresh(new_message)
            return new_message
        except SQLAlchemyError as e:
            db.rollback()
            raise ValueError(f"Error occured: {e}")

    @classmethod
    def get_messages(cls, conversation_id: int, db: Session):
        try:
            return db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.created_at.asc(), Message.id.asc()).all()
        except SQLAlchemyError as e:
            raise ValueError(f"Error occured: {e}")

    @classmethod
    def get_message(cls, message_id: int, conversation_id: int, db: Session):
        try:
            return db.query(Message).filter(Message.id == message_id and Message.conversation_id == conversation_id).first()
        except SQLAlchemyError as e:
            raise ValueError(f"Error occured: {e}")

    @classmethod
    def update_message(cls, message_id: int, conversation_id: int, request: MessageRequest, db: Session):
        try:
            message = cls.get_message(message_id, conversation_id, db)
            message.content = request.content
            db.commit()
            db.refresh(message)
            return message
        except SQLAlchemyError as e:
            db.rollback()
            raise ValueError(f"Error occured: {e}")

    @classmethod
    def delete_message(cls, message_id: int, conversation_id: int, db: Session):
        try:
            message = cls.get_message(message_id, conversation_id, db)
            db.delete(message)
            db.commit()
            return message
        except SQLAlchemyError as e:
            db.rollback()
            raise ValueError(f"Error occured: {e}")