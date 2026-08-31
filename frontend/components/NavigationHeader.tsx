"use client";

import React from 'react';
import { Button } from "@heroui/react";
import Link from 'next/link';
import LogoutButton from './LogoutButton';
import WelcomeMessage from './WelcomeMessage';
import { CompassIcon } from 'lucide-react';

export default function NavigationHeader() {
  const links = [
    { href: '/trips', label: 'My Trips' },
    { href: '/profile', label: 'Profile' }
  ];

  return (
    <header className="fixed top-4 left-0 right-0 z-50 w-full px-2 sm:px-4 lg:px-6 flex justify-center">
      <nav className="w-full max-w-7xl flex items-center justify-between bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-4 sm:px-6 py-2 sm:py-3">
        <div className="flex items-center gap-x-8">
          <Link href="/">
            <div className="flex items-center gap-x-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary shadow-lg text-black">
                <CompassIcon className='size-5' />
              </div>
              <p className="font-bold text-lg sm:text-xl text-white tracking-tight">KelanaAI</p>
            </div>
          </Link>

          <div className="hidden sm:flex items-center gap-6">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-white/70 hover:text-white font-medium text-sm transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:block">
            <WelcomeMessage />
          </div>
          <Link href="/login" className="hidden sm:block">
            <Button variant="primary" size="sm" className="font-semibold px-4">
              Login
            </Button>
          </Link>
          <LogoutButton />
        </div>
      </nav>
    </header>
  );
}
