import { useState } from "react";
import { TripData, TripFormData } from "@/types/trip";
import { TripService } from "@/services/tripService";

export function useTrip() {
  const [isLoading, setIsLoading] = useState(false);
  const [tripResult, setTripResult] = useState<TripData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<TripFormData | null>(null);
  const [showForm, setShowForm] = useState(true);

  const submitTrip = async (data: TripFormData) => {
    setIsLoading(true);
    setError(null);
    setShowForm(false);

    try {
      const result = await TripService.createTrip(data);
      setTripResult(result.data);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = TripService.handleError(error);
      setError(errorMessage);
      setShowForm(true);
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
    setShowForm(true);
  };

  const handleNewTrip = () => {
    setTripResult(null);
    setError(null);
    setFormValues(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    isLoading,
    tripResult,
    error,
    formValues,
    showForm,
    handleSubmit,
    handleRetry,
    handleDismissError,
    handleNewTrip,
  };
}
