from services.bedrock_service import BedrockService
from services.message_serivce import MessageService
from models.request.message_request import MessageRequest
from models.request.conversation_request import ConversationRequest
from services.conversation_service import ConversationService
from botocore.exceptions import ClientError
from services.kb_service import KnowledgeBaseService
from models.request.question_request import QuestionRequest
from typing import Annotated
from services.trip_service import TripService
from database.database import get_db
from fastapi import Depends
from services.auth_service import UserService
from models.request.auth_request import (AuthRequest, RegisterRequest)
from models.request.trip_request import TripRequest
from fastapi import HTTPException, Request, status
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from database.database import init_db
from models.trip import Trip
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from models.user import User
from models.trip import Trip

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom validation error handler for 422 responses
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for error in exc.errors():
        field = ".".join(str(loc) for loc in error["loc"][1:])  # Skip 'body' prefix
        errors.append({
            "field": field,
            "message": error["msg"],
            "type": error["type"]
        })
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "status": False,
            "message": "Validation error",
            "errors": errors
        }
    )

init_db()

# a Get endpoint at the root path
@app.get("/")
def home():
    return {
        "message": "Welcome to KelanaAI"
    }

@app.get("/health")
def health():
    return {
        "status": "ok"
    }

@app.post("/api/v1/auth/register", status_code=status.HTTP_201_CREATED)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    try:
        new_user =  UserService.register(request, db)

        return {
            "status": True,
            "message": "You've successfully registered",
            "data": new_user
        }
        
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@app.post("/api/v1/auth/login", status_code=status.HTTP_200_OK)
def login(request: AuthRequest, db: Session = Depends(get_db)):
    try:
        user = UserService.get_user(request.email, db)

        if user is None or not UserService.verify_password(request.password, user.password_hash):
            raise ValueError("Invalid email or password")

        token = UserService.create_access_token(user)

        return {
            "status": True,
            "message": "Auth successfully done",
            "data": {
                "access_token": token
            }
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@app.get("/api/v1/auth/me")
def get_current_user(
    user: Annotated[User, Depends(UserService.get_current_user)],
):
    return {
        "status": True,
        "message": "Hello World!",
        "data": user
    }

@app.post("/api/v1/trips", status_code=status.HTTP_201_CREATED)
def create_trip(request: TripRequest, user: Annotated[User, Depends(UserService.get_current_user)], db: Session = Depends(get_db)):
    try:
        new_trip = TripService.store(request, user.id, db)

        return {
            "status": True,
            "message": "New trip added successfully",
            "data": new_trip
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@app.get("/api/v1/trips", status_code=status.HTTP_200_OK)
def get_trips(user: Annotated[User, Depends(UserService.get_current_user)], db: Session = Depends(get_db)):
    try:
        trips = TripService.get_trips(user.id, db)
        
        return {
            "status": True,
            "message": "Trips retrieved successfully",
            "data": trips
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@app.get("/api/v1/trips/{trip_id}", status_code=status.HTTP_200_OK)
def get_trip(trip_id: int, user: Annotated[User, Depends(UserService.get_current_user)], db: Session = Depends(get_db)):
    try:
        trip = TripService.get_trip(trip_id, user.id, db)
        
        return {
            "status": True,
            "message": "Trip retrieved successfully",
            "data": trip
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@app.put("/api/v1/trips/{trip_id}", status_code=status.HTTP_200_OK)
def update_trip(trip_id: int, request: TripRequest, user: Annotated[User, Depends(UserService.get_current_user)], db: Session = Depends(get_db)):
    try:
        trip = TripService.update_trip(trip_id, request, user.id, db)
        
        return {
            "status": True,
            "message": "Trip updated successfully",
            "data": trip
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@app.delete("/api/v1/trips/{trip_id}", status_code=status.HTTP_200_OK)
def delete_trip(trip_id: int, user: Annotated[User, Depends(UserService.get_current_user)], db: Session = Depends(get_db)):
    try:
        trip = TripService.delete_trip(trip_id, user.id, db)
        
        return {
            "status": True,
            "message": "Trip deleted successfully",
            "data": trip
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@app.post("/api/v1/ask", status_code=status.HTTP_200_OK)
def assist(requset: QuestionRequest, user: Annotated[User, Depends(UserService.get_current_user)]):
    try:
        result = KnowledgeBaseService().ask_knowledge_base(requset.query)
        return {
            "status": True,
            "message": "Knowledge base query retrieved successfully",
            "data": {
                "query": requset.query,
                "response": result
            }
        }
    except ClientError as exc:
            error = exc.response.get("Error", {})
            error_code = error.get("Code", "BedrockError")
            error_message = error.get("Message", "No error message returned")

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Bedrock request failed: {error_code} - {error_message}",
            ) from exc
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error while querying knowledge base: {e}")

@app.post("/api/v1/conversations", status_code=status.HTTP_201_CREATED)
def create_conversation(request: ConversationRequest, user: Annotated[User, Depends(UserService.get_current_user)], db: Session = Depends(get_db)):
    try:
        new_conversation = ConversationService.store(request, user.id, db)
        return {
            "status": True,
            "message": "Conversation created successfully",
            "data": new_conversation
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@app.get("/api/v1/conversations", status_code=status.HTTP_200_OK)
def get_conversations(user: Annotated[User, Depends(UserService.get_current_user)], db: Session = Depends(get_db)):
    try:
        conversations = ConversationService.get_conversations(user.id, db)
        return {
            "status": True,
            "message": "Conversations retrieved successfully",
            "data": conversations
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@app.get("/api/v1/conversations/{conversation_id}", status_code=status.HTTP_200_OK)
def get_conversation(conversation_id: int, user: Annotated[User, Depends(UserService.get_current_user)], db: Session = Depends(get_db)):
    try:
        conversation = ConversationService.get_conversation(conversation_id, user.id, db)
        return {
            "status": True,
            "message": "Conversation retrieved successfully",
            "data": conversation
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@app.put("/api/v1/conversations/{conversation_id}", status_code=status.HTTP_200_OK)
def update_conversation(conversation_id: int, request: ConversationRequest, user: Annotated[User, Depends(UserService.get_current_user)], db: Session = Depends(get_db)):
    try:
        conversation = ConversationService.update_conversation(conversation_id, request, user.id, db)
        return {
            "status": True,
            "message": "Conversation updated successfully",
            "data": conversation
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@app.delete("/api/v1/conversations/{conversation_id}", status_code=status.HTTP_200_OK)
def delete_conversation(conversation_id: int, user: Annotated[User, Depends(UserService.get_current_user)], db: Session = Depends(get_db)):
    try:
        conversation = ConversationService.delete_conversation(conversation_id, user.id, db)
        return {
            "status": True,
            "message": "Conversation deleted successfully",
            "data": conversation
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@app.post("/api/v1/conversations/{conversation_id}/messages", status_code=status.HTTP_201_CREATED)
def send_message(conversation_id: int, request: MessageRequest, user: Annotated[User, Depends(UserService.get_current_user)], db: Session = Depends(get_db)):
    try:
        conversation = ConversationService.get_conversation(conversation_id, user.id, db)
       
        MessageService.store(request, conversation.id, "user", db)

        messages = MessageService.get_messages(conversation.id, db)

        ai_response = BedrockService.get_chat_response(messages)

        new_ai_message = MessageService.store(ai_response, conversation.id, "assistant", db)
        
        return {
            "status": True,
            "message": "Message added successfully",
            "data": new_ai_message
        }
    except ClientError as exc:
        error = exc.response.get("Error", {})
        error_code = error.get("Code", "BedrockError")
        error_message = error.get("Message", "No error message returned")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Bedrock request failed: {error_code} - {error_message}",
        ) from exc
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@app.get("/api/v1/conversations/{conversation_id}/messages", status_code=status.HTTP_200_OK)
def get_messages(conversation_id: int, user: Annotated[User, Depends(UserService.get_current_user)], db: Session = Depends(get_db)):
    try:
        conversation = ConversationService.get_conversation(conversation_id, user.id, db)
        messages = MessageService.get_messages(conversation.id, db)
        return {
            "status": True,
            "message": "Messages retrieved successfully",
            "data": messages
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@app.get("/api/v1/conversations/{conversation_id}/messages/{message_id}", status_code=status.HTTP_200_OK)
def get_message(conversation_id: int, message_id: int, user: Annotated[User, Depends(UserService.get_current_user)], db: Session = Depends(get_db)):
    try:
        conversation = ConversationService.get_conversation(conversation_id, user.id, db)

        message = MessageService.get_message(message_id, conversation.id, db)
        return {
            "status": True,
            "message": "Message retrieved successfully",
            "data": message
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@app.put("/api/v1/conversations/{conversation_id}/messages/{message_id}", status_code=status.HTTP_200_OK)
def update_message(conversation_id: int, message_id: int, request: MessageRequest, user: Annotated[User, Depends(UserService.get_current_user)], db: Session = Depends(get_db)):
    try:
        conversation = ConversationService.get_conversation(conversation_id, user.id, db)
        message = MessageService.update_message(message_id, conversation.id, request, db)
        return {
            "status": True,
            "message": "Message updated successfully",
            "data": message
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@app.delete("/api/v1/conversations/{conversation_id}/messages/{message_id}", status_code=status.HTTP_200_OK)
def delete_message(conversation_id: int, message_id: int, user: Annotated[User, Depends(UserService.get_current_user)], db: Session = Depends(get_db)):
    try:
        conversation = ConversationService.get_conversation(conversation_id, user.id, db)
        message = MessageService.delete_message(message_id, conversation.id, db)
        return {
            "status": True,
            "message": "Message deleted successfully",
            "data": message
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@app.get("/api/v1/trip-categories")
def get_trip_categories():
    return TripService.trip_categories()

@app.get("/api/v1/recommendations")
def get_recommendations():
    return TripService.get_recommended_places()

@app.get("/api/v1/transportations")
def get_transportations():
    return TripService.trip_transportations()
