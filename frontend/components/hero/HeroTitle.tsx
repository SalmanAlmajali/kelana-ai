import React from 'react';

const HeroTitle: React.FC = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
        Describe your trip.
        <br />
        <span className="text-accent">
          We'll plan it.
        </span>
      </h1>
      <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto">
        AI-powered travel planning with personalized itineraries, local insights, and smart budgeting
      </p>
    </div>
  );
};

export default HeroTitle;
