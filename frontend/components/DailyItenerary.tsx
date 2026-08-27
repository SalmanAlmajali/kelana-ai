import { DailyItinerary } from '@/types/trip'
import MarkdownContent from './MarkdownContent'

const DailyItenerary = ({ day }: { day: DailyItinerary }) => {
    return (
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
                <Itinerary
                    icon='🌤️'
                    label='Morning'
                    value={day.morning}
                />
                <Itinerary
                    icon='🌤️'
                    label='Afternoon'
                    value={day.afternoon}
                />
                <Itinerary
                    icon='🌙'
                    label='Evening'
                    value={day.evening}
                />
            </div>
        </div>
    )
}

const Itinerary = ({ icon, label, value }: { icon: string, label: string, value: string }) => (
    <div>
        <div className="flex items-center gap-2 mb-1.5">
            <span>{icon}</span>
            <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
        <div className="pl-7 text-sm">
            <MarkdownContent content={value} />
        </div>
    </div>
)

export default DailyItenerary