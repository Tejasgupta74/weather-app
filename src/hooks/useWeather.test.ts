import { describe, it, expect } from 'vitest';
import { normalizeWeatherData } from './useWeather';
import { OpenMeteoRawResponse } from '../types/weather';

function createMockResponse(overrides: Partial<OpenMeteoRawResponse> = {}): OpenMeteoRawResponse {
  const hours = Array.from({ length: 48 }, (_, i) => {
    const d = new Date(Date.UTC(2026, 10, 1, i, 0));
    const h = String(d.getUTCHours()).padStart(2, '0');
    return `2026-11-01T${h}:00`;
  });

  return {
    latitude: 25.2,
    longitude: 55.3,
    timezone: 'Asia/Dubai',
    utc_offset_seconds: 14400,
    current: {
      time: '2026-11-01T14:54',
      temperature_2m: 37.2,
      apparent_temperature: 39.1,
      relative_humidity_2m: 45,
      wind_speed_10m: 14,
      wind_direction_10m: 310,
      precipitation: 0,
      cloud_cover: 5,
      weather_code: 0,
      uv_index: 7.2,
      is_day: 1,
    },
    hourly: {
      time: hours,
      temperature_2m: hours.map((_, i) => 20 + (i % 15)),
      precipitation: hours.map(() => 0),
      weather_code: hours.map(() => 0),
      is_day: hours.map((_, i) => (i >= 6 && i < 18 ? 1 : 0)),
    },
    daily: {
      time: ['2026-11-01'],
      temperature_2m_max: [38],
      temperature_2m_min: [24],
      precipitation_sum: [0],
      weather_code: [0],
      sunrise: ['2026-11-01T06:30'],
      sunset: ['2026-11-01T17:35'],
      uv_index_max: [8],
    },
    ...overrides,
  };
}

describe('normalizeWeatherData', () => {
  it('anchors hourly strip Now temperature and condition to hero values', () => {
    const mock = createMockResponse();
    const result = normalizeWeatherData(mock, 'Dubai');

    expect(result.current.temperature).toBe(37.2);
    expect(result.current.isDay).toBe(true);
    // Now (index 0) must exactly equal current conditions
    expect(result.hourly[0].temperature).toBe(result.current.temperature);
    expect(result.hourly[0].condition.category).toBe(result.current.condition.category);
    expect(result.hourly[0].isDay).toBe(result.current.isDay);
  });

  it('correctly sets nighttime icon for Vancouver at 3 AM local time', () => {
    const mock = createMockResponse({
      timezone: 'America/Vancouver',
      utc_offset_seconds: -28800,
      current: {
        time: '2026-11-01T03:15',
        temperature_2m: 4.1,
        apparent_temperature: 2.5,
        relative_humidity_2m: 85,
        wind_speed_10m: 6,
        wind_direction_10m: 90,
        precipitation: 0,
        cloud_cover: 10,
        weather_code: 0,
        uv_index: 0,
        is_day: 0,
      },
    });

    const result = normalizeWeatherData(mock, 'Vancouver');

    expect(result.current.temperature).toBe(4.1);
    expect(result.current.isDay).toBe(false);
    expect(result.current.condition.iconName).toBe('Moon');
    // Hourly Now item must match
    expect(result.hourly[0].temperature).toBe(4.1);
    expect(result.hourly[0].isDay).toBe(false);
    expect(result.hourly[0].condition.iconName).toBe('Moon');
  });

  it('stores utcOffsetSeconds in normalized data', () => {
    const mock = createMockResponse({ utc_offset_seconds: 14400 });
    const result = normalizeWeatherData(mock, 'Dubai');
    expect(result.utcOffsetSeconds).toBe(14400);
  });
});
