import { WeatherConditionInfo } from '../types/weather';

export function weatherCodeMap(code: number, isDay: boolean = true): WeatherConditionInfo {
  if (code === 0) {
    return {
      category: 'clear',
      label: 'Clear Sky',
      iconName: isDay ? 'Sun' : 'Moon',
    };
  }

  if (code === 1) {
    return {
      category: 'clear',
      label: 'Mainly Clear',
      iconName: isDay ? 'Sun' : 'Moon',
    };
  }

  if (code === 2) {
    return {
      category: 'cloudy',
      label: 'Partly Cloudy',
      iconName: 'Cloud',
    };
  }

  if (code === 3) {
    return {
      category: 'cloudy',
      label: 'Overcast',
      iconName: 'Cloud',
    };
  }

  if (code === 45 || code === 48) {
    return {
      category: 'fog',
      label: code === 45 ? 'Fog' : 'Depositing Rime Fog',
      iconName: 'CloudFog',
    };
  }

  if (code >= 51 && code <= 57) {
    return {
      category: 'drizzle',
      label: code <= 53 ? 'Light Drizzle' : 'Dense Drizzle',
      iconName: 'CloudDrizzle',
    };
  }

  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
    return {
      category: 'rain',
      label: code >= 65 || code === 82 ? 'Heavy Rain' : 'Moderate Rain',
      iconName: 'CloudRain',
    };
  }

  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    return {
      category: 'snow',
      label: code >= 75 || code === 86 ? 'Heavy Snow' : 'Snowfall',
      iconName: 'CloudSnow',
    };
  }

  if (code >= 95 && code <= 99) {
    return {
      category: 'thunderstorm',
      label: code >= 96 ? 'Thunderstorm with Hail' : 'Thunderstorm',
      iconName: 'CloudLightning',
    };
  }

  return {
    category: 'clear',
    label: 'Clear',
    iconName: isDay ? 'Sun' : 'Moon',
  };
}
