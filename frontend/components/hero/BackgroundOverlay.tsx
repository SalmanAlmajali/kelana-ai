import React from 'react';

import Image from 'next/image';

const BackgroundOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <Image
        src="/hero-bg.jpg"
        alt="Travel Destination Background"
        fill
        className="object-cover opacity-60"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
    </div>
  );
};

export default BackgroundOverlay;
