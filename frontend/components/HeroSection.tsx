import React from 'react';
import BackgroundOverlay from './hero/BackgroundOverlay';
import NavigationHeader from './hero/NavigationHeader';
import HeroTitle from './hero/HeroTitle';
import TripPlannerForm from './hero/TripPlannerForm';
import TrustBadges from './hero/TrustBadges';

interface HeroSectionProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSubmit, isLoading }) => {
  return (
    <div className="hero-section relative min-h-screen flex flex-col bg-background">
      {/* Background Overlay */}
      <BackgroundOverlay />
      
      {/* Navigation Header */}
      <NavigationHeader />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-20">
        <div className="w-full max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Hero Title */}
          <HeroTitle />

          {/* Main Input Form Card */}
          <TripPlannerForm onSubmit={onSubmit} isLoading={isLoading} />

          {/* Trust Badges */}
          <TrustBadges />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
