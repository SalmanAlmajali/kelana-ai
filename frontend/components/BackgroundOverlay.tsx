import React from 'react';

import Image from 'next/image';

const BackgroundOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <Image
        src="/hero-bg.jpg"
        alt="Travel Destination Background"
        fill
        className="hidden sm:block object-cover"
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-linear-to-b from-background/30 via-background/60 to-background" />
    </div>
  );
};

export default BackgroundOverlay;
