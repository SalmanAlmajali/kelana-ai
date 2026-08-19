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

    recommended_places = get_recommended_places(
        request.destination
    )

    return {
        "destination" : request.destination,
        "days": request.days,
        "budget" : request.budget,
        "daily_budget" : daily_budget,
        "category" : category,
        "recommendation_transport": recommendation_transport,
        "recommended_places": recommended_places,
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
