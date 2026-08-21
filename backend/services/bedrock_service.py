from models.trip import Trip
from dotenv import load_dotenv
import boto3
import os

load_dotenv()

prompt_template = (
    "You are an experienced traveler and excel at creating traveling plan. \n"
    "Create a travel plan that's fun, exciting and memorable by using this given context:"
    "Duration of traveling is {days}-day itinerary. \n"
    "Destination of traveling is {destination}. \n"
    "Budget of traveling {budget} in {currency} currency with {daily_budget} daily budget. \n"
    "The category of traveling is {category} \n"
    "The traveling style is {travel_style} \n"
    "Please provide a recommendation for local food and transportation suggestions \n"
    "Also make a structured daily plan following below format: \n"
    "Morning activities: Provide 2-3 morning activities per day \n"
    "Afternoon activities: Provide recommendation for cultural sites and local experiences \n"
    "Evening activities: Provide recommendation for dinner spots and nightlife \n"
    "Give the answer in a well structured markdown format."
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