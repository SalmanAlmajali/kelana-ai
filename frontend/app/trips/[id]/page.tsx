import AIRecommendation from "@/components/AIRecommendation";
import DestinationHeroImage from "@/components/results/DestinationHeroImage";
import { TripSummary } from "@/components/TripSummary";
import { TripService } from "@/services/tripService";
import { TripData } from "@/types/trip";
import { Button } from "@heroui/react";
import Link from "next/link";
import { notFound } from "next/navigation";

const Trip = async (props: { params: Promise<{ id: number }> }) => {
  const params = await props.params;
  const id = params.id;

  const { data } = await TripService.getTrip(id)
  const trip = (Array.isArray(data) ? data[0] : data) as TripData;

  if (!trip) {
    notFound();
  }

  return (
    <main className="relative">
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center pb-20 mt-12 p-0 sm:p-4">
        <div className="w-full max-w-2xl sm:max-w-4xl p-4 sm:p-8 bg-none rounded-none sm:rounded-2xl">
          <div className="mb-12">
            <Link href='/trips'>
              <Button variant="secondary" size="sm" className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Back
              </Button>
            </Link>

            <DestinationHeroImage
              destination={trip.destination}
            />

            <div className="p-0 sm:p-4">
              <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
                <div className="flex-1 w-full min-w-0 space-y-4">
                  <TripSummary trip={trip} />

                  {trip.ai_recommendation && (
                    <AIRecommendation aiRecommendation={trip.ai_recommendation} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Trip