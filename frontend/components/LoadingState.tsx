import React from 'react';
import ThinkingAnimation from './ThinkingAnimation';
import { TripFormData } from '@/types/trip';

interface LoadingStateProps {
  formValues: TripFormData | null;
}

const LoadingState: React.FC<LoadingStateProps> = ({ formValues }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-surface">
      {/* Simple Header during loading */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-accent shadow-lg">
              <svg className="size-6 text-accent-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">KelanaAI</h1>
              <p className="text-xs text-muted">Your AI Travel Planner</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* User's Request */}
          {formValues && (
            <div className="flex items-start gap-3 animate-fade-in">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent border-2 border-accent/20">
                <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex-1 rounded-2xl rounded-tl-none bg-accent/5 border border-accent/10 p-4 shadow-sm">
                <p className="text-foreground font-medium mb-2">Plan my trip:</p>
                <div className="text-sm text-muted space-y-1">
                  <p>📍 Destination: <span className="text-foreground font-medium">{formValues.destination}</span></p>
                  <p>💰 Budget: <span className="text-foreground font-medium">{formValues.currency} {formValues.budget.toLocaleString()}</span></p>
                  <p>📅 Duration: <span className="text-foreground font-medium">{formValues.days} days</span></p>
                  <p>🎭 Style: <span className="text-foreground font-medium">{formValues.travelStyle}</span></p>
                </div>
              </div>
            </div>
          )}

          {/* AI Thinking */}
          <ThinkingAnimation />
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
