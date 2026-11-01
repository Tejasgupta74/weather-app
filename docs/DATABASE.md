# Database and Persistence Specification

## Project: 3D Weather Web App
**Status:** In Review  
**Version:** 1.0.0  
**Target Storage:** Client Local-First (LocalStorage / In-Memory) with PostgreSQL Specification (for Server/Edge Sync)  

---

## 1. Storage Architecture Overview

The application adopts a dual-tier persistence model:
1. **Tier 1 (Client Local-First, Active in v1):** Zero-friction local browser storage for client preferences, recent search history, and an in-memory 5-minute forecast cache.
2. **Tier 2 (Relational PostgreSQL Specification):** A standardized relational database schema designed for edge synchronization (e.g., Supabase / PostgreSQL) when user accounts or cross-device synchronizations are enabled.

---

## 2. Naming Conventions

| Category | Convention | Example |
|---|---|---|
| **Tables** | Plural, snake_case | `saved_locations`, `weather_cache` |
| **Columns** | Singular, snake_case | `latitude`, `unit_preference`, `expires_at` |
| **Primary Keys** | Singular `id` (UUIDv4) or explicit key | `id`, `cache_key` |
| **Foreign Keys** | Singular parent table name with `_id` | `user_id` |
| **Indexes** | `idx_[table]_[columns]` | `idx_saved_locations_user_order` |
| **LocalStorage Keys** | Namespaced snake_case | `weather_app_unit`, `weather_app_recent` |

---

## 3. Tier 1: Client Storage Schema (v1 Runtime)

### 3.1 LocalStorage Entities

#### Entity: `weather_app_unit`
- **Type:** String enum
- **Values:** `'metric'` | `'imperial'`
- **Default:** `'metric'`
- **Purpose:** Controls active display units across temperatures (°C vs °F) and wind speeds (km/h vs mph).

#### Entity: `weather_app_recent_locations`
- **Type:** JSON Array (Maximum 5 items, FIFO eviction)
- **JSON Schema:**
```json
[
  {
    "id": 2643743,
    "name": "London",
    "country": "United Kingdom",
    "countryCode": "GB",
    "latitude": 51.50853,
    "longitude": -0.12574,
    "timezone": "Europe/London",
    "savedAt": 1730452200000
  }
]
```

### 3.2 In-Memory Cache Entity
- **Data Structure:** `Map<string, CacheEntry>`
- **Cache Key Format:** `coords_${latitude.toFixed(4)}_${longitude.toFixed(4)}`
- **TTL (Time to Live):** 300,000 milliseconds (5 minutes).
- **Interface Structure:**
```typescript
interface CacheEntry {
  data: NormalizedWeatherData;
  timestamp: number;
  expiresAt: number;
}
```

---

## 4. Tier 2: Relational PostgreSQL Schema (Server / Edge Sync)

### 4.1 Table: `users`
Stores user profile settings and preferences.

| Column | Data Type | Constraints | Default | Description |
|---|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` | Unique user identifier |
| `email` | `VARCHAR(255)` | `UNIQUE, NOT NULL` | None | User email address |
| `unit_preference` | `VARCHAR(10)` | `NOT NULL, CHECK (unit_preference IN ('metric', 'imperial'))` | `'metric'` | Selected unit system |
| `default_location_id` | `UUID` | `NULL` | `NULL` | Preferred home location |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `CLOCK_TIMESTAMP()` | Account creation time |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | `CLOCK_TIMESTAMP()` | Record modification time |

### 4.2 Table: `saved_locations`
Stores pinned locations saved by users for quick switching.

| Column | Data Type | Constraints | Default | Description |
|---|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` | Unique saved location identifier |
| `user_id` | `UUID` | `NOT NULL, REFERENCES users(id) ON DELETE CASCADE` | None | Owning user identifier |
| `city_name` | `VARCHAR(120)` | `NOT NULL` | None | City name (e.g. Tokyo) |
| `country` | `VARCHAR(100)` | `NOT NULL` | None | Country name (e.g. Japan) |
| `country_code` | `VARCHAR(3)` | `NOT NULL` | None | ISO 3166-1 alpha-2 or alpha-3 code |
| `latitude` | `DECIMAL(8, 5)` | `NOT NULL, CHECK (latitude >= -90 AND latitude <= 90)` | None | Geographic latitude |
| `longitude` | `DECIMAL(8, 5)` | `NOT NULL, CHECK (longitude >= -180 AND longitude <= 180)` | None | Geographic longitude |
| `timezone` | `VARCHAR(64)` | `NOT NULL` | `'UTC'` | IANA timezone identifier |
| `sort_order` | `SMALLINT` | `NOT NULL, DEFAULT 0` | `0` | Manual card display order |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `CLOCK_TIMESTAMP()` | Row creation timestamp |

### 4.3 Table: `weather_cache`
Server-side cache table to throttle Open-Meteo external API calls when running in multi-user or SSR environments.

| Column | Data Type | Constraints | Default | Description |
|---|---|---|---|---|
| `cache_key` | `VARCHAR(64)` | `PRIMARY KEY` | None | Hash or composite string of lat_lon |
| `latitude` | `DECIMAL(8, 5)` | `NOT NULL` | None | Geographic latitude |
| `longitude` | `DECIMAL(8, 5)` | `NOT NULL` | None | Geographic longitude |
| `current_payload` | `JSONB` | `NOT NULL` | None | Serialized current weather conditions |
| `hourly_payload` | `JSONB` | `NOT NULL` | None | Serialized 24-hour forecast data |
| `daily_payload` | `JSONB` | `NOT NULL` | None | Serialized 7-day forecast data |
| `fetched_at` | `TIMESTAMPTZ` | `NOT NULL` | `CLOCK_TIMESTAMP()` | Fetch timestamp |
| `expires_at` | `TIMESTAMPTZ` | `NOT NULL` | None | Hard expiration timestamp (fetched_at + 5 min) |

---

## 5. Indexes and Performance Optimization

```sql
-- Index for rapid lookups of saved locations by user ordered by display preference
CREATE INDEX idx_saved_locations_user_sort 
ON saved_locations (user_id, sort_order ASC);

-- Unique index to prevent duplicate location saves per user
CREATE UNIQUE INDEX idx_saved_locations_user_unique_coords 
ON saved_locations (user_id, latitude, longitude);

-- Index on cache expiry for automatic background pruning
CREATE INDEX idx_weather_cache_expires_at 
ON weather_cache (expires_at ASC);

-- Coordinate proximity index for cache hits
CREATE INDEX idx_weather_cache_coords 
ON weather_cache (latitude, longitude);
```

---

## 6. Row Level Security (RLS) Policies

All PostgreSQL tables have Row Level Security enabled to enforce strict tenant boundary isolation.

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_cache ENABLE ROW LEVEL SECURITY;

-- 1. Users table policies
CREATE POLICY "Users can view only their own profile"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update only their own profile"
ON users FOR UPDATE
USING (auth.uid() = id);

-- 2. Saved locations policies
CREATE POLICY "Users can view their own saved locations"
ON saved_locations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved locations"
ON saved_locations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved locations"
ON saved_locations FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved locations"
ON saved_locations FOR DELETE
USING (auth.uid() = user_id);

-- 3. Weather cache policies
-- Weather cache is readable by all authenticated and anonymous clients, writable only by service role
CREATE POLICY "Weather cache is readable by anyone"
ON weather_cache FOR SELECT
TO anon, authenticated
USING (expires_at > CLOCK_TIMESTAMP());
```

---

## 7. Migration Scripts

### File: `migrations/00001_initial_schema.sql`

```sql
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    unit_preference VARCHAR(10) NOT NULL DEFAULT 'metric' CHECK (unit_preference IN ('metric', 'imperial')),
    default_location_id UUID NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- Table: saved_locations
