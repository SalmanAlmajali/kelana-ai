import { TripData } from '@/types/trip'
import { Card } from '@heroui/react'
import { ReactNode } from 'react'

export const TripSummary = ({ trip }: { trip: TripData }) => {

    const items = [
        {
            label: 'Total Budget',
            value: `${trip.currency} ${trip.budget.toLocaleString()}`
        },
        {
            label: 'Daily Budget',
            value: `${trip.currency} ${trip.daily_budget.toLocaleString()}`
        },
        {
            label: 'Duration',
            value: `${trip.days} days`
        },
        {
            label: 'Category',
            value: trip.category
        },
        {
            label: 'Travel Style',
            value: trip.travel_style
        },
        {
            label: 'Additional Context',
            value: trip.additional_context
        }
    ]

    return (
        <Card className="rounded-2xl">
            <Card.Content className="p-2 sm:p-5">
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                    <span>✨</span>
                    Your Trip to {trip.destination}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                    {items.map((item, index) => (
                        <SummaryItem key={index} label={item.label}>
                            <div>{item.value}</div>
                        </SummaryItem>
                    ))}
                </div>
            </Card.Content>
        </Card>
    )
}

const SummaryItem = ({ label, children }: { label: string, children: ReactNode }) => (
    <div className="flex flex-col gap-1">
        <span className="text-muted text-xs">{label}</span>
        <span className="text-foreground font-semibold">
            {children}
        </span>
    </div>
)
