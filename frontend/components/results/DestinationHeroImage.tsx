import React from 'react';
import Image from 'next/image';
import { Button, Chip, Typography } from '@heroui/react';
import Link from 'next/link';

interface DestinationHeroImageProps {
  destination: string;
  imageUrl?: string | null;
}

const DestinationHeroImage: React.FC<DestinationHeroImageProps> = ({ destination }) => {
  // Gunakan gambar placeholder lokal di frontend alih-alih dari database
  const displayImage = "/hero-bg.jpg";

  return (
    <div className="relative w-full max-w-4xl h-100 sm:h-125 lg:h-150 overflow-hidden rounded-2xl shadow-2xl mb-8">
      <Link href='/trips'>
        <Button variant="secondary" size="sm" className="absolute top-4 left-4 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          Back
        </Button>
      </Link>
      {/* Image */}
      <div className="absolute inset-0">
        <Image
          src={displayImage}
          alt={`${destination} destination`}
          fill
          className="object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/10 to-transparent" />
        {/* <div className="absolute inset-0 bg-linear-to-r from-background/80 via-transparent to-background/80" /> */}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-end">
        <div className="w-full p-4 sm:p-8 lg:p-12">
          <div className="max-w-4xl mx-auto">
            {/* Destination Badge */}
            <Chip size='lg' variant='primary' color='accent' className='mb-4'>
              <svg className="size-4 text-accent-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="9" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <Chip.Label>Your Destination</Chip.Label>
            </Chip>

            {/* Destination Name */}
            <Typography type='h1' className='className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-2xl"'>
              {destination}
            </Typography>

            <Typography type='body' className="text-lg text-white lg:text-xl drop-shadow-lg max-w-2xl">
              Your personalized travel itinerary awaits
            </Typography>
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
