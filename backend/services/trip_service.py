from sqlalchemy.exc import SQLAlchemyError
from fastapi import status
from fastapi import HTTPException
from botocore.exceptions import ClientError
from services.bedrock_service import BedrockService
from sqlalchemy.orm import Session
from models.trip import Trip
from models.user import User

class TripService:
    
    @staticmethod
    def get_user_input():
        destination_list = []

        while True:
            destination = input("Destinations (type 'done' to finish): ")
            if destination.lower() == "done" or destination == "Done":
                break
            destination_list.append(destination)

        country = input("Country : ")
        days = int(input("Days : "))
        budget = float(input(f"Budget : "))
        currency = input("Currency : ")
        travel_style = input("Travel Style : ")
        travel_month = input("Travel Month : ")
        hotel_cost = float(input("Hotal Cost : "))
        transport_cost = float(input("Transportation Cost : "))
        food_cost = float(input("Food Cost : "))
        misc_cost = float(input("Miscellaneous Cost : "))

        return destination_list, country, days, budget, currency, travel_style, travel_month, hotel_cost, transport_cost, food_cost, misc_cost

    @staticmethod
    def calculate_daily_budget(budget, days):
        return budget/days

    @staticmethod
    def trip_categories():
        return [
            "Backpacker",
            "Standard",
            "Luxury"
        ]

    @staticmethod
    def trip_transportations():
        return [
            "Bus",
            "Train",
            "Flight"
        ]

    @classmethod
    def get_trip_category(cls, budget):
        if budget > 1000 and budget <= 3000:
            return cls.trip_categories()[1]
        elif budget > 3000:
            return cls.trip_categories()[2]

        return cls.trip_categories()[0]

    @classmethod
    def transport_recommendation(cls, travel_style):
        if travel_style.lower() == "backpacker":
            return cls.trip_transportations()[0] 
        elif travel_style.lower() == "family":
            return cls.trip_transportations()[1] 
        else:
            return cls.trip_transportations()[2]

    @staticmethod
    def get_travel_season(month):
        if month.lower() == "december":
            return "Peak Season"
        elif month.lower() == "june":
            return "Holiday Season"
        else:
            return "Regular Season"

    @staticmethod
    def get_recommended_places(destination = None):
        recommended_places = {
            "Japan": ["Tokyo Tower", "Shibuya", "Mount Fuji"],
            "Korea": ["City Center", "Local Market", "Popular Landmark"]
        }
        

        if (destination is not None):
            places = recommended_places.get(destination, ["Lorem Attraction 1", "Ipsum Attraction 2", "Dolor Attraction 3"])
            return places
        
        return recommended_places

    @classmethod
    def store(cls, request: object, user_id: int, db: Session):
        daily_budget = cls.calculate_daily_budget(request.budget, request.days)
        category = cls.get_trip_category(request.budget)

        new_trip = Trip(
            user_id = user_id,
            destination = request.destination,
            days = request.days,
            currency = request.currency,
            budget = request.budget,
            category = category,
            travel_style = request.travel_style,
            daily_budget = daily_budget,
            additional_context = request.additional_context,
        )

        try:
            new_trip.ai_recommendation = BedrockService.get_ai_recommendation(new_trip)
        except ClientError as exc:
            error = exc.response.get("Error", {})
            error_code = error.get("Code", "BedrockError")
            error_message = error.get("Message", "No error message returned")

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Bedrock request failed: {error_code} - {error_message}",
            ) from exc

        try:
            db.add(new_trip)
            db.commit()
            db.refresh(new_trip)

            return new_trip
        except SQLAlchemyError as e:
            db.rollback()
            raise ValueError(f"Error occured: {e}")
    
    @classmethod
    def get_trips(cls, user_id: int, db: Session) -> list[Trip]:
        try:
            print(db.query(Trip).filter(Trip.user_id == user_id).all())
            return db.query(Trip).filter(
                Trip.user_id == user_id
            ).all()
        except SQLAlchemyError as e:
            raise ValueError(f"Error occured: {e}")

    @classmethod
    def get_trip(cls, trip_id: int, user_id: int, db: Session) -> Trip:
        try:
            trip = db.query(Trip).filter(
                Trip.id == trip_id and User.id == user_id
            ).first()
        except SQLAlchemyError as e:
            raise ValueError(f"Error occured: {e}")
            
        if trip is None:
            raise ValueError("Trip not found")
        
        return trip

    @classmethod
    def update_trip(cls, trip_id: int, request: object, user_id: int, db: Session) -> Trip:
        try:
            trip = db.query(Trip).filter(
                Trip.id == trip_id and User.id == user_id
            ).first()
            
        except SQLAlchemyError as e:
            raise ValueError(f"Error occured: {e}")

        if trip is None:
            raise ValueError("Trip not found")

        trip.destination = request.destination
        trip.days = request.days
        trip.currency = request.currency
        trip.budget = request.budget
        trip.travel_style = request.travel_style
        trip.daily_budget = cls.calculate_daily_budget(request.budget, request.days)
        trip.additional_context = request.additional_context

        try:
            trip.ai_recommendation = BedrockService.get_ai_recommendation(trip)
        except ClientError as exc:
            error = exc.response.get("Error", {})
            error_code = error.get("Code", "BedrockError")
            error_message = error.get("Message", "No error message returned")

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Bedrock request failed: {error_code} - {error_message}",
            ) from exc
        
        try:
            db.commit()
            db.refresh(trip)

            return trip
        except SQLAlchemyError as e:
            db.rollback()
            raise ValueError(f"Error occured: {e}")

    @classmethod
    def delete_trip(cls, trip_id: int, user_id: int, db: Session) -> Trip:
        try:
            trip = db.query(Trip).filter(
                Trip.id == trip_id and User.id == user_id
            ).first()
            
        except SQLAlchemyError as e:
            raise ValueError(f"Error occured: {e}")

        if trip is None:
            raise ValueError("Trip not found")

        try:
            db.delete(trip)
            db.commit()
            return trip
        except SQLAlchemyError as e:
            db.rollback()
            raise ValueError(f"Error occured: {e}")