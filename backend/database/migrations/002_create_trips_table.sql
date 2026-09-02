CREATE TABLE IF NOT EXISTS trips (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    destination VARCHAR(255) NOT NULL,
    days SMALLINT NOT NULL,
    currency VARCHAR(50) NOT NULL,
    budget NUMERIC(15, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    daily_budget NUMERIC(15, 2) NOT NULL,
    travel_style VARCHAR(100) NOT NULL,
    additional_context TEXT NULL,
    ai_recommendation JSON NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_destination ON trips(destination);
CREATE INDEX IF NOT EXISTS idx_trips_category ON trips(category);
CREATE INDEX IF NOT EXISTS idx_trips_travel_style ON trips(travel_style);
CREATE TRIGGER update_trips_modtime BEFORE
UPDATE ON trips FOR EACH ROW EXECUTE FUNCTION update_modified_column();