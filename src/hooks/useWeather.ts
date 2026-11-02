import { useState, useEffect, useCallback } from 'react';
import { NormalizedWeatherData, OpenMeteoRawResponse, HourlyForecastItem, DailyForecastItem } from '../types/weather';
import { CityLocation } from '../types/geo';
import { weatherCodeMap } from '../utils/weatherCodeMap';
import { weatherMemoryCache } from '../utils/cache';
import { getLocationLocalTime } from '../utils/solarPosition';
import { OPEN_METEO_FORECAST_URL, CACHE_TTL_MS } from '../constants/config';

export function normalizeWeatherData(raw: OpenMeteoRawResponse, locationName: string): NormalizedWeatherData {
  const isDayCurrent = Boolean(raw.current.is_day);
  const currentCondition = weatherCodeMap(raw.current.weather_code, isDayCurrent);
  const sunrise = raw.daily.sunrise[0] || '';
  const sunset = raw.daily.sunset[0] || '';

  // 24-hour hourly forecast anchored to location's local time
  const locationTime = getLocationLocalTime(raw.utc_offset_seconds);
  const startIndex = Math.max(
    0,
    raw.hourly.time.findIndex((t) => t.startsWith(locationTime.isoHour))
  );
  const hourlySliceIndices = Array.from({ length: 24 }, (_, i) => startIndex + i).filter(
    (idx) => idx < raw.hourly.time.length
  );

  const hourly: HourlyForecastItem[] = hourlySliceIndices.map((idx, sliceIdx) => {
    const isNow = sliceIdx === 0;
    const isDay = isNow ? isDayCurrent : Boolean(raw.hourly.is_day[idx]);
    const code = isNow ? raw.current.weather_code : (raw.hourly.weather_code[idx] ?? 0);
    // Keep raw unrounded temperature to avoid double-rounding errors
    const temp = isNow ? raw.current.temperature_2m : (raw.hourly.temperature_2m[idx] ?? 0);
    const precip = isNow ? raw.current.precipitation : (raw.hourly.precipitation[idx] ?? 0);
    const precipProb = raw.hourly.precipitation_probability?.[idx] ?? 0;

    return {
      time: raw.hourly.time[idx],
      temperature: temp,
      precipitation: precip,
      precipitationProbability: precipProb,
      weatherCode: code,
      condition: isNow ? currentCondition : weatherCodeMap(code, isDay),
      isDay,
    };
  });

  // 7-day daily forecast
  const daily: DailyForecastItem[] = raw.daily.time.slice(0, 7).map((date, idx) => {
    const code = raw.daily.weather_code[idx] ?? 0;
    return {
      date,
      // Keep raw values to let display formatting handle single rounding
      temperatureMax: raw.daily.temperature_2m_max[idx] ?? 0,
      temperatureMin: raw.daily.temperature_2m_min[idx] ?? 0,
      precipitation: raw.daily.precipitation_sum[idx] ?? 0,
      precipitationProbability: raw.daily.precipitation_probability_max?.[idx] ?? 0,
      weatherCode: code,
      condition: weatherCodeMap(code, true),
      sunrise: raw.daily.sunrise[idx] ?? '',
      sunset: raw.daily.sunset[idx] ?? '',
      uvIndexMax: raw.daily.uv_index_max[idx] ?? 0,
    };
  });

  return {
    locationName,
    latitude: raw.latitude,
    longitude: raw.longitude,
    timezone: raw.timezone,
    utcOffsetSeconds: raw.utc_offset_seconds,
    fetchedAt: Date.now(),
    current: {
      temperature: raw.current.temperature_2m,
      apparentTemperature: raw.current.apparent_temperature,
      humidity: raw.current.relative_humidity_2m,
      windSpeed: raw.current.wind_speed_10m,
      windDirection: raw.current.wind_direction_10m,
      precipitation: raw.current.precipitation,
      cloudCover: raw.current.cloud_cover,
      weatherCode: raw.current.weather_code,
      uvIndex: Math.round(raw.current.uv_index * 10) / 10,
      isDay: isDayCurrent,
      sunrise,
      sunset,
      condition: currentCondition,
    },
    hourly,
    daily,
  };
}

export function useWeather(location: CityLocation | null) {
  const [weather, setWeather] = useState<NormalizedWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (loc: CityLocation, signal?: AbortSignal) => {
    const cacheKey = `weather_${loc.latitude.toFixed(4)}_${loc.longitude.toFixed(4)}`;
    const cached = weatherMemoryCache.get<NormalizedWeatherData>(cacheKey);

    if (cached) {
      setWeather(cached);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    let isTimedOut = false;
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => {
      isTimedOut = true;
      timeoutController.abort();
    }, 8000);

    const onExternalAbort = () => timeoutController.abort();
    signal?.addEventListener('abort', onExternalAbort);

    try {
      const params = new URLSearchParams({
        latitude: loc.latitude.toString(),
        longitude: loc.longitude.toString(),
        current: [
          'temperature_2m',
          'apparent_temperature',
          'relative_humidity_2m',
          'wind_speed_10m',
          'wind_direction_10m',
          'precipitation',
          'cloud_cover',
          'weather_code',
          'uv_index',
          'is_day',
        ].join(','),
        hourly: [
          'temperature_2m',
          'precipitation',
          'precipitation_probability',
          'weather_code',
          'is_day',
        ].join(','),
        daily: [
          'weather_code',
          'temperature_2m_max',
          'temperature_2m_min',
          'precipitation_sum',
          'precipitation_probability_max',
          'sunrise',
          'sunset',
          'uv_index_max',
        ].join(','),
        timezone: 'auto',
        forecast_days: '7',
      });

      const res = await fetch(`${OPEN_METEO_FORECAST_URL}?${params.toString()}`, {
        signal: timeoutController.signal,
      });

      if (!res.ok) {
        throw new Error(`Weather service returned status ${res.status}`);
      }

      const data: OpenMeteoRawResponse = await res.json();
      const normalized = normalizeWeatherData(data, loc.name);

      weatherMemoryCache.set(cacheKey, normalized, CACHE_TTL_MS);
      setWeather(normalized);
    } catch (err: unknown) {
      if (isTimedOut) {
        setError('Weather request timed out. Please check your connection.');
      } else if (signal?.aborted) {
        // Request superseded by another city, leave silently
      } else {
        setError('Unable to load weather forecast. Please try again.');
      }
    } finally {
      clearTimeout(timeoutId);
      signal?.removeEventListener('abort', onExternalAbort);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!location) return;

    const controller = new AbortController();
    fetchWeather(location, controller.signal);

    // Auto-refresh every 15 minutes
    const interval = setInterval(() => {
      const cacheKey = `weather_${location.latitude.toFixed(4)}_${location.longitude.toFixed(4)}`;
      weatherMemoryCache.set(cacheKey, null, 0);
      fetchWeather(location, controller.signal);
    }, 15 * 60 * 1000);

    // Auto-refresh when tab becomes visible again
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const cacheKey = `weather_${location.latitude.toFixed(4)}_${location.longitude.toFixed(4)}`;
        weatherMemoryCache.set(cacheKey, null, 0);
        fetchWeather(location, controller.signal);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      controller.abort();
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [location, fetchWeather]);

  const refetch = useCallback(() => {
    if (location) {
      const cacheKey = `weather_${location.latitude.toFixed(4)}_${location.longitude.toFixed(4)}`;
      weatherMemoryCache.set(cacheKey, null, 0);
      return fetchWeather(location);
    }
    return Promise.resolve();
  }, [location, fetchWeather]);

  return { weather, isLoading, error, refetch };
}
