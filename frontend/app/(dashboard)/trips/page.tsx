import TripsList from "@/components/TripsList";
import { TripService } from "@/services/tripService"
import { TripData } from "@/types/trip";
import { Button } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { MapIcon } from "lucide-react";

import { cookies } from "next/headers";

const Trips = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const { data } = await TripService.getTrips(token);
    const trips = (Array.isArray(data) ? data : (data ? [data] : [])) as TripData[];

    return (
        <main className="relative w-full animate-fade-in">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <div className="p-2 sm:p-3 bg-primary/20 rounded-xl">
                    <MapIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">My Trips</h1>
                    <p className="text-sm sm:text-base text-zinc-400">View and manage all your generated itineraries.</p>
                </div>
            </div>

            <div className="relative z-10 w-full">
                {trips.length === 0 ? (
                    <div className="py-20 mb-8 flex flex-col items-center justify-center bg-zinc-900/50 rounded-3xl border border-white/5">
                        <Image src="/trip.png" alt="No trips" width={200} height={200} className="opacity-50" />
                        <h2 className="mt-6 text-2xl font-semibold text-white">No trips yet</h2>
                        <p className="text-center max-w-md text-zinc-400 mt-2 mb-6">
                            Start planning your dream vacation by creating your first trip!
                        </p>
                        <Link href={'/profile'}>
                            <Button color="primary" size="lg" className="font-medium">
                                Plan Your First Trip
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <TripsList initialTrips={trips} />
                )}
            </div>
        </main>
    )
}

export default Trips