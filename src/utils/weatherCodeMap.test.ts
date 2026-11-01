import { describe, it, expect } from 'vitest';
import { weatherCodeMap } from './weatherCodeMap';

describe('weatherCodeMap', () => {
  it('maps code 0 to clear sky with Sun in daytime', () => {
    const res = weatherCodeMap(0, true);
    expect(res.category).toBe('clear');
    expect(res.iconName).toBe('Sun');
  });

  it('maps code 0 to clear sky with Moon at night', () => {
    const res = weatherCodeMap(0, false);
    expect(res.category).toBe('clear');
    expect(res.iconName).toBe('Moon');
  });

  it('maps code 3 to overcast with Cloud icon', () => {
    const res = weatherCodeMap(3, true);
    expect(res.category).toBe('cloudy');
    expect(res.iconName).toBe('Cloud');
  });

  it('maps code 45 to fog', () => {
    const res = weatherCodeMap(45, true);
    expect(res.category).toBe('fog');
    expect(res.iconName).toBe('CloudFog');
  });

  it('maps code 51 to drizzle', () => {
    const res = weatherCodeMap(51, true);
    expect(res.category).toBe('drizzle');
    expect(res.iconName).toBe('CloudDrizzle');
  });

  it('maps code 61 and 80 to rain', () => {
    expect(weatherCodeMap(61, true).category).toBe('rain');
    expect(weatherCodeMap(80, true).category).toBe('rain');
  });

  it('maps code 71 to snow', () => {
    const res = weatherCodeMap(71, true);
    expect(res.category).toBe('snow');
    expect(res.iconName).toBe('CloudSnow');
  });

  it('maps code 95 to thunderstorm', () => {
    const res = weatherCodeMap(95, true);
    expect(res.category).toBe('thunderstorm');
    expect(res.iconName).toBe('CloudLightning');
  });

  it('falls back to clear for unknown codes', () => {
    const res = weatherCodeMap(999, true);
    expect(res.category).toBe('clear');
  });
});
