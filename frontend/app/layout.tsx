import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KelanaAI - AI Travel Planner",
  description: "Plan your next adventure with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${dmSans.variable} dark`}>
      <body className="min-h-screen text-foreground bg-background antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
