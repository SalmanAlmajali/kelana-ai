import { TripFormData, TripResponse } from "@/types/trip";

const apiUri = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class TripService {
  static async getTrips(): Promise<TripResponse> {
    const response = await fetch(`${apiUri}/api/v1/trips`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw this.buildError(errorData, response);
    }

    return response.json();
  }

  static async getTrip(id: number): Promise<TripResponse> {
    const response = await fetch(`${apiUri}/api/v1/trips/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw this.buildError(errorData, response);
    }

    return response.json();
  }

  static async createTrip(data: TripFormData): Promise<TripResponse> {
    const response = await fetch(`${apiUri}/api/v1/trips`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        destination: data.destination,
        days: data.days,
        currency: data.currency,
        budget: data.budget,
        travel_style: data.travelStyle,
        additional_context: data.additionalContext
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw this.buildError(errorData, response);
    }

    return response.json();
  }

  static buildError(errorData: any, response: Response): Error {
    const errorMessage = errorData?.detail || errorData?.message || `Server returned ${response.status}`;
    return new Error(errorMessage);
  }

  static handleError(error: unknown): string {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return "Unable to connect to the server. Please check your internet connection and try again.";
    } else if (error instanceof Error) {
      return error.message || "Unable to generate itinerary. Please try again.";
    } else {
      return "An unexpected error occurred. Please try again.";
    }
  }
}
