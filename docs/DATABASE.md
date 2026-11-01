# Database and Persistence Specification

## Project: Weather App
**Status:** Approved  
**Version:** 1.1.0  
**Target Storage:** Client Local-First (LocalStorage and In-Memory Cache)  

---

## 1. Storage Overview

This application runs as a client-side Single Page Application (SPA). It does not maintain a remote backend database, relational tables, or Row Level Security (RLS) policies.

All state persistence is handled through two client-side layers:
1. **Browser LocalStorage:** Persists user preferences and recent search history across browser sessions.
2. **In-Memory Cache:** Throttles external Open-Meteo API requests by storing fetched forecast responses for 5 minutes.

---

## 2. Browser LocalStorage Schema

### 2.1 Entity: `weather_app_unit`
- **Storage Key:** `weather_app_unit`
- **Data Type:** String enum (`'metric' | 'imperial'`)
- **Default Value:** `'metric'`
- **Validation:** On read, values outside `'metric'` or `'imperial'` fallback to `'metric'`.
- **Purpose:** Controls display units across temperatures (Celsius vs Fahrenheit) and wind speeds (km/h vs mph).

### 2.2 Entity: `weather_app_recent_locations`
- **Storage Key:** `weather_app_recent_locations`
- **Data Type:** Serialized JSON array of `CityLocation` objects.
- **Maximum Records:** 5 items.
- **Eviction Strategy:** First-In, First-Out (FIFO). When a sixth unique location is selected, the oldest entry is removed.
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

---

## 3. In-Memory Forecast Cache

The application uses an in-memory cache singleton (`MemoryCache`) to prevent redundant network requests during city navigation and component re-renders.

### 3.1 Cache Structure
- **Storage Mechanism:** JavaScript `Map<string, CacheEntry>`
- **Cache Key Format:** `coords_${latitude.toFixed(4)}_${longitude.toFixed(4)}`
- **TTL (Time to Live):** 300,000 ms (5 minutes)

### 3.2 Cache Entry Interface
```typescript
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}
```

### 3.3 Cache Lifecycle
1. **Read:** If a key exists and `Date.now() < entry.expiresAt`, the cached data is returned immediately without a network call.
2. **Write:** When a fresh forecast is received from Open-Meteo, it is written with `expiresAt = Date.now() + 300000`.
3. **Pruning:** Expired entries are discarded upon read or manually cleared when the user triggers a hard refresh.

---

## 4. Privacy and Data Retention

1. **Zero Tracking:** No personal identifiers, cookies, or telemetry are transmitted to any database or analytics server.
2. **Local Clearing:** Clearing browser cookies and site data completely resets all stored preferences and recent searches.
3. **No External Credentials:** No database connection strings, API tokens, or server secrets are stored or required.
