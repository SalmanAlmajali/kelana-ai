"use client";

import MarkdownContent from "@/components/MarkdownContent";
import ErrorAlert from "@/components/ErrorAlert";
import { Button, Form, Input, Label, NumberField, Select, TextField, ListBox, Spinner, Card } from "@heroui/react";
import { useState } from "react";

const apiUri = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const TRAVEL_STYLES = [
  { id: "family", name: "Family" },
  { id: "solo", name: "Solo" },
  { id: "couple", name: "Couple" },
  { id: "friends", name: "Friends" },
  { id: "business", name: "Business" },
  { id: "adventure", name: "Adventure" },
  { id: "luxury", name: "Luxury" },
  { id: "budget", name: "Budget" },
] as const;

const CURRENCIES = [
  { id: "USD", name: "USD", symbol: "$" },
  { id: "EUR", name: "EUR", symbol: "€" },
  { id: "GBP", name: "GBP", symbol: "£" },
  { id: "JPY", name: "JPY", symbol: "¥" },
  { id: "AUD", name: "AUD", symbol: "A$" },
  { id: "CAD", name: "CAD", symbol: "C$" },
  { id: "CHF", name: "CHF", symbol: "Fr" },
  { id: "CNY", name: "CNY", symbol: "¥" },
  { id: "INR", name: "INR", symbol: "₹" },
  { id: "SGD", name: "SGD", symbol: "S$" },
  { id: "IDR", name: "IDR", symbol: "Rp" },
] as const;

interface DailyItinerary {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
}

interface AIRecommendation {
  daily_itinerary: DailyItinerary[];
  travel_tips: string;
  food_recommendations: string;
  budget_breakdown: string;
}

interface TripData {
  id: number;
  destination: string;
  budget: number;
  currency: string;
  days: number;
  daily_budget: number;
  travel_style: string;
  category: string;
  ai_recommendation: AIRecommendation | null;
  created_at: string;
  updated_at: string;
}

interface TripResponse {
  status: boolean;
  message: string;
  data: TripData;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [tripResult, setTripResult] = useState<TripData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<{
    destination: string;
    budget: number;
    currency: string;
    days: number;
    travelStyle: string;
  } | null>(null);

  const submitTrip = async (data: {
    destination: string;
    budget: number;
    currency: string;
    days: number;
    travelStyle: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUri}/trips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          destination: data.destination,
          days: data.days,
          currency: data.currency,
          budget: data.budget,
          travel_style: data.travelStyle
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.detail || errorData?.message || `Server returned ${response.status}`;
        throw new Error(errorMessage);
      }

