import React from 'react';

const NavigationHeader: React.FC = () => {
  return (
    <header className="relative z-10 px-6 py-6 border-b border-border/30">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-accent shadow-lg">
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
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;
