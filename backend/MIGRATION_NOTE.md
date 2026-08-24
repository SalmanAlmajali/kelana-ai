# Database Migration Note

## Changes Made

The `ai_recommendation` column in the `trips` table has been changed from `TEXT` to `JSON` to support structured recommendations.

## Migration Options

### Option 1: Fresh Start (Recommended for Development)
If you don't have important data, you can drop and recreate the table:

```python
# In console.py or a new migration script
from database import engine, Base
from models.trip import Trip

# Drop existing table
Base.metadata.drop_all(bind=engine)

# Recreate with new schema
Base.metadata.create_all(bind=engine)
```

### Option 2: Manual Migration (If You Have Existing Data)

1. Create a backup of your database first
2. Run this SQL to alter the column:

```sql
-- For SQLite
-- Note: SQLite doesn't support direct ALTER COLUMN TYPE
-- You'll need to recreate the table

-- For PostgreSQL
ALTER TABLE trips 
ALTER COLUMN ai_recommendation TYPE JSON 
USING ai_recommendation::json;

-- For MySQL
ALTER TABLE trips 
MODIFY COLUMN ai_recommendation JSON;
```

### Option 3: Keep Existing Data
If you have existing trips with text recommendations, they will need to be regenerated with the new format by calling the `/api/v1/trips/{trip_id}/generate` endpoint again.

## New JSON Structure

The AI recommendation now returns structured data:

```json
{
  "daily_itinerary": [
    {
      "day": 1,
      "title": "Arrival and Exploration",
      "morning": "Activity details in markdown",
      "afternoon": "Activity details in markdown",
      "evening": "Activity details in markdown"
    }
  ],
  "travel_tips": "Tips in markdown format",
  "food_recommendations": "Food recommendations in markdown",
  "budget_breakdown": "Budget details in markdown"
}
```

## Testing the Changes

1. Start the backend server
2. Create a new trip via the API
3. Generate recommendations for the trip
4. Verify the response includes structured JSON data
