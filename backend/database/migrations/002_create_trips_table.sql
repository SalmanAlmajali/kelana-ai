CREATE TABLE IF NOT EXISTS trips (
    id  BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
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