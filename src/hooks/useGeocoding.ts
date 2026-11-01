import { useState, useEffect } from 'react';
import { CityLocation, GeocodingApiResponse } from '../types/geo';
import { OPEN_METEO_GEOCODING_URL } from '../constants/config';

export function useGeocoding(query: string) {
  const [results, setResults] = useState<CityLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    const debounceTimer = setTimeout(async () => {
      try {
        const url = `${OPEN_METEO_GEOCODING_URL}?name=${encodeURIComponent(trimmed)}&count=5&language=en&format=json`;
        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) {
          throw new Error('Geocoding search failed');
        }

        const data: GeocodingApiResponse = await res.json();
        const mapped: CityLocation[] = (data.results || []).map((item) => ({
          id: item.id,
          name: item.name,
          country: item.country,
          countryCode: item.country_code,
          admin1: item.admin1,
          latitude: item.latitude,
          longitude: item.longitude,
          timezone: item.timezone,
        }));

        setResults(mapped);
      } catch (err: unknown) {
        if ((err as Error).name !== 'AbortError') {
          setError('Failed to fetch cities');
        }
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(debounceTimer);
      controller.abort();
    };
  }, [query]);

  return { results, isLoading, error };
}
