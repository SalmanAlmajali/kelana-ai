export interface DailyItinerary {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
}

export interface AIRecommendation {
  daily_itinerary: DailyItinerary[];
  travel_tips: string;
  food_recommendations: string;
  budget_breakdown: string;
}

export interface TripData {
  id: number;
  destination: string;
  budget: number;
  currency: string;
  days: number;
  daily_budget: number;
  travel_style: string;
  category: string;
  additional_context: string;
  ai_recommendation: AIRecommendation | null;
  created_at: string;
  updated_at: string;
}

export interface TripResponse {
  status: boolean;
  message: string;
  data: TripData | TripData[];
}

export interface TripFormData {
  destination: string;
  budget: number;
  currency: string;
  days: number;
  travelStyle: string;
  additionalContext: string;
}
