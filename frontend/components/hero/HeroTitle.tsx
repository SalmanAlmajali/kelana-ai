import React from 'react';

const HeroTitle: React.FC = () => {
  return (
    <div className="space-y-4 animate-fade-in my-10 sm:my-16 lg:my-24">
      <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-foreground leading-tight">
        Describe your trip.
        <br />
        <span className="text-accent">
          We'll plan it.
        </span>
      </h1>
      <p className="text-sm sm:text-md lg:text-lg text-muted max-w-2xl mx-auto">
        AI-powered travel planning with personalized itineraries, local insights, and smart budgeting
      </p>
    </div>
  );
};

export default HeroTitle;
