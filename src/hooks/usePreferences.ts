import { useState } from 'react';
import { UnitSystem } from '../utils/unitConversion';
import { CityLocation } from '../types/geo';
import { STORAGE_KEYS } from '../constants/config';

const MAX_RECENT_LOCATIONS = 5;

export function usePreferences() {
  const [unit, setUnitState] = useState<UnitSystem>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.UNIT_PREFERENCE);
      return saved === 'imperial' ? 'imperial' : 'metric';
    } catch {
      return 'metric';
    }
  });

  const [recentLocations, setRecentLocations] = useState<CityLocation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECENT_LOCATIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const setUnit = (newUnit: UnitSystem) => {
    setUnitState(newUnit);
    try {
      localStorage.setItem(STORAGE_KEYS.UNIT_PREFERENCE, newUnit);
    } catch {
      // storage unavailable
    }
  };

  const toggleUnit = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  };

  const addRecentLocation = (city: CityLocation) => {
    setRecentLocations((prev) => {
      const filtered = prev.filter(
        (item) =>
          Math.abs(item.latitude - city.latitude) > 0.01 ||
          Math.abs(item.longitude - city.longitude) > 0.01
      );
      const updated = [city, ...filtered].slice(0, MAX_RECENT_LOCATIONS);
      try {
        localStorage.setItem(STORAGE_KEYS.RECENT_LOCATIONS, JSON.stringify(updated));
      } catch {
        // storage unavailable
      }
      return updated;
    });
  };

  return {
    unit,
    setUnit,
    toggleUnit,
    recentLocations,
    addRecentLocation,
  };
}
