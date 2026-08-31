"use client";

import React, { useState, useEffect } from 'react';
import { TripFormData } from '@/types/trip';
import { MapPinIcon, PlaneIcon, SparklesIcon, CompassIcon, MapIcon } from 'lucide-react';

interface LoadingStateProps {
  formValues: TripFormData | null;
}

const LoadingState: React.FC<LoadingStateProps> = ({ formValues }) => {
  const [loadingText, setLoadingText] = useState("Initializing AI Travel Engine...");

  const loadingPhrases = [
    "Analyzing local weather patterns...",
    "Finding hidden gems and secret spots...",
    "Crafting the perfect daily itinerary...",
    "Optimizing travel routes and transit...",
    "Curating the best culinary experiences...",
    "Finalizing your dream adventure..."
  ];

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % loadingPhrases.length;
      setLoadingText(loadingPhrases[currentIndex]);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[400px] animate-fade-in relative z-10">
      {/* Background Animated Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse-glow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Central Visual Hub */}
      <div className="relative w-48 h-48 flex items-center justify-center mb-12">
        {/* Rotating Outer Rings */}
        <div className="absolute inset-0 rounded-full border border-primary/30 border-t-primary border-l-primary animate-[spin_3s_linear_infinite]" />
        <div className="absolute inset-2 rounded-full border border-purple-500/30 border-b-purple-500 border-r-purple-500 animate-[spin_4s_linear_infinite_reverse]" />
        
        {/* Pulsing Core */}
        <div className="absolute inset-6 bg-gradient-to-tr from-primary to-purple-600 rounded-full shadow-[0_0_40px_rgba(var(--primary),0.5)] flex items-center justify-center animate-pulse">
          <SparklesIcon className="w-10 h-10 text-white animate-bounce" />
        </div>

        {/* Orbiting Icons */}
        <div className="absolute inset-0 animate-[spin_6s_linear_infinite]">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-zinc-900 p-2 rounded-full border border-white/10 shadow-lg">
            <PlaneIcon className="w-4 h-4 text-blue-400 -rotate-45" />
          </div>
        </div>
        <div className="absolute inset-0 animate-[spin_8s_linear_infinite_reverse]">
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-zinc-900 p-2 rounded-full border border-white/10 shadow-lg">
            <CompassIcon className="w-4 h-4 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Dynamic Text */}
      <div className="h-8 mb-8 relative flex justify-center w-full overflow-hidden">
        <h3 
          key={loadingText} 
          className="absolute text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-purple-400 animate-slide-up"
        >
          {loadingText}
        </h3>
      </div>

      {/* User Request Summary Card */}
      {formValues && (
        <div className="w-full max-w-lg bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-purple-500" />
          
          <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
            <MapIcon className="w-5 h-5 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-300 uppercase tracking-widest">Designing Trip For</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 text-sm">Destination</span>
              <span className="text-white font-semibold flex items-center gap-2">
                <MapPinIcon className="w-4 h-4 text-primary" />
                {formValues.destination}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 text-sm">Duration</span>
              <span className="text-white font-semibold">{formValues.days} Days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 text-sm">Budget</span>
              <span className="text-white font-semibold text-green-400">
                {formValues.currency} {formValues.budget.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 text-sm">Travel Style</span>
              <span className="text-white font-semibold capitalize">{formValues.travelStyle}</span>
            </div>
          </div>
          
          {/* Shimmer Overlay */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:animate-[shimmer_2s_infinite]" />
        </div>
      )}

    </div>
  );
};

export default LoadingState;
