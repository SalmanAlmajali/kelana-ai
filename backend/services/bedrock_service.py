from models.trip import Trip
from dotenv import load_dotenv
import boto3
import os
import json

load_dotenv()

prompt_template = (
    "You are an experienced traveler and excel at creating traveling plans. \n"
    "Create a travel plan that's fun, exciting and memorable using this context:\n"
    "Duration: {days}-day itinerary\n"
    "Destination: {destination}\n"
    "Budget: {budget} {currency} (Daily: {daily_budget} {currency})\n"
    "Category: {category}\n"
    "Travel Style: {travel_style}\n\n"
    "Additional Context: {additional_context}\n\n"
    
    "IMPORTANT: Return your response as a valid JSON object with the following structure:\n"
    "```json\n"
    "{{\n"
    '  "daily_itinerary": [\n'
    '    {{\n'
    '      "day": 1,\n'
    '      "title": "Day title",\n'
    '      "morning": "Morning activities in markdown",\n'
    '      "afternoon": "Afternoon activities in markdown",\n'
    '      "evening": "Evening activities in markdown"\n'
    '    }}\n'
    '  ],\n'
    '  "travel_tips": "General travel tips in markdown format",\n'
    '  "food_recommendations": "Local food recommendations in markdown format",\n'
    '  "budget_breakdown": "Estimated budget breakdown in markdown format"\n'
    "}}\n"
    "```\n\n"
    
    "Guidelines:\n"
    "- daily_itinerary: Create one object per day with 2-3 activities for morning, afternoon, and evening\n"
    "- travel_tips: Include transportation, safety, cultural etiquette, and practical advice\n"
    "- food_recommendations: List must-try local dishes, restaurants, and food experiences\n"
    "- budget_breakdown: Break down estimated costs (accommodation, food, transport, activities)\n"
    "- Use markdown formatting (bold, lists, etc.) within each field\n"
    "- Return ONLY the JSON object, no additional text"
)

class BedrockService:

    @staticmethod
    def get_client():
        client = boto3.client(
            service_name="bedrock-runtime",
            region_name=os.getenv("AWS_REGION")
        )

        return client

    @classmethod
    def get_ai_recommendation(cls, trip: Trip):

        client = cls.get_client()

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
                                travel_style = trip.travel_style,
                                additional_context = trip.additional_context
                            )
                        }
                    ]
                }
            ]
        )

        ai_response = response["output"]["message"]["content"][0]["text"]

        # Try to parse JSON response
        try:
            # Remove markdown code blocks if present
            cleaned_response = ai_response.strip()
            if cleaned_response.startswith("```json"):
                cleaned_response = cleaned_response[7:]
            if cleaned_response.startswith("```"):
                cleaned_response = cleaned_response[3:]
            if cleaned_response.endswith("```"):
                cleaned_response = cleaned_response[:-3]
            
            cleaned_response = cleaned_response.strip()
            
            # Parse JSON
            structured_data = json.loads(cleaned_response)
            
            # Validate structure
            if not all(key in structured_data for key in ["daily_itinerary", "travel_tips", "food_recommendations", "budget_breakdown"]):
                raise ValueError("Missing required fields in AI response")
            
            return structured_data
            
        except (json.JSONDecodeError, ValueError) as e:
            # Fallback: return unstructured response in a basic structure
            print(f"Failed to parse AI response as JSON: {e}")
            return {
                "daily_itinerary": [],
                "travel_tips": ai_response,
                "food_recommendations": "See travel tips section",
                "budget_breakdown": f"Daily budget: {trip.daily_budget} {trip.currency}"
            }