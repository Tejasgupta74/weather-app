export interface SolarPosition {
  isDay: boolean;
  progress: number;
  sunAngle: number;
  ambientFactor: number;
}

export type Phase = 'dawn' | 'day' | 'dusk' | 'night';

export interface LocationTime {
  date: Date;
  isoHour: string;
  isoString: string;
  formattedDate: string;
  formattedTime: string;
  hour: number;
  minute: number;
}

const WINDOW_MS = 45 * 60 * 1000;
const HALF_WINDOW_MS = WINDOW_MS / 2;

export function parseLocalTimestamp(isoStr?: string | null): number {
  if (!isoStr) return NaN;
  const clean = isoStr.endsWith('Z') || isoStr.includes('+') || (isoStr.includes('-') && isoStr.length > 19)
    ? isoStr
    : `${isoStr}Z`;
  return new Date(clean).getTime();
}

export function getLocationLocalTime(
  utcOffsetSeconds = 0,
  baseUtcTime: number | Date | string = Date.now()
): LocationTime {
  const utcMs = typeof baseUtcTime === 'number' ? baseUtcTime : new Date(baseUtcTime).getTime();
  const localMs = utcMs + utcOffsetSeconds * 1000;
  const d = new Date(localMs);

  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  const hour = d.getUTCHours();
  const hourStr = String(hour).padStart(2, '0');
  const minute = String(d.getUTCMinutes()).padStart(2, '0');
  const second = String(d.getUTCSeconds()).padStart(2, '0');

  const isoHour = `${year}-${month}-${day}T${hourStr}`;
  const isoString = `${isoHour}:${minute}:${second}`;

  const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const formattedDate = `${weekdayNames[d.getUTCDay()]}, ${monthNames[d.getUTCMonth()]} ${d.getUTCDate()}`;

  const minuteNum = d.getUTCMinutes();
  const minuteStr = String(minuteNum).padStart(2, '0');
  const hour12 = hour % 12 || 12;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedTime = `${hour12}:${minuteStr} ${ampm}`;

  return {
    date: d,
    isoHour,
    isoString,
    formattedDate,
    formattedTime,
    hour,
    minute: minuteNum,
  };
}

export function getPhase(
  currentTime: Date | string | number,
  sunrise?: string | null,
  sunset?: string | null,
  isDayFallback = true
): Phase {
  const now = typeof currentTime === 'number'
    ? currentTime
    : currentTime instanceof Date
    ? currentTime.getTime()
    : parseLocalTimestamp(currentTime);

  const sunriseTime = parseLocalTimestamp(sunrise);
  const sunsetTime = parseLocalTimestamp(sunset);

  if (Number.isNaN(sunriseTime) || Number.isNaN(sunsetTime)) {
    return isDayFallback ? 'day' : 'night';
  }

  if (Math.abs(now - sunriseTime) <= HALF_WINDOW_MS) return 'dawn';
  if (Math.abs(now - sunsetTime) <= HALF_WINDOW_MS) return 'dusk';
  if (now > sunriseTime + HALF_WINDOW_MS && now < sunsetTime - HALF_WINDOW_MS) return 'day';
  return 'night';
}

export function calculateSolarPosition(
  currentTime: Date | string | number,
  sunrise?: string | null,
  sunset?: string | null
): SolarPosition {
  const now = typeof currentTime === 'number'
    ? currentTime
    : currentTime instanceof Date
    ? currentTime.getTime()
    : parseLocalTimestamp(currentTime);

  const sunriseTime = parseLocalTimestamp(sunrise);
  const sunsetTime = parseLocalTimestamp(sunset);

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
