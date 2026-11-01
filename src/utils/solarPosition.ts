export interface SolarPosition {
  isDay: boolean;
  progress: number; // 0 to 1 across active daylight or night cycle
  sunAngle: number; // angle in radians (0 to Math.PI)
  ambientFactor: number; // 0.15 (deep night) to 1.0 (full daylight)
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

  // Night cycle
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
