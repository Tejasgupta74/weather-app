import { useState, useEffect } from 'react';
import { CityLocation } from '../types/geo';
import { DEFAULT_FALLBACK_CITY } from '../constants/config';
import { reverseGeocode } from '../utils/reverseGeocode';

export function useGeolocation() {
  const [location, setLocation] = useState<CityLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    if (!('geolocation' in navigator)) {
      setLocation(DEFAULT_FALLBACK_CITY);
      setIsLoading(false);
      return;
    }

    async function initGeolocation() {
      if ('permissions' in navigator && navigator.permissions.query) {
        try {
          const perm = await navigator.permissions.query({ name: 'geolocation' });
          if (perm.state === 'denied') {
            if (!isCancelled) {
              setLocation(DEFAULT_FALLBACK_CITY);
              setIsLoading(false);
            }
            return;
          }
        } catch {
          // Permissions API query not supported on all browsers
        }
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          if (isCancelled) return;
          const lat = Number(pos.coords.latitude.toFixed(4));
          const lon = Number(pos.coords.longitude.toFixed(4));
          const geo = await reverseGeocode(lat, lon);
          if (!isCancelled) {
            setLocation({
              name: geo.name,
              country: geo.country,
              countryCode: geo.countryCode,
              latitude: lat,
              longitude: lon,
            });
            setIsLoading(false);
          }
        },
        () => {
          if (!isCancelled) {
            setLocation(DEFAULT_FALLBACK_CITY);
            setIsLoading(false);
          }
        },
        { timeout: 8000, enableHighAccuracy: false }
      );
    }

    initGeolocation();

    return () => {
      isCancelled = true;
    };
  }, []);

  return { location, setLocation, isLoading };
}
