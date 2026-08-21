from models.trip import Trip
from dotenv import load_dotenv
import boto3
import os

load_dotenv()

prompt_template = (
    "You are an experienced travel planner. \n"
    "Create a {days}-day itinerary for {destination}. \n"
    "Budget: {currency} {budget} \n"
    "Daily Budget: {daily_budget} \n"
    "Category: {category} \n"
    "Travel Style: {travel_style} \n"
    "Please give ma a local food recommendation and transportation suggestions"
    "Give the answer with markdown format."
)

def get_client():
    client = boto3.client(
        service_name="bedrock-runtime",
        region_name=os.getenv("AWS_REGION")
    )

    return client

def get_ai_recommendation(trip: Trip):

    client = get_client()

    response = client.converse(
        modelId = os.getenv("MODEL_ID"),
        messages = [
            {
                "role": "user",
                "content": [
                    {
                        "text": prompt_template.format(
                            days = trip.days,
                            destination = trip.destination,
                            currency = trip.currency,
                            budget = trip.budget,
                            daily_budget = trip.daily_budget,
                            category = trip.category,
                            travel_style = trip.travel_style
                        )
                    }
                ]
            }
        ]
    )

    ai_response = response["output"]["message"]["content"][0]["text"]

    return ai_response