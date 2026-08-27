import TripsList from "@/components/TripsList";
import { TripService } from "@/services/tripService"
import { TripData } from "@/types/trip";
import { Button, Typography } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";

const Trips = async () => {

    const { data } = await TripService.getTrips();
    const trips = (Array.isArray(data) ? data : (data ? [data] : [])) as TripData[];

    return (
        <main className="relative">
            <div className="relative z-10 flex flex-1 flex-col items-center justify-center pb-20 mt-12 p-0 sm:p-4">
                <div className="w-full max-w-4xl p-4 sm:p-6 bg-none sm:bg-background rounded-none sm:rounded-2xl">
                    {trips.length === 0 ? (
                        <div className="py-12 mb-8 flex flex-col items-center justify-center">
                            <Image src="/trip.png" alt="No trips" width={200} height={200} />
                            <Typography type="h2" className="mt-4">No trips yet</Typography>
                            <Typography color="muted" type="body-sm" className="text-center max-w-md">Start planning your dream vacation by creating your first trip!</Typography>
                            <Link href={'/'}>
                                <Button className="mt-6">Create Your First Trip</Button>
                            </Link>
                        </div>
                    ) : (
                        <TripsList initialTrips={trips} />
                    )}
                </div>

            </div>
        </main>
    )
}

export default Trips