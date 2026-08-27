import HeroTitle from "@/components/hero/HeroTitle";
import TripPlannerForm from "@/components/hero/TripPlannerForm";
import TrustBadges from "@/components/hero/TrustBadges";

export default async function Home() {

  return (
    <main className="hero-section relative flex flex-col">
      {/* Hero Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-20">
        <div className="w-full max-w-4xl mx-auto text-center space-y-8">
          <HeroTitle />

          <TripPlannerForm />

          <TrustBadges />
        </div>
      </div>
    </main>
  );
}
