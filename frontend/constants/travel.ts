export const TRAVEL_STYLES = [
  { id: "family", name: "Family" },
  { id: "solo", name: "Solo" },
  { id: "couple", name: "Couple" },
  { id: "friends", name: "Friends" },
  { id: "business", name: "Business" },
  { id: "adventure", name: "Adventure" },
  { id: "luxury", name: "Luxury" },
  { id: "budget", name: "Budget" },
] as const;

export const CURRENCIES = [
  { id: "USD", name: "USD", symbol: "$" },
  { id: "EUR", name: "EUR", symbol: "€" },
  { id: "GBP", name: "GBP", symbol: "£" },
  { id: "JPY", name: "JPY", symbol: "¥" },
  { id: "AUD", name: "AUD", symbol: "A$" },
  { id: "CAD", name: "CAD", symbol: "C$" },
  { id: "CHF", name: "CHF", symbol: "Fr" },
  { id: "CNY", name: "CNY", symbol: "¥" },
  { id: "INR", name: "INR", symbol: "₹" },
  { id: "SGD", name: "SGD", symbol: "S$" },
  { id: "IDR", name: "IDR", symbol: "Rp" },
] as const;

export const POPULAR_DESTINATIONS = [
  { name: "Tokyo, Japan", emoji: "🗼" },
  { name: "Bali, Indonesia", emoji: "🏝️" },
  { name: "Paris, France", emoji: "🗼" },
] as const;