      const result: TripResponse = await response.json();
      setTripResult(result.data);
    } catch (error) {
      console.error("Error:", error);
      
      // Set user-friendly error message
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setError("Unable to connect to the server. Please check your internet connection and try again.");
      } else if (error instanceof Error) {
        setError(error.message || "Unable to generate itinerary. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      destination: formData.get("destination") as string,
      budget: Number(formData.get("budget")),
      currency: formData.get("currency") as string,
      days: Number(formData.get("days")),
      travelStyle: formData.get("travelStyle") as string,
    };

    setFormValues(data); // Store for retry
    await submitTrip(data);
  };

  const handleRetry = () => {
    if (formValues) {
      submitTrip(formValues);
    }
  };

  const handleDismissError = () => {
    setError(null);
  };

  const handleNewTrip = () => {
    setTripResult(null);
    setError(null);
    setFormValues(null);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      {/* Error Alert */}
      {error && (
        <ErrorAlert 
          message={error}
          onRetry={handleRetry}
          onDismiss={handleDismissError}
        />
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6 rounded-3xl border border-border bg-surface p-12 shadow-2xl">
            {/* Animated Spinner */}
            <div className="relative">
              <Spinner className="size-16" color="primary" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-12 animate-ping rounded-full bg-accent/20" />
              </div>
            </div>
            
            {/* Loading Text */}
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                Generating Itinerary...
              </h3>
              <p className="text-sm text-muted max-w-xs">
                Amazon Bedrock is thinking.
              </p>
              <p className="text-xs text-muted/70 pt-2">
                This may take a few moments
              </p>
            </div>
            
            {/* Animated dots */}
            <div className="flex gap-2">
              <div className="size-2 rounded-full bg-accent animate-bounce" style={{animationDelay: '0ms'}} />
              <div className="size-2 rounded-full bg-accent animate-bounce" style={{animationDelay: '150ms'}} />
              <div className="size-2 rounded-full bg-accent animate-bounce" style={{animationDelay: '300ms'}} />
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">KelanaAI</h1>
          <p className="mt-2 text-muted">Plan your next adventure</p>
        </div>

        {!tripResult ? (
          /* Form */
          <div className="w-full max-w-lg mx-auto">
            <Form
              className="flex flex-col gap-6 rounded-3xl border border-border bg-surface p-8 shadow-lg"
              onSubmit={handleSubmit}
            >
              {/* Destination */}
              <div className="flex items-end gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                  <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="9" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <TextField className="flex-1" isRequired name="destination" type="text">
                  <Label className="text-sm font-medium text-foreground">Destination</Label>
                  <Input
                    className="mt-1"
                    placeholder="Japan"
                    variant="secondary"
                  />
                </TextField>
              </div>

              {/* Budget */}
              <div className="flex items-end gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                  <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <NumberField
                  className="flex-1"
                  isRequired
                  defaultValue={2000}
                  formatOptions={{
                    style: "decimal",
                    maximumFractionDigits: 0,
                  }}
                  minValue={0}
                  name="budget"
                  variant="secondary"
                >
                  <Label className="text-sm font-medium text-foreground">Budget</Label>
                  <NumberField.Group className="mt-1">
                    <NumberField.DecrementButton />
                    <NumberField.Input />
                    <NumberField.IncrementButton />
                  </NumberField.Group>
                </NumberField>
              </div>

              {/* Currency */}
              <div className="flex items-end gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                  <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 6v12M15 9H9.5a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 1 0 5H9" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <Select
                  className="flex-1"
                  isRequired
                  defaultValue="USD"
                  name="currency"
                  placeholder="Select currency"
                  variant="secondary"
                >
                  <Label className="text-sm font-medium text-foreground">Currency</Label>
                  <Select.Trigger className="mt-1">
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {CURRENCIES.map((currency) => (
                        <ListBox.Item key={currency.id} id={currency.id} textValue={currency.name}>
                          {currency.symbol} {currency.name}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>

              {/* Days */}
              <div className="flex items-end gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500">
                  <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <NumberField
                  className="flex-1"
                  isRequired
                  defaultValue={5}
                  minValue={1}
                  maxValue={365}
                  name="days"
                  variant="secondary"
                >
                  <Label className="text-sm font-medium text-foreground">Days</Label>
                  <NumberField.Group className="mt-1">
                    <NumberField.DecrementButton />
                    <NumberField.Input />
                    <NumberField.IncrementButton />
                  </NumberField.Group>
                </NumberField>
              </div>

              {/* Travel Style */}
              <div className="flex items-end gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                  <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <Select
                  className="flex-1"
                  isRequired
                  defaultValue="family"
                  name="travelStyle"
                  placeholder="Select a travel style"
                  variant="secondary"
                >
                  <Label className="text-sm font-medium text-foreground">Travel Style</Label>
                  <Select.Trigger className="mt-1">
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {TRAVEL_STYLES.map((style) => (
                        <ListBox.Item key={style.id} id={style.id} textValue={style.name}>
                          {style.name}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>

              {/* Submit Button */}
              <Button
                className="mt-2"
                isPending={isLoading}
                size="lg"
                type="submit"
              >
                {isLoading ? (
                  <>
                    <Spinner color="current" size="sm" />
                    Generating...
                  </>
                ) : (
                  "Generate AI Trip"
                )}
              </Button>
            </Form>
          </div>
        ) : (
          /* Results Display */
          <div className="space-y-6">
            {/* Header with trip details */}
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-foreground">
                    <strong>Destination:</strong> {tripResult.destination}
                  </h2>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    <div className="text-muted">
                      <strong className="text-foreground">Total Budget:</strong> {tripResult.currency} {tripResult.budget.toLocaleString()}
                    </div>
                    <div className="text-muted">
                      <strong className="text-foreground">Daily Budget:</strong> {tripResult.currency} {tripResult.daily_budget.toLocaleString()}
                    </div>
                    <div className="text-muted">
                      <strong className="text-foreground">Days:</strong> {tripResult.days}
                    </div>
                    <div className="text-muted">
                      <strong className="text-foreground">Category:</strong> {tripResult.category}
                    </div>
                    <div className="text-muted col-span-2">
                      <strong className="text-foreground">Travel Style:</strong> {tripResult.travel_style.charAt(0).toUpperCase() + tripResult.travel_style.slice(1)}
                    </div>
                  </div>
                </div>
                <Button variant="secondary" onPress={handleNewTrip}>
                  New Trip
                </Button>
              </div>
            </Card>

            {/* AI Recommendation Sections */}
            {tripResult.ai_recommendation && (
              <div className="space-y-6">
                {/* Daily Itinerary Cards */}
                {tripResult.ai_recommendation.daily_itinerary && tripResult.ai_recommendation.daily_itinerary.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                      <svg className="size-6 text-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                        <path d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                      Daily Itinerary
                    </h3>
                    <div className="grid gap-4">
                      {tripResult.ai_recommendation.daily_itinerary.map((day) => (
                        <Card key={day.day} className="p-6 hover:shadow-lg transition-shadow">
                          <Card.Header className="pb-4">
                            <div className="flex items-center gap-3">
                              <div className="flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent font-bold text-lg">
                                {day.day}
                              </div>
                              <h4 className="text-xl font-semibold text-foreground">
                                {day.title || `Day ${day.day}`}
                              </h4>
                            </div>
                          </Card.Header>
                          <Card.Content className="space-y-4">
                            {/* Morning */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-yellow-500">
                                <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="4" />
                                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                                </svg>
                                <span className="font-semibold text-foreground">Morning</span>
                              </div>
                              <div className="pl-7">
                                <MarkdownContent content={day.morning} />
                              </div>
                            </div>

                            {/* Afternoon */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-orange-500">
                                <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="4" />
                                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                                </svg>
                                <span className="font-semibold text-foreground">Afternoon</span>
                              </div>
                              <div className="pl-7">
                                <MarkdownContent content={day.afternoon} />
                              </div>
                            </div>

                            {/* Evening */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-blue-500">
                                <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                                <span className="font-semibold text-foreground">Evening</span>
                              </div>
                              <div className="pl-7">
                                <MarkdownContent content={day.evening} />
                              </div>
                            </div>
                          </Card.Content>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Travel Tips Section */}
                {tripResult.ai_recommendation.travel_tips && (
                  <Card className="p-6">
                    <Card.Header className="pb-4">
                      <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <svg className="size-6 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Travel Tips
                      </h3>
                    </Card.Header>
                    <Card.Content>
                      <MarkdownContent content={tripResult.ai_recommendation.travel_tips} />
                    </Card.Content>
                  </Card>
                )}

                {/* Food Recommendations Section */}
                {tripResult.ai_recommendation.food_recommendations && (
                  <Card className="p-6">
                    <Card.Header className="pb-4">
                      <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <svg className="size-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M3 2l2.01 18.23L12 22l6.99-1.77L21 2H3zm14 6h-4.35l.2 4.22h4.15l-.5 5.28-3.5 1-3.5-1-.25-2.28h1.7l.13 1.14 1.92.54 1.92-.54.2-2.14H8l-.6-6.22h9.2L17 6H7l.4 2h9.6z" />
                        </svg>
                        Local Food Recommendations
                      </h3>
                    </Card.Header>
                    <Card.Content>
                      <MarkdownContent content={tripResult.ai_recommendation.food_recommendations} />
                    </Card.Content>
                  </Card>
                )}

                {/* Budget Breakdown Section */}
                {tripResult.ai_recommendation.budget_breakdown && (
                  <Card className="p-6">
                    <Card.Header className="pb-4">
                      <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <svg className="size-6 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                        Estimated Budget Breakdown
                      </h3>
                    </Card.Header>
                    <Card.Content>
                      <MarkdownContent content={tripResult.ai_recommendation.budget_breakdown} />
                    </Card.Content>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
