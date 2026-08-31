import React from 'react';
import Link from 'next/link';
import { Button, Card } from '@heroui/react';
import { ArrowRightIcon, MapPinIcon } from 'lucide-react';

export default async function Home() {
  const destinations = [
    { title: 'Mount Bromo', location: 'East Java', rating: 4, image: '/bromo.jpg' },
    { title: 'Ejen Crater', location: 'East Java', rating: 5, image: '/ejen.jpg' },
    { title: 'Jomblang Cave', location: 'Central Java', rating: 4, image: '/jomblang.jpg' },
  ];

  return (
    <main className="relative flex flex-col min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-16 pb-12 pt-20 overflow-x-hidden">
      
      {/* Left Navigation Dots (Decorative) */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 hidden lg:flex">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className={`h-2 w-2 rounded-full ${i === 4 ? 'bg-white scale-150' : 'bg-white/30'}`} />
        ))}
        <div className="mt-8 text-white/50 text-sm font-medium">4 / 6</div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row items-end justify-between pb-12 z-10 w-full max-w-7xl mx-auto h-full">
        
        {/* Left Hero Text */}
        <div className="w-full lg:w-1/2 text-white mb-16 lg:mb-0 space-y-6">
          <p className="text-xl font-medium tracking-wide text-white/80 uppercase">Discover</p>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight leading-none uppercase font-serif drop-shadow-2xl">
            INDONESIA
          </h1>
          <p className="text-lg text-white/80 max-w-md leading-relaxed">
            Indonesia, a Southeast Asian nation made up of thousands of volcanic islands, is home to hundreds of ethnic groups speaking many different languages.
          </p>
          <div className="pt-4">
            <Link href="/login">
              <Button 
                color="primary" 
                size="lg" 
                radius="full" 
                className="font-semibold px-8 bg-primary text-black"
              >
                Start Planning <ArrowRightIcon className="w-5 h-5 ml-2 inline-block" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Destination Carousel */}
        <div className="w-full lg:w-1/2 flex flex-col items-end">
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-8 snap-x snap-mandatory w-[100vw] sm:w-full lg:w-[120%] -ml-4 sm:ml-0 lg:-mr-[10%] px-4 sm:px-0 lg:px-4 hide-scrollbar">
            {destinations.map((dest, i) => (
              <Card key={i} className="min-w-[240px] sm:min-w-[280px] h-[320px] sm:h-[360px] snap-center bg-black/40 backdrop-blur-md border-none overflow-hidden shrink-0 group rounded-3xl">
                <img
                  alt={dest.title}
                  className="z-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  src={`https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&q=80&w=600&h=800`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <div className="absolute top-4 left-4 z-20">
                  <div className="bg-white/20 backdrop-blur-md rounded-full p-2">
                    <MapPinIcon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 z-20">
                  <p className="text-white/70 text-sm font-medium mb-1">{dest.location}</p>
                  <h4 className="text-white font-bold text-2xl mb-2">{dest.title}</h4>
                  <div className="flex gap-1 text-primary">
                    {[1,2,3,4,5].map(star => (
                      <svg key={star} className={`w-4 h-4 ${star <= dest.rating ? 'fill-current' : 'fill-white/30 text-transparent'}`} viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex gap-4 pr-12 mt-4 hidden lg:flex">
            <Button isIconOnly radius="full" variant="flat" className="bg-white/10 backdrop-blur-md border border-white/20 text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </Button>
            <div className="flex gap-2 items-center px-4">
              <div className="h-1 w-6 bg-white rounded-full"></div>
              <div className="h-1 w-2 bg-white/30 rounded-full"></div>
              <div className="h-1 w-2 bg-white/30 rounded-full"></div>
              <div className="h-1 w-2 bg-white/30 rounded-full"></div>
            </div>
            <Button isIconOnly radius="full" variant="flat" className="bg-white/10 backdrop-blur-md border border-white/20 text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Button>
          </div>
        </div>

      </div>
    </main>
  );
}
