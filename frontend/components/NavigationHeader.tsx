import { Button } from '@heroui/react';
import Link from 'next/link';
import React from 'react';
import LogoutButton from './LogoutButton';

import WelcomeMessage from './WelcomeMessage';

const NavigationHeader: React.FC = () => {
  const links = [
    {
      href: '/trips',
      label: 'Your Trips'
    },
    {
      href: '/profile',
      label: 'Profile'
    }
  ]

  return (
    <header className="relative top-0 z-60 p-4 w-full">
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-x-12 bg-accent sm:bg-background rounded-2xl p-4">
        <div className="flex items-center gap-x-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-background sm:bg-accent shadow-lg">
            <svg
              className="size-6 text-accent-foreground"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-xl font-bold text-foreground">KelanaAI</span>
          <div className='ml-12 hidden sm:block'>
            {links.map((link) => (
              <nav key={link.href} className="inline-block mr-6 last:mr-0">
                <a
                  href={link.href}
                  className="text-foreground/80 hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              </nav>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-x-2">
          <WelcomeMessage />
          <Link href={'/'} className='hidden sm:block'>
            <Button variant="secondary" size="sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              New Trip
            </Button>
          </Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;
