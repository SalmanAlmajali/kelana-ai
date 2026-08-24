import React from 'react';
import Image from 'next/image';

interface DestinationHeroImageProps {
  destination: string;
  imageUrl?: string | null;
}

const DestinationHeroImage: React.FC<DestinationHeroImageProps> = ({ destination, imageUrl }) => {
  // Gunakan gambar placeholder lokal di frontend alih-alih dari database
  const displayImage = "/hero-bg.jpg";

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden rounded-3xl shadow-2xl mb-8">
      {/* Image */}
      <div className="absolute inset-0">
        <Image
          src={displayImage}
          alt={`${destination} destination`}
          fill
          className="object-cover"
          priority
          unoptimized={!imageUrl} // Unoptimized for external URLs
          onError={(e) => {
            // Fallback to a gradient if image fails
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        {/* Gradient Overlay */}
        {/* <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" /> */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" /> */}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-end">
        <div className="w-full p-8 sm:p-12 lg:p-16">
          <div className="max-w-4xl mx-auto">
            {/* Destination Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/90 backdrop-blur-sm shadow-lg mb-4">
              <svg className="size-4 text-accent-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="9" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-sm font-semibold text-accent-foreground">Your Destination</span>
            </div>

            {/* Destination Name */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
              {destination}
            </h1>

            {/* Subtext */}
            <p className="text-lg sm:text-xl text-white/90 drop-shadow-lg max-w-2xl">
              Your personalized travel itinerary awaits
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-8 right-8 size-32 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-16 left-16 size-40 bg-accent/10 rounded-full blur-3xl" />
    </div>
  );
};

export default DestinationHeroImage;
