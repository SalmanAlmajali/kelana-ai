"use client";

import React, { useState } from 'react';
import { Button, Card, Input } from '@heroui/react';
import {
  SparklesIcon,
  SettingsIcon,
  PaperclipIcon,
  ArrowUpIcon,
  Image as ImageIcon,
  MapIcon,
  CalculatorIcon
} from 'lucide-react';
import TripPlannerForm from '@/components/hero/TripPlannerForm';

export default function NewTripDashboardClient({ user }: { user: any }) {
  const [showFullForm, setShowFullForm] = useState(false);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] w-full max-w-4xl mx-auto py-8 sm:py-12 animate-fade-in">

      {/* Central Orb / Graphic */}
      <div className="mb-8 relative w-24 h-24">
        <div className="absolute inset-0 bg-linear-to-tr from-purple-600 to-blue-500 rounded-full blur-2xl opacity-60 animate-pulse" />
        <div className="relative w-full h-full bg-linear-to-tr from-purple-500 to-blue-400 rounded-full shadow-[inset_0_-10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden">
          <div className="absolute top-2 right-4 w-6 h-6 bg-white/40 rounded-full blur-sm" />
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-6 sm:mb-10 tracking-tight text-center">
        Welcome back, {user?.name?.split(' ')[0]}!<br />
        <span className="text-zinc-400 text-lg sm:text-2xl mt-2 block">Ready to Plan Something New?</span>
      </h1>

      {/* Input / Form Area */}
      <div className="w-full relative group mb-8 z-20">
        {!showFullForm ? (
          <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl transition-all focus-within:border-primary/50 focus-within:bg-zinc-900 cursor-text" onClick={() => setShowFullForm(true)}>
            <div className="flex items-center gap-3 px-2">
              <SparklesIcon className="w-5 h-5 text-primary" />
              <input
                type="text"
                placeholder="Where do you want to go?"
                className="flex-1 bg-transparent border-none text-white text-base sm:text-lg placeholder:text-zinc-500 focus:outline-none focus:ring-0 min-w-0"
                readOnly
              />
              <Button isIconOnly variant="primary" className="shrink-0 text-black bg-primary" size="sm">
                <ArrowUpIcon className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-4 mt-6 px-2 text-zinc-400">
              <button className="flex items-center gap-1.5 text-xs hover:text-white transition-colors">
                <PaperclipIcon className="w-3.5 h-3.5" /> Attach
              </button>
              <button className="flex items-center gap-1.5 text-xs hover:text-white transition-colors">
                <SettingsIcon className="w-3.5 h-3.5" /> Settings
              </button>
              <button className="flex items-center gap-1.5 text-xs hover:text-white transition-colors">
                <SparklesIcon className="w-3.5 h-3.5" /> Options
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-lg font-medium flex items-center gap-2 text-white">
                <SparklesIcon className="w-5 h-5 text-primary" />
                AI Trip Planner
              </h3>
              <Button size="sm" isIconOnly onPress={() => setShowFullForm(false)} className="text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </Button>
            </div>
            {/* Dark mode override for the form if it was designed for light mode */}
            <div className="dark">
              <TripPlannerForm />
            </div>
          </div>
        )}
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 w-full opacity-80 mt-8 sm:mt-12">
        <Card className="bg-zinc-900/50 border border-white/5 hover:bg-zinc-800 transition-colors cursor-pointer">
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/5 p-2 rounded-lg">
                <MapIcon className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xs bg-white/5 px-2 py-1 rounded-md text-zinc-400">Discover</span>
            </div>
            <h4 className="font-medium text-sm mb-1 text-white">Destination Guide</h4>
            <p className="text-xs text-zinc-500">Explore top attractions and local secrets for any city.</p>
          </div>
        </Card>

        <Card className="bg-zinc-900/50 border border-white/5 hover:bg-zinc-800 transition-colors cursor-pointer">
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/5 p-2 rounded-lg">
                <ImageIcon className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-xs bg-white/5 px-2 py-1 rounded-md text-zinc-400">Generate</span>
            </div>
            <h4 className="font-medium text-sm mb-1 text-white">Travel Moodboard</h4>
            <p className="text-xs text-zinc-500">Generate a visual moodboard based on your travel style.</p>
          </div>
        </Card>

        <Card className="bg-zinc-900/50 border border-white/5 hover:bg-zinc-800 transition-colors cursor-pointer">
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/5 p-2 rounded-lg">
                <CalculatorIcon className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-xs bg-white/5 px-2 py-1 rounded-md text-zinc-400">Plan</span>
            </div>
            <h4 className="font-medium text-sm mb-1 text-white">Budget Estimator</h4>
            <p className="text-xs text-zinc-500">Calculate estimated costs for flights, hotels, and food.</p>
          </div>
        </Card>
      </div>

    </div>
  );
}
