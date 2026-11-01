import { describe, it, expect } from 'vitest';
import { calculateSolarPosition } from './solarPosition';

describe('calculateSolarPosition', () => {
  const sunrise = '2026-11-01T06:00:00Z';
  const sunset = '2026-11-01T18:00:00Z';

  it('determines midday as daytime with high ambient factor', () => {
    const noon = '2026-11-01T12:00:00Z';
    const result = calculateSolarPosition(noon, sunrise, sunset);

    expect(result.isDay).toBe(true);
    expect(result.progress).toBeCloseTo(0.5, 2);
    expect(result.ambientFactor).toBeGreaterThan(0.7);
  });

  it('determines midnight as night with low ambient factor', () => {
    const midnight = '2026-11-01T00:00:00Z';
    const result = calculateSolarPosition(midnight, sunrise, sunset);

    expect(result.isDay).toBe(false);
    expect(result.ambientFactor).toBe(0.15);
  });

  it('handles invalid dates gracefully', () => {
    const result = calculateSolarPosition('invalid', 'bad-sunrise', 'bad-sunset');
    expect(result.isDay).toBe(true);
    expect(result.progress).toBe(0.5);
  });
});
