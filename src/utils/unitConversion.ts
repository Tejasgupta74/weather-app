export type UnitSystem = 'metric' | 'imperial';

export function toFahrenheit(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32);
}

export function toMph(kmh: number): number {
  return Math.round(kmh * 0.621371);
}

export function formatTemperature(celsius: number, unit: UnitSystem): string {
  const value = unit === 'imperial' ? toFahrenheit(celsius) : Math.round(celsius);
  return `${value}°`;
}

export function formatWindSpeed(kmh: number, unit: UnitSystem): string {
  if (unit === 'imperial') {
    return `${toMph(kmh)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function getWindDirectionCardinal(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round((((degrees % 360) + 360) % 360) / 45) % 8;
  return directions[index];
}
