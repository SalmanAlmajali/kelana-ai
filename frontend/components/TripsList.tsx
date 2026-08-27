"use client";

import { useState, useMemo } from "react";
import TripCard from "@/components/TripCard";
import { TripData } from "@/types/trip";
import { Typography, TextField, Input, Select, ListBox } from "@heroui/react";

interface TripsListProps {
  initialTrips: TripData[];
}

export default function TripsList({ initialTrips }: TripsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<string>("latest");

  const filteredAndSortedTrips = useMemo(() => {
    let trips = [...initialTrips];

    // Filter by search query (destination or travel style)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      trips = trips.filter(
        (trip) =>
          trip.destination.toLowerCase().includes(query) ||
          trip.travel_style.toLowerCase().includes(query)
      );
    }

    // Sort trips
    switch (sortMode) {
      case "latest":
        trips.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "oldest":
        trips.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case "highest_budget":
        trips.sort((a, b) => b.budget - a.budget);
        break;
      default:
        break;
    }

    return trips;
  }, [initialTrips, searchQuery, sortMode]);

  return (
    <>
      <div className="mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <Typography type="h1">Your Trips</Typography>
          <Typography color="muted" type="body-sm">{filteredAndSortedTrips.length} Saved trip plans</Typography>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <TextField
            aria-label="Search trips"
            className="w-full sm:w-64"
            value={searchQuery}
            onChange={setSearchQuery}
          >
            <Input
              placeholder="Search trips..."
              className="w-full"
            />
          </TextField>

          <Select
            aria-label="Sort trips"
            className="w-full sm:w-48"
            selectedKey={sortMode}
            onSelectionChange={(key) => key && setSortMode(key.toString())}
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="latest" textValue="Latest (newest first)">
                  Latest
                </ListBox.Item>
                <ListBox.Item id="oldest" textValue="Oldest (first trip first)">
                  Oldest
                </ListBox.Item>
                <ListBox.Item id="highest_budget" textValue="Highest Budget (descending)">
                  Highest Budget
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
      </div>

      {filteredAndSortedTrips.length === 0 ? (
        <div className="py-12 mb-8 flex flex-col items-center justify-center">
          <Typography type="h3" className="mt-4">No trips found</Typography>
          <Typography color="muted" type="body-sm" className="text-center max-w-md mt-2">
            Try adjusting your search or sort criteria.
          </Typography>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredAndSortedTrips.map((item: TripData) => (
            <TripCard trip={item} key={item.id} />
          ))}
        </div>
      )}
    </>
  );
}
