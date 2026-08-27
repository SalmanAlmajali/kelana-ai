"use client"

import { ucwords } from '@/lib/utils'
import { TripData } from '@/types/trip'
import { Button, Card } from '@heroui/react'
import Image from 'next/image'
import Link from 'next/link'

const TripCard = ({ trip }: { trip: TripData }) => {
    return (
        <Card className="min-h-50 overflow-hidden rounded-3xl p-2">
            {/* Background image */}
            <Image
                fill
                src="/hero-bg.jpg"
                alt={`Travel Destination Background ${trip?.id}`}
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Header */}
            <Card.Header className="z-10 text-white p-2">
                <Card.Title className="text-xl font-semibold tracking-wide text-black/70">
                    {trip?.destination}
                </Card.Title>
                <Card.Description className="text-md leading-5 font-medium text-muted">
                    {trip?.days} Days | {ucwords(trip?.travel_style)}
                </Card.Description>
            </Card.Header>
            {/* Footer */}
            <Card.Footer className="z-10 mt-auto flex items-center justify-between bg-background-secondary/50 hover:bg-background-secondary backdrop-blur-md hover:backdrop-blur-none px-4 py-2 rounded-3xl transition-all">
                <div>
                    <div className="text-md font-medium text-black">{trip?.category}</div>
                    <div className="text-xs text-muted"><span className="font-bold">{trip?.currency}</span> {trip?.budget.toLocaleString()}</div>
                </div>
                <Link href={`/trips/${trip?.id}`}>
                    <Button className="bg-accent text-black" size="sm" variant="tertiary">
                        View
                    </Button>
                </Link>
            </Card.Footer>
        </Card>
    )
}

export default TripCard