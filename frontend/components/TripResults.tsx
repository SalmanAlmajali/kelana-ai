import React, { useRef, useEffect } from 'react';
import { Button, Card } from "@heroui/react";
import MarkdownContent from './MarkdownContent';
import DestinationHeroImage from './results/DestinationHeroImage';
import { TripData, TripFormData } from '@/types/trip';

interface TripResultsProps {
  tripResult: TripData;
  formValues: TripFormData | null;
  onNewTrip: () => void;
}

const TripResults: React.FC<TripResultsProps> = ({ tripResult, formValues, onNewTrip }) => {
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-surface">
      {/* Header with New Trip Button */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-accent shadow-lg">
                <svg className="size-6 text-accent-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">KelanaAI</h1>
                <p className="text-xs text-muted">Your AI Travel Planner</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onPress={onNewTrip}>
              <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 4.75v14.5M17.25 9l-5.25-4.25L6.75 9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              New Trip
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-2 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div ref={resultsRef} className="space-y-4 sm:space-y-6 animate-fade-in">
          {/* Destination Hero Image */}
          <DestinationHeroImage
            destination={tripResult.destination}
            imageUrl={tripResult.destination_image}
          />

          {/* User's Request */}
          {formValues && (
            <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent border-2 border-accent/20">
                <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex-1 w-full rounded-2xl sm:rounded-tl-none bg-accent/5 border border-accent/10 p-3 sm:p-5 shadow-sm">
                <p className="text-foreground font-medium mb-1 sm:mb-2 text-sm sm:text-base">Plan my trip:</p>
                <div className="text-sm text-muted space-y-1">
                  <p>📍 Destination: <span className="text-foreground font-medium">{formValues.destination}</span></p>
                  <p>💰 Budget: <span className="text-foreground font-medium">{formValues.currency} {formValues.budget.toLocaleString()}</span></p>
                  <p>📅 Duration: <span className="text-foreground font-medium">{formValues.days} days</span></p>
                  <p>🎭 Style: <span className="text-foreground font-medium">{formValues.travelStyle}</span></p>
                  <p>🗒️ Additional Context: <span className="text-foreground font-medium">{formValues.additionalContext}</span></p>
                </div>
              </div>
            </div>
          )}

          {/* AI Response */}
          <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg">
              <svg className="size-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex-1 w-full min-w-0 space-y-4">
              {/* Trip Summary */}
              <Card className="rounded-2xl sm:rounded-tl-none border-2 border-accent/20 shadow-lg">
                <Card.Content className="p-3 sm:p-5">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                    <span>✨</span>
                    Your Trip to {tripResult.destination}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                    <div className="flex flex-col gap-1">
                      <span className="text-muted text-xs">Total Budget</span>
                      <span className="text-foreground font-semibold">{tripResult.currency} {tripResult.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-muted text-xs">Daily Budget</span>
                      <span className="text-foreground font-semibold">{tripResult.currency} {tripResult.daily_budget.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-muted text-xs">Duration</span>
                      <span className="text-foreground font-semibold">{tripResult.days} days</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-muted text-xs">Category</span>
                      <span className="text-foreground font-semibold capitalize">{tripResult.category}</span>
                    </div>
                    <div className="flex flex-col gap-1 sm:col-span-2">
                      <span className="text-muted text-xs">Travel Style</span>
                      <span className="text-foreground font-semibold capitalize">{tripResult.travel_style}</span>
                    </div>
                    <div className="flex flex-col gap-1 sm:col-span-2">
                      <span className="text-muted text-xs">Additional Context</span>
                      <span className="text-foreground font-semibold capitalize">{tripResult.additional_context}</span>
                    </div>
                  </div>
                </Card.Content>
              </Card>

              {/* AI Recommendations */}
              {tripResult.ai_recommendation && (
                <div className="space-y-4">
                  {/* Daily Itinerary */}
                  {tripResult.ai_recommendation.daily_itinerary && tripResult.ai_recommendation.daily_itinerary.length > 0 && (
                    <Card className="rounded-2xl shadow-none sm:shadow-md border-0 sm:border hover:shadow-lg transition-shadow bg-transparent sm:bg-surface">
                      <Card.Header className="p-2 sm:p-5 border-b-0 sm:border-b border-border">
                        <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                          <svg className="size-5 text-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                            <path d="M16 2v4M8 2v4M3 10h18" />
                          </svg>
                          Daily Itinerary
                        </h4>
                      </Card.Header>
                      <Card.Content className="p-0 sm:p-5 space-y-4 sm:space-y-4 mt-2 sm:mt-0">
                        {tripResult.ai_recommendation.daily_itinerary.map((day) => (
                          <div key={day.day} className="rounded-xl border-b sm:border border-border bg-surface p-3 sm:p-4 hover:border-accent/30 transition-colors shadow-sm sm:shadow-none mb-3 sm:mb-0">
                            <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent font-bold mt-1">
                                {day.day}
                              </div>
                              <h5 className="text-base font-semibold text-foreground mt-2">
                                {day.title || `Day ${day.day}`}
                              </h5>
                            </div>
                            <div className="space-y-3 sm:ml-13 pl-4 sm:pl-0 border-l-2 sm:border-l-0 border-accent/20 ml-5 sm:ml-0">
                              <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                  <span className="text-yellow-500">☀️</span>
                                  <span className="text-sm font-medium text-foreground">Morning</span>
                                </div>
                                <div className="pl-7 text-sm">
                                  <MarkdownContent content={day.morning} />
                                </div>
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                  <span className="text-orange-500">🌤️</span>
                                  <span className="text-sm font-medium text-foreground">Afternoon</span>
                                </div>
                                <div className="pl-7 text-sm">
                                  <MarkdownContent content={day.afternoon} />
                                </div>
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                  <span className="text-blue-500">🌙</span>
                                  <span className="text-sm font-medium text-foreground">Evening</span>
                                </div>
                                <div className="pl-7 text-sm">
                                  <MarkdownContent content={day.evening} />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </Card.Content>
                    </Card>
                  )}

                  {/* Travel Tips */}
                  {tripResult.ai_recommendation.travel_tips && (
                    <Card className="rounded-2xl shadow-none sm:shadow-md border border-border sm:border-0 hover:shadow-lg transition-shadow bg-surface">
                      <Card.Header className="p-3 sm:p-5 border-b border-border">
                        <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                          <span className="text-green-500">💡</span>
                          Travel Tips
                        </h4>
                      </Card.Header>
                      <Card.Content className="p-3 sm:p-5">
                        <MarkdownContent content={tripResult.ai_recommendation.travel_tips} />
                      </Card.Content>
                    </Card>
                  )}

                  {/* Food Recommendations */}
                  {tripResult.ai_recommendation.food_recommendations && (
                    <Card className="rounded-2xl shadow-none sm:shadow-md border border-border sm:border-0 hover:shadow-lg transition-shadow bg-surface">
                      <Card.Header className="p-3 sm:p-5 border-b border-border">
                        <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                          <span className="text-orange-500">🍴</span>
                          Food Recommendations
                        </h4>
                      </Card.Header>
                      <Card.Content className="p-3 sm:p-5">
                        <MarkdownContent content={tripResult.ai_recommendation.food_recommendations} />
                      </Card.Content>
                    </Card>
                  )}

                  {/* Budget Breakdown */}
                  {tripResult.ai_recommendation.budget_breakdown && (
                    <Card className="rounded-2xl shadow-none sm:shadow-md border border-border sm:border-0 hover:shadow-lg transition-shadow bg-surface">
                      <Card.Header className="p-3 sm:p-5 border-b border-border">
                        <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                          <span className="text-blue-500">💰</span>
                          Budget Breakdown
                        </h4>
                      </Card.Header>
                      <Card.Content className="p-3 sm:p-5">
                        <MarkdownContent content={tripResult.ai_recommendation.budget_breakdown} />
                      </Card.Content>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripResults;
