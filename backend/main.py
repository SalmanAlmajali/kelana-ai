from fastapi import HTTPException
from fastapi import FastAPI
from pydantic import BaseModel
from services.trip_service import (
    calculate_daily_budget,
    get_trip_category,
    transport_recommendation,
    trip_categories,
    get_recommended_places,
    trip_transportations
)
from database import SessionLocal, init_db
from models.trip import Trip

class TripRequest(BaseModel):
    destination:    str
    days:           int
    budget:         float
    # travel_style:   str

app = FastAPI()

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
        budget = request.budget,
        category = category,
        daily_budget = daily_budget,
    )

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
        trip.budget = request.budget
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

@app.get("/api/v1/trip-categories")
def get_trip_categories():
    return trip_categories()

@app.get("/api/v1/recommendations")
def get_recommendations():
    return get_recommended_places()

@app.get("/api/v1/transportations")
def get_transportations():
    return trip_transportations();
