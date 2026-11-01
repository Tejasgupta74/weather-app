import { CityLocation } from '../types/geo';

export const CACHE_TTL_MS = 300000; // 5 minutes

export const DEFAULT_FALLBACK_CITY: CityLocation = {
  name: 'London',
  country: 'United Kingdom',
  countryCode: 'GB',
  latitude: 51.5074,
  longitude: -0.1278,
  timezone: 'Europe/London',
};

export const OPEN_METEO_FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
export const OPEN_METEO_GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export const STORAGE_KEYS = {
  UNIT_PREFERENCE: 'weather_app_unit_preference',
  RECENT_LOCATIONS: 'weather_app_recent_locations',
} as const;
