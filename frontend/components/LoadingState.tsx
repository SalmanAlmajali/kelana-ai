import React from 'react';
import ThinkingAnimation from './ThinkingAnimation';
import { TripFormData } from '@/types/trip';

interface LoadingStateProps {
  formValues: TripFormData | null;
}

const LoadingState: React.FC<LoadingStateProps> = ({ formValues }) => {
  return (
    <div className='mx-auto max-w-3xl rounded-3xl bg-surface backdrop-blur-xl border border-border shadow-2xl p-6 sm:p-8'>
      <div className="space-y-6">
        {/* User's Request */}
        {formValues && (
          <div className="flex items-start gap-3 animate-fade-in">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent border-2 border-accent/20">
              <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="w-full rounded-2xl rounded-tl-none bg-accent/5 border border-accent/10 p-4 shadow-sm text-left">
              <p className="text-foreground font-medium mb-2">Plan my trip:</p>
              <div className="text-sm text-muted space-y-1">
                <p>📍 Destination: <span className="text-foreground font-medium">{formValues.destination}</span></p>
                <p>💰 Budget: <span className="text-foreground font-medium">{formValues.currency} {formValues.budget.toLocaleString()}</span></p>
                <p>📅 Duration: <span className="text-foreground font-medium">{formValues.days} days</span></p>
                <p>🎭 Style: <span className="text-foreground font-medium">{formValues.travelStyle}</span></p>
                <p className="text-foreground font-medium">{formValues.additionalContext}</p>
              </div>
            </div>
          </div>
        )}

        {/* AI Thinking */}
        <ThinkingAnimation />
      </div>
    </div>
  );
};

export default LoadingState;
