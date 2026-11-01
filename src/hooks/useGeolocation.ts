import { useState, useEffect } from 'react';
import { CityLocation } from '../types/geo';
import { DEFAULT_FALLBACK_CITY } from '../constants/config';

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

    const timer = setTimeout(() => {
      if (!isCancelled && !location) {
        setLocation(DEFAULT_FALLBACK_CITY);
        setIsLoading(false);
      }
    }, 3000);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!isCancelled) {
          clearTimeout(timer);
          setLocation({
            name: 'Current Location',
            country: 'GPS',
            latitude: Number(pos.coords.latitude.toFixed(4)),
            longitude: Number(pos.coords.longitude.toFixed(4)),
          });
          setIsLoading(false);
        }
      },
      () => {
        if (!isCancelled) {
          clearTimeout(timer);
          setLocation(DEFAULT_FALLBACK_CITY);
          setIsLoading(false);
        }
      },
      { timeout: 3000, enableHighAccuracy: false }
    );

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return { location, setLocation, isLoading };
}
