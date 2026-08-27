"use client";

import React, { useEffect } from 'react';
import { Button } from '@heroui/react';

interface ErrorAlertProps {
  message?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message = "Unable to generate itinerary. Please try again.",
  onRetry,
  onDismiss
}) => {

  useEffect(() => {
    document.body.style.overflow = 'hidden'
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-surface p-8 shadow-2xl">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="flex size-20 items-center justify-center rounded-full bg-red-500/10">
              <svg
                className="size-10 text-red-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-20 animate-ping rounded-full bg-red-500/10" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="text-center space-y-3 mb-8">
          <h3 className="text-xl font-semibold text-foreground">
            Oops! Something went wrong
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          {onRetry && (
            <Button
              className="w-full"
              size="lg"
              variant="primary"
              onPress={() => {
                onRetry()

                document.body.style.overflow = ''
              }}
            >
              Try Again
            </Button>
          )}
          {onDismiss && (
            <Button
              className="w-full"
              size="lg"
              variant="secondary"
              onPress={() => {
                onDismiss()

                document.body.style.overflow = ''
              }}
            >
              Go Back
            </Button>
          )}
        </div>

        {/* Helper Text */}
        <p className="text-xs text-muted/70 text-center mt-6">
          If the problem persists, please contact support
        </p>
      </div>
    </div>
  );
};

export default ErrorAlert;
