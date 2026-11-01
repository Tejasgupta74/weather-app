export interface SolarPosition {
  isDay: boolean;
  progress: number;
  sunAngle: number;
  ambientFactor: number;
}

export type Phase = 'dawn' | 'day' | 'dusk' | 'night';

const WINDOW_MS = 45 * 60 * 1000;
const HALF_WINDOW_MS = WINDOW_MS / 2;

export function getPhase(
  currentTime: Date | string | number,
  sunrise?: string | null,
  sunset?: string | null,
  isDayFallback = true
): Phase {
  const now = new Date(currentTime).getTime();
  const sunriseTime = sunrise ? new Date(sunrise).getTime() : NaN;
  const sunsetTime = sunset ? new Date(sunset).getTime() : NaN;

  if (Number.isNaN(sunriseTime) || Number.isNaN(sunsetTime)) {
    return isDayFallback ? 'day' : 'night';
  }

  if (Math.abs(now - sunriseTime) <= HALF_WINDOW_MS) return 'dawn';
  if (Math.abs(now - sunsetTime) <= HALF_WINDOW_MS) return 'dusk';
  if (now > sunriseTime + HALF_WINDOW_MS && now < sunsetTime - HALF_WINDOW_MS) return 'day';
  return 'night';
}

export function getLocalTimeInTimezone(timezone?: string): Date {
  if (!timezone) return new Date();
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const parts = formatter.formatToParts(new Date());
    const getPart = (type: string) => parts.find((p) => p.type === type)?.value || '0';
    return new Date(
      Date.UTC(
        Number(getPart('year')),
        Number(getPart('month')) - 1,
        Number(getPart('day')),
        Number(getPart('hour')),
        Number(getPart('minute')),
        Number(getPart('second'))
      )
    );
  } catch {
    return new Date();
  }
}

export function calculateSolarPosition(
  currentTime: Date | string | number,
  sunrise: string,
  sunset: string
): SolarPosition {
  const now = new Date(currentTime).getTime();
  const sunriseTime = new Date(sunrise).getTime();
  const sunsetTime = new Date(sunset).getTime();

  if (Number.isNaN(sunriseTime) || Number.isNaN(sunsetTime)) {
    return {
      isDay: true,
      progress: 0.5,
      sunAngle: Math.PI / 2,
      ambientFactor: 0.9,
    };
  }

  const isDay = now >= sunriseTime && now < sunsetTime;

  if (isDay) {
    const dayDuration = Math.max(sunsetTime - sunriseTime, 1);
    const elapsed = Math.max(0, Math.min(now - sunriseTime, dayDuration));
    const progress = elapsed / dayDuration;
    const sunAngle = progress * Math.PI;
    const ambientFactor = Math.sin(sunAngle) * 0.8 + 0.2;

    return {
      isDay: true,
      progress,
      sunAngle,
      ambientFactor: Math.min(1.0, Math.max(0.2, ambientFactor)),
    };
  }

  const nightDuration = 24 * 3600 * 1000 - Math.max(sunsetTime - sunriseTime, 1);
  const timeSinceSunset = now >= sunsetTime ? now - sunsetTime : now + (24 * 3600 * 1000 - sunsetTime);
  const progress = Math.max(0, Math.min(timeSinceSunset / Math.max(nightDuration, 1), 1));
  const moonAngle = progress * Math.PI;

  return {
    isDay: false,
    progress,
    sunAngle: moonAngle,
    ambientFactor: 0.15,
  };
}
