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
    <main className="relative w-full animate-fade-in">
      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
        <div className="w-full max-w-full">
          <div className="mb-12">

            <DestinationHeroImage
              destination={trip.destination}
            />

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
    </main>
  )
}

export default Trip