"use client";

import React from 'react';
import { Button } from "@heroui/react";
import Link from 'next/link';
import LogoutButton from './LogoutButton';
import WelcomeMessage from './WelcomeMessage';

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
                <svg
                  className="size-5"
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
