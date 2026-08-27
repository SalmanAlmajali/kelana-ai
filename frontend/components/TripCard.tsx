"use client"

import { ucwords } from '@/lib/utils'
import { TripData } from '@/types/trip'
import { Button, Card } from '@heroui/react'
import Image from 'next/image'
import Link from 'next/link'

const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
        case 'luxury': return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'standard': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'backpacker': return 'bg-green-100 text-green-800 border-green-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
}

const getDestinationEmoji = (destination: string) => {
    const dest = destination.toLowerCase();
    if (dest.includes('tokyo') || dest.includes('japan')) return '🗼';
    if (dest.includes('paris') || dest.includes('france')) return '🥖';
    if (dest.includes('bali') || dest.includes('indonesia')) return '🏝️';
    if (dest.includes('new york') || dest.includes('usa')) return '🗽';
    if (dest.includes('london') || dest.includes('uk')) return '🎡';
    return '📍';
}

const TripCard = ({ trip }: { trip: TripData }) => {
    return (
        <Card className="min-h-100 overflow-hidden rounded-3xl p-2 relative">
            {/* Background image */}
            <Image
                fill
                src="/hero-bg.jpg"
                alt={`Travel Destination Background ${trip?.id}`}
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Header */}
            <Card.Header className="z-10 text-white p-4 flex flex-col items-start gap-2 h-full">
                <div className="flex w-full justify-between items-start">
                    <Card.Title className="text-xl font-semibold tracking-wide text-black/90 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-2xl">
                        {getDestinationEmoji(trip?.destination)} {trip?.destination}
                    </Card.Title>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getCategoryColor(trip?.category)}`}>
                        {ucwords(trip?.category || '')}
                    </span>
                </div>

                <div className="flex gap-2 mt-auto">
                    <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/20">
                        ⏱️ {trip?.days} Days
                    </span>
                    <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/20">
                        👥 {ucwords(trip?.travel_style || '')}
                    </span>
                </div>
            </Card.Header>
            {/* Footer */}
            <Card.Footer className="z-10 mt-auto flex items-center justify-between bg-background-secondary/80 hover:bg-background-secondary backdrop-blur-xl hover:backdrop-blur-none px-4 py-3 rounded-3xl transition-all">
                <div>
                    <div className="text-sm text-muted font-medium">Est. Budget</div>
                    <div className="text-lg font-bold text-black">
                        {trip?.currency} {trip?.budget.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                </div>
                <Link href={`/trips/${trip?.id}`}>
                    <Button className="bg-accent text-black font-semibold shadow-md" size="sm" variant="tertiary">
                        View Trip
                    </Button>
                </Link>
            </Card.Footer>
        </Card>
    )
}

export default TripCard