import { AIRecommendation as AIRecommendationType } from "@/types/trip"
import { Card } from "@heroui/react"
import MarkdownContent from "./MarkdownContent"
import DailyItenerary from "./DailyItenerary"

const AIRecommendation = ({ aiRecommendation }: { aiRecommendation: AIRecommendationType }) => {
    return (
        <div>
            {aiRecommendation && (
                <div className="space-y-4">
                    {/* Daily Itinerary */}
                    {aiRecommendation.daily_itinerary && aiRecommendation.daily_itinerary.length > 0 && (
                        <Card className="rounded-2xl bg-surface">
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
                                {aiRecommendation.daily_itinerary.map((day, index) => <DailyItenerary day={day} key={index} />)}
                            </Card.Content>
                        </Card>
                    )}

                    {/* Travel Tips */}
                    {aiRecommendation.travel_tips && (
                        <Card className="rounded-2xl shadow-none sm:shadow-md border border-border sm:border-0 hover:shadow-lg transition-shadow bg-surface">
                            <Card.Header className="p-3 sm:p-5 border-b border-border">
                                <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <span className="text-green-500">💡</span>
                                    Travel Tips
                                </h4>
                            </Card.Header>
                            <Card.Content className="p-3 sm:p-5">
                                <MarkdownContent content={aiRecommendation.travel_tips} />
                            </Card.Content>
                        </Card>
                    )}

                    {/* Food Recommendations */}
                    {aiRecommendation.food_recommendations && (
                        <Card className="rounded-2xl shadow-none sm:shadow-md border border-border sm:border-0 hover:shadow-lg transition-shadow bg-surface">
                            <Card.Header className="p-3 sm:p-5 border-b border-border">
                                <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <span className="text-orange-500">🍴</span>
                                    Food Recommendations
                                </h4>
                            </Card.Header>
                            <Card.Content className="p-3 sm:p-5">
                                <MarkdownContent content={aiRecommendation.food_recommendations} />
                            </Card.Content>
                        </Card>
                    )}

                    {/* Budget Breakdown */}
                    {aiRecommendation.budget_breakdown && (
                        <Card className="rounded-2xl shadow-none sm:shadow-md border border-border sm:border-0 hover:shadow-lg transition-shadow bg-surface">
                            <Card.Header className="p-3 sm:p-5 border-b border-border">
                                <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <span className="text-blue-500">💰</span>
                                    Budget Breakdown
                                </h4>
                            </Card.Header>
                            <Card.Content className="p-3 sm:p-5">
                                <MarkdownContent content={aiRecommendation.budget_breakdown} />
                            </Card.Content>
                        </Card>
                    )}
                </div>
            )}
        </div>
    )
}

export default AIRecommendation