import { describe, it, expect } from 'vitest';
import {
  calculateSolarPosition,
  getPhase,
  getLocationLocalTime,
  parseLocalTimestamp,
} from './solarPosition';

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

describe('Multi-city location time and day/night determination', () => {
  it('correctly determines Dubai midday (UTC+4) as daytime', () => {
    const utcTime = '2026-11-01T08:00:00Z'; // 12:00 local Dubai
    const sunrise = '2026-11-01T06:30';
    const sunset = '2026-11-01T17:35';
    const local = getLocationLocalTime(14400, utcTime);

    expect(local.hour).toBe(12);
    expect(local.minute).toBe(0);
    expect(local.formattedTime).toBe('12:00 PM');
    expect(local.isoHour).toBe('2026-11-01T12');
    expect(getPhase(local.date, sunrise, sunset)).toBe('day');
    expect(calculateSolarPosition(local.date, sunrise, sunset).isDay).toBe(true);
  });

  it('correctly determines Vancouver 3 AM (UTC-8) as night', () => {
    const utcTime = '2026-11-01T11:00:00Z'; // 03:00 local Vancouver
    const sunrise = '2026-11-01T07:55';
    const sunset = '2026-11-01T17:52';
    const local = getLocationLocalTime(-28800, utcTime);

    expect(local.hour).toBe(3);
    expect(local.minute).toBe(0);
    expect(local.formattedTime).toBe('3:00 AM');
    expect(local.isoHour).toBe('2026-11-01T03');
    expect(getPhase(local.date, sunrise, sunset)).toBe('night');
    expect(calculateSolarPosition(local.date, sunrise, sunset).isDay).toBe(false);
  });

  it('correctly determines Reykjavik midday (UTC+0)', () => {
    const utcTime = '2026-11-01T13:00:00Z'; // 13:00 local Reykjavik
    const sunrise = '2026-11-01T09:30';
    const sunset = '2026-11-01T17:00';
    const local = getLocationLocalTime(0, utcTime);

    expect(local.hour).toBe(13);
    expect(local.isoHour).toBe('2026-11-01T13');
    expect(getPhase(local.date, sunrise, sunset)).toBe('day');
    expect(calculateSolarPosition(local.date, sunrise, sunset).isDay).toBe(true);
  });

  it('correctly determines Singapore at 10 PM (UTC+8) as night', () => {
    const utcTime = '2026-11-01T14:00:00Z'; // 22:00 local Singapore
    const sunrise = '2026-11-01T06:45';
    const sunset = '2026-11-01T18:50';
    const local = getLocationLocalTime(28800, utcTime);

    expect(local.hour).toBe(22);
    expect(local.isoHour).toBe('2026-11-01T22');
    expect(getPhase(local.date, sunrise, sunset)).toBe('night');
    expect(calculateSolarPosition(local.date, sunrise, sunset).isDay).toBe(false);
  });

  it('correctly handles fractional timezone city at UTC+5:30', () => {
    const utcDay = '2026-11-01T06:30:00Z'; // 12:00 local (midday)
    const utcNight = '2026-11-01T18:00:00Z'; // 23:30 local (night)
    const sunrise = '2026-11-01T06:35';
    const sunset = '2026-11-01T17:40';

    const localDay = getLocationLocalTime(19800, utcDay);
    expect(localDay.hour).toBe(12);
    expect(getPhase(localDay.date, sunrise, sunset)).toBe('day');

    const localNight = getLocationLocalTime(19800, utcNight);
    expect(localNight.hour).toBe(23);
    expect(getPhase(localNight.date, sunrise, sunset)).toBe('night');
  });

  it('correctly evaluates dawn and dusk windows with fixed timestamps', () => {
    const sunrise = '2026-11-01T06:30';
    const sunset = '2026-11-01T17:30';

    // 10 minutes before sunrise is within the 45 minute dawn window
    const dawnEarly = parseLocalTimestamp('2026-11-01T06:20');
    expect(getPhase(dawnEarly, sunrise, sunset)).toBe('dawn');

    // 10 minutes after sunrise is within the 45 minute dawn window
    const dawnLate = parseLocalTimestamp('2026-11-01T06:40');
    expect(getPhase(dawnLate, sunrise, sunset)).toBe('dawn');

    // 30 minutes before sunrise is outside dawn window (night)
    const nightBefore = parseLocalTimestamp('2026-11-01T06:00');
    expect(getPhase(nightBefore, sunrise, sunset)).toBe('night');

    // 10 minutes before sunset is within the 45 minute dusk window
    const duskEarly = parseLocalTimestamp('2026-11-01T17:20');
    expect(getPhase(duskEarly, sunrise, sunset)).toBe('dusk');

    // 10 minutes after sunset is within the 45 minute dusk window
    const duskLate = parseLocalTimestamp('2026-11-01T17:40');
    expect(getPhase(duskLate, sunrise, sunset)).toBe('dusk');

    // 30 minutes after sunset is outside dusk window (night)
    const nightAfter = parseLocalTimestamp('2026-11-01T18:00');
    expect(getPhase(nightAfter, sunrise, sunset)).toBe('night');
  });
});
