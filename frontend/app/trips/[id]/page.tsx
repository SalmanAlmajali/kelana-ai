import AIRecommendation from "@/components/AIRecommendation";
import DestinationHeroImage from "@/components/results/DestinationHeroImage";
import { TripSummary } from "@/components/TripSummary";
import { TripService } from "@/services/tripService";
import { TripData } from "@/types/trip";
import { notFound } from "next/navigation";

import { cookies } from "next/headers";

const Trip = async (props: { params: Promise<{ id: number }> }) => {
  const params = await props.params;
  const id = params.id;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const { data } = await TripService.getTrip(id, token)
  const trip = (Array.isArray(data) ? data[0] : data) as TripData;

  if (!trip) {
    notFound();
  }

  return (
    <main className="relative">
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center pb-20 mt-12 p-0 sm:p-4">
        <div className="w-full max-w-2xl sm:max-w-4xl p-4 sm:p-8 bg-none rounded-none sm:rounded-2xl">
          <div className="mb-12">

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