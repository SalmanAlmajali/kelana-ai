"use client";

import React, { useState, useEffect } from 'react';

const ThinkingAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { icon: "🔍", text: "Analyzing your travel preferences...", delay: 0 },
    { icon: "🗺️", text: "Researching destination insights...", delay: 2000 },
    { icon: "✨", text: "Crafting personalized itinerary...", delay: 4000 },
    { icon: "🎯", text: "Optimizing recommendations...", delay: 6000 },
  ];

  useEffect(() => {
    const intervals = steps.map((step, index) => {
      return setTimeout(() => {
        setCurrentStep(index);
      }, step.delay);
    });

    return () => {
      intervals.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* AI Avatar */}
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold shadow-lg">
          <svg className="size-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 22.5l-.394-1.933a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        
        <div className="flex-1 rounded-2xl rounded-tl-none bg-surface border border-border p-4 shadow-sm">
          {/* Thinking dots animation */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-1.5">
              <div className="size-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1.4s' }} />
              <div className="size-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1.4s' }} />
              <div className="size-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '400ms', animationDuration: '1.4s' }} />
            </div>
            <span className="text-xs text-muted/70">KelanaAI is thinking...</span>
          </div>
          
          {/* Progress steps */}
          <div className="space-y-2.5">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-2.5 transition-all duration-500 ${
                  index <= currentStep 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-30 translate-x-2'
                }`}
              >
                <span className="text-xl">{step.icon}</span>
                <span className={`text-sm ${
                  index === currentStep 
                    ? 'text-accent font-medium' 
                    : index < currentStep 
                    ? 'text-muted line-through' 
                    : 'text-muted/50'
                }`}>
                  {step.text}
                </span>
                {index < currentStep && (
                  <svg className="size-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            ))}
          </div>
          
          {/* Progress bar */}
          <div className="mt-4 h-1.5 bg-surface-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 transition-all duration-1000 ease-out rounded-full"
              style={{ 
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThinkingAnimation;
