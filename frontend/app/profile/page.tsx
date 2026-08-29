import { AuthService } from "@/services/authService";
import { TripService } from "@/services/tripService";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TripCard from "@/components/TripCard";
import { TripData } from "@/types/trip";
import Link from "next/link";
import { Button } from "@heroui/react";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  let user, trips: TripData[] = [];

  try {
    const userRes = await AuthService.getMe(token);
    user = userRes.data;

    const tripsRes = await TripService.getTrips(token);
    trips = Array.isArray(tripsRes.data) ? tripsRes.data : (tripsRes.data ? [tripsRes.data] : []);
  } catch (err) {
    console.error(err);
    redirect("/login");
  }

  const initials = user.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  const totalDays = trips.reduce((acc, trip) => acc + (trip.days || 0), 0);
  const recentTrips = [...trips].reverse().slice(0, 3); // latest 3 trips

  return (
    <main className="min-h-screen p-4 sm:p-8 pt-20 max-w-6xl mx-auto space-y-12 animate-fade-in">

      {/* Profile Header Banner */}
      <section className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:16px_16px]" />
        <div className="relative p-8 sm:p-12 flex flex-col sm:flex-row items-center sm:items-start gap-6">

          <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-white/20 border-4 border-white/40 shadow-xl flex items-center justify-center backdrop-blur-md flex-shrink-0">
            <span className="text-4xl font-bold text-white tracking-widest">{initials}</span>
          </div>

          <div className="flex flex-col items-center sm:items-start text-white pt-2 space-y-2">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-md">
              {user.name}
            </h1>
            <p className="text-white/80 font-medium text-lg flex items-center gap-2">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {user.email}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-3xl p-6 shadow-lg flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className="p-4 bg-primary/10 rounded-2xl text-primary">
            <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Trips</p>
            <p className="text-3xl font-black text-foreground">{trips.length}</p>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-3xl p-6 shadow-lg flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className="p-4 bg-green-500/10 rounded-2xl text-green-600">
            <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Days Planned</p>
            <p className="text-3xl font-black text-foreground">{totalDays}</p>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-3xl p-6 shadow-lg flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-600">
            <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Member Since</p>
            <p className="text-lg font-black text-foreground mt-1">Today</p>
          </div>
        </div>
      </section>

      {/* Recent Trips */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Recent Trips</h2>
          {trips.length > 3 && (
            <Link href="/trips" className="text-primary font-medium hover:underline flex items-center gap-1">
              View all
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>

        {recentTrips.length === 0 ? (
          <div className="bg-surface border border-dashed border-border rounded-3xl p-12 text-center flex flex-col items-center">
            <div className="bg-muted p-4 rounded-full mb-4">
              <svg className="size-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.375 15h17.25M5.625 15v1.5a2.25 2.25 0 002.25 2.25h8.25a2.25 2.25 0 002.25-2.25V15M5.625 15l1.5-10.5A2.25 2.25 0 019.348 3h5.304a2.25 2.25 0 012.223 1.5l1.5 10.5" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground">No trips yet</h3>
            <p className="text-muted-foreground mt-2 mb-6 max-w-sm">
              Your generated itineraries will appear here. Start exploring the world with AI!
            </p>
            <Link href="/">
              <Button color="primary">Create New Trip</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {recentTrips.map(trip => (
              <div key={trip.id} className="hover:-translate-y-2 transition-transform duration-300">
                <TripCard trip={trip} />
              </div>
            ))}
          </div>
        )}
      </section>

    </main>
  );
}
