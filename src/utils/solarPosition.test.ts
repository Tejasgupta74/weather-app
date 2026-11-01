import { describe, it, expect } from 'vitest';
import { calculateSolarPosition, getPhase } from './solarPosition';

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

describe('getPhase', () => {
  const sunrise = '2026-11-01T06:00:00Z';
  const sunset = '2026-11-01T18:00:00Z';

  it('identifies night before dawn window starts', () => {
    expect(getPhase('2026-11-01T05:35:00Z', sunrise, sunset)).toBe('night');
  });

  it('identifies dawn 20 minutes before sunrise', () => {
    expect(getPhase('2026-11-01T05:40:00Z', sunrise, sunset)).toBe('dawn');
  });

  it('identifies dawn 1 minute before sunrise', () => {
    expect(getPhase('2026-11-01T05:59:00Z', sunrise, sunset)).toBe('dawn');
  });

  it('identifies dawn at exact sunrise', () => {
    expect(getPhase(sunrise, sunrise, sunset)).toBe('dawn');
  });

  it('identifies dawn 1 minute after sunrise', () => {
    expect(getPhase('2026-11-01T06:01:00Z', sunrise, sunset)).toBe('dawn');
  });

  it('identifies dawn 20 minutes after sunrise', () => {
    expect(getPhase('2026-11-01T06:20:00Z', sunrise, sunset)).toBe('dawn');
  });

  it('identifies day 25 minutes after sunrise', () => {
    expect(getPhase('2026-11-01T06:25:00Z', sunrise, sunset)).toBe('day');
  });

  it('identifies day at midday', () => {
    expect(getPhase('2026-11-01T12:00:00Z', sunrise, sunset)).toBe('day');
  });

  it('identifies day 25 minutes before sunset', () => {
    expect(getPhase('2026-11-01T17:35:00Z', sunrise, sunset)).toBe('day');
  });

  it('identifies dusk 20 minutes before sunset', () => {
    expect(getPhase('2026-11-01T17:40:00Z', sunrise, sunset)).toBe('dusk');
  });

  it('identifies dusk 1 minute before sunset', () => {
    expect(getPhase('2026-11-01T17:59:00Z', sunrise, sunset)).toBe('dusk');
  });

  it('identifies dusk at exact sunset', () => {
    expect(getPhase(sunset, sunrise, sunset)).toBe('dusk');
  });

  it('identifies dusk 1 minute after sunset', () => {
    expect(getPhase('2026-11-01T18:01:00Z', sunrise, sunset)).toBe('dusk');
  });

  it('identifies dusk 20 minutes after sunset', () => {
    expect(getPhase('2026-11-01T18:20:00Z', sunrise, sunset)).toBe('dusk');
  });

  it('identifies night 25 minutes after sunset', () => {
    expect(getPhase('2026-11-01T18:25:00Z', sunrise, sunset)).toBe('night');
  });

  it('identifies night at midnight', () => {
    expect(getPhase('2026-11-01T00:00:00Z', sunrise, sunset)).toBe('night');
  });

  it('handles polar day when sunrise and sunset are empty', () => {
    expect(getPhase('2026-11-01T12:00:00Z', '', '', true)).toBe('day');
  });

  it('handles polar day when sunrise and sunset are null', () => {
    expect(getPhase('2026-11-01T12:00:00Z', null, null, true)).toBe('day');
  });

  it('handles polar night when sunrise and sunset are empty', () => {
    expect(getPhase('2026-11-01T12:00:00Z', '', '', false)).toBe('night');
  });

  it('handles polar night when sunrise and sunset are null', () => {
    expect(getPhase('2026-11-01T12:00:00Z', null, null, false)).toBe('night');
  });
});
