from fastapi import HTTPException, Request, status
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, field_validator
from services.trip_service import (
    calculate_daily_budget,
    get_trip_category,
    transport_recommendation,
    trip_categories,
    get_recommended_places,
    trip_transportations
)
from services.bedrock_service import (
    get_ai_recommendation
)
from database import SessionLocal, init_db
from models.trip import Trip
from fastapi.middleware.cors import CORSMiddleware

class TripRequest(BaseModel):
    destination: str = Field(..., min_length=1, max_length=100, description="Trip destination")
    days: int = Field(..., gt=0, le=365, description="Number of days (1-365)")
    currency: str = Field(..., min_length=3, max_length=3, description="Currency code (3 letters)")
    budget: float = Field(..., gt=0, description="Total budget (must be positive)")
    travel_style: str = Field(..., min_length=1, max_length=50, description="Travel style")

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

@app.post("/api/v1/trips")
def create_trip(request: TripRequest):
    daily_budget = calculate_daily_budget(request.budget, request.days)
    category = get_trip_category(request.budget)
    # recommendation_transport = transport_recommendation(request.travel_style)
    # recommended_places = get_recommended_places(request.destination)

    new_trip = Trip(
        destination = request.destination,
        days = request.days,
        currency = request.currency,
        budget = request.budget,
        category = category,
        travel_style = request.travel_style,
        daily_budget = daily_budget,
    )

    ai_recommendation = get_ai_recommendation(new_trip)

    new_trip.ai_recommendation = ai_recommendation

    db = SessionLocal()
    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)
    db.close()

    return {
        "status": True,
        "message": "New trip added successfully",
        "data": new_trip
    }

@app.get("/api/v1/trips")
def list_trips():
    db = SessionLocal();
    trips = db.query(Trip).all()
    db.close()
    
    return {
        "status": True,
        "data": trips
    }

@app.get("/api/v1/trips/{trip_id}")
def get_trip(trip_id: int):
    db = SessionLocal()
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    db.close()

    if trip is None:
        raise HTTPException(status_code = 404, detail = f"Trip with id {trip_id} not found")

    return {
        "status": True,
        "data": trip
    }

@app.put("/api/v1/trips/{trip_id}")
def update_trip(trip_id: int, request: TripRequest):
    db = SessionLocal();
    trip = db.query(Trip).filter(Trip.id == trip_id).first()

    if trip is None:
        raise HTTPException(status_code = 404, detail = f"Trip with id {trip_id} not found")

    else:
        daily_budget = calculate_daily_budget(request.budget, request.days)
        category = get_trip_category(request.budget)

        trip.destination = request.destination
        trip.days = request.days
        trip.currency = request.currency
        trip.budget = request.budget
        trip.travel_style = request.travel_style
        trip.category = category
        trip.daily_budget = daily_budget

        db.commit()
        db.refresh(trip)
        db.close()

        return {
            "status": True,
            "message": "Trip updated successfully",
            "data": trip
        }

@app.delete("/api/v1/trips/{trip_id}")
def delete_trip(trip_id: int):
    db = SessionLocal()
    trip = db.query(Trip).filter(Trip.id == trip_id).first()

    if trip is None:
        raise HTTPException(status_code = 404, detail = f"Trip with id {trip_id} not found")

    deleted_trip = trip

    db.delete(trip)
    db.commit()
    db.close()

    return {
        "status": True,
        "message": f"Trip {trip_id} successfully deleted",
        "data": deleted_trip
    }

@app.get("/api/v1/trips/{trip_id}/generate")
def get_ai_recommendations(trip_id: int):
    db = SessionLocal();
    trip = db.query(Trip).filter(Trip.id == trip_id).first()

    if trip is None:
        raise HTTPException(status_code = 404, detail = f"Trip with id {trip_id} not found")

    else:
        ai_recommendation = get_ai_recommendation(trip)

        trip.ai_recommendation = ai_recommendation

        db.commit()
        db.refresh(trip)
        db.close()

        return {
            "status": True,
            "message": "Trip recommendation generated successfully",
            "data": trip
        }

@app.get("/api/v1/trip-categories")
def get_trip_categories():
    return trip_categories()

@app.get("/api/v1/recommendations")
def get_recommendations():
    return get_recommended_places()

@app.get("/api/v1/transportations")
def get_transportations():
    return trip_transportations();
