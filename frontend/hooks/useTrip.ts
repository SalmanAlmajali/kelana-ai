import { useState } from "react";
import { TripData, TripFormData, TripResponse } from "@/types/trip";
import { TripService } from "@/services/tripService";

export function useTrip() {
  const [isLoading, setIsLoading] = useState(false);
  const [tripResult, setTripResult] = useState<TripResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<TripFormData | null>(null);

  const submitTrip = async (data: TripFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await TripService.createTrip(data);
      setTripResult(result);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = TripService.handleError(error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data: TripFormData = {
      destination: formData.get("destination") as string,
      budget: Number(formData.get("budget")),
      currency: formData.get("currency") as string,
      days: Number(formData.get("days")),
      travelStyle: formData.get("travelStyle") as string,
      additionalContext: formData.get("additionalContext") as string,
    };

    setFormValues(data);
    await submitTrip(data);
  };

  const handleRetry = () => {
    if (formValues) {
      submitTrip(formValues);
    }
  };

  const handleDismissError = () => {
    setError(null);
  };

  const handleNewTrip = () => {
    setError(null);
    setFormValues(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    isLoading,
    error,
    tripResult,
    formValues,
    handleSubmit,
    handleRetry,
    handleDismissError,
    handleNewTrip,
  };
}
