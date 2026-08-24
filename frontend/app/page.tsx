"use client";

import ErrorAlert from "@/components/ErrorAlert";
import HeroSection from "@/components/HeroSection";
import LoadingState from "@/components/LoadingState";
import TripResults from "@/components/TripResults";
import { useTrip } from "@/hooks/useTrip";

export default function Home() {
  const {
    isLoading,
    tripResult,
    error,
    formValues,
    showForm,
    handleSubmit,
    handleRetry,
    handleDismissError,
    handleNewTrip,
  } = useTrip();

  return (
    <main className="min-h-screen">
      {/* Error Alert */}
      {error && (
        <ErrorAlert 
          message={error}
          onRetry={handleRetry}
          onDismiss={handleDismissError}
        />
      )}

      {/* Hero Onboarding Section */}
      {showForm && !tripResult && !isLoading && (
        <HeroSection onSubmit={handleSubmit} isLoading={isLoading} />
      )}

      {/* Loading State */}
      {isLoading && (
        <LoadingState formValues={formValues} />
      )}

      {/* Results Section */}
      {tripResult && !isLoading && (
        <TripResults 
          tripResult={tripResult}
          formValues={formValues}
          onNewTrip={handleNewTrip}
        />
      )}
    </main>
  );
}