CREATE TABLE IF NOT EXISTS saved_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    city_name VARCHAR(120) NOT NULL,
    country VARCHAR(100) NOT NULL,
    country_code VARCHAR(3) NOT NULL,
    latitude DECIMAL(8, 5) NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
    longitude DECIMAL(8, 5) NOT NULL CHECK (longitude >= -180 AND longitude <= 180),
    timezone VARCHAR(64) NOT NULL DEFAULT 'UTC',
    sort_order SMALLINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- Table: weather_cache
CREATE TABLE IF NOT EXISTS weather_cache (
    cache_key VARCHAR(64) PRIMARY KEY,
    latitude DECIMAL(8, 5) NOT NULL,
    longitude DECIMAL(8, 5) NOT NULL,
    current_payload JSONB NOT NULL,
    hourly_payload JSONB NOT NULL,
    daily_payload JSONB NOT NULL,
    fetched_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    expires_at TIMESTAMPTZ NOT NULL
);

-- Apply indexes
CREATE INDEX IF NOT EXISTS idx_saved_locations_user_sort ON saved_locations (user_id, sort_order ASC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_saved_locations_user_coords ON saved_locations (user_id, latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_weather_cache_expires_at ON weather_cache (expires_at ASC);
CREATE INDEX IF NOT EXISTS idx_weather_cache_coords ON weather_cache (latitude, longitude);
```

---

## 8. Seed Data

### File: `seeds/00001_default_cities.sql`

Standard fallback and reference cities for automated integration testing:

```sql
-- Reference test data coordinates
-- 1. London (Default Primary Fallback)
-- 2. Tokyo (High-density Asian metropolis)
-- 3. New York (US East Coast reference)
-- 4. Sydney (Southern hemisphere inverted solar position test)
-- 5. Reykjavik (High latitude cold climate / snow test)

INSERT INTO weather_cache (
    cache_key,
    latitude,
    longitude,
    current_payload,
    hourly_payload,
    daily_payload,
    fetched_at,
    expires_at
) VALUES (
    'seed_london_51.5074_-0.1278',
    51.50740,
    -0.12780,
    '{"temperature_2m": 14.2, "apparent_temperature": 13.5, "relative_humidity_2m": 78, "precipitation": 0.0, "weather_code": 3, "wind_speed_10m": 12.4, "wind_direction_10m": 220, "is_day": 1, "uv_index": 2.1}'::jsonb,
    '{"time": ["2026-11-01T14:00", "2026-11-01T15:00"], "temperature_2m": [14.2, 13.9], "precipitation_probability": [10, 15]}'::jsonb,
    '{"time": ["2026-11-01", "2026-11-02"], "temperature_2m_max": [16.0, 15.2], "temperature_2m_min": [9.1, 8.4], "weather_code": [3, 61]}'::jsonb,
    CLOCK_TIMESTAMP(),
    CLOCK_TIMESTAMP() + INTERVAL '5 minutes'
) ON CONFLICT (cache_key) DO NOTHING;
```

---

## 9. Deletion and Data Retention Policies

1. **User Account Purge:** When a user account is deleted from the `users` table, all associated rows in `saved_locations` are automatically removed immediately via `ON DELETE CASCADE`.
2. **Expired Cache Pruning:** Server-side `weather_cache` entries are pruned using a lightweight scheduled maintenance query running every 15 minutes:
   ```sql
   DELETE FROM weather_cache WHERE expires_at < CLOCK_TIMESTAMP();
   ```
3. **Client LocalStorage Eviction:** In the client browser runtime, `weather_app_recent_locations` is capped at a strict maximum of 5 records. When a 6th unique city is added, the oldest entry by `savedAt` timestamp is automatically evicted.

---

*End of Document 4 (docs/DATABASE.md). Awaiting user review and explicit approval.*
