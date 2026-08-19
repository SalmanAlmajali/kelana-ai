from fastapi import FastAPI
from pydantic import BaseModel
from services.trip_service import (
    calculate_daily_budget,
    get_trip_category,
    transport_recommendation,
    trip_categories
)

class TripRequest(BaseModel):
    destination:    str
    days:           int
    budget:         float
    travel_style:   str

app = FastAPI()

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
    daily_budget = calculate_daily_budget(
        request.budget, request.days
    )

    category = get_trip_category(
        request.budget
    )

    recommendation_transport = transport_recommendation(
        request.travel_style
    )

    return {
        "destination" : request.destination,
        "days": request.days,
        "budget" : request.budget,
        "daily_budget" : daily_budget,
        "category" : category,
        "recommendation_transport": recommendation_transport,
    }

@app.get("/api/v1/trip-categories")
def get_trip_categories():
    return trip_categories()
