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
    let label = 'Light Drizzle';
    if (code === 53) label = 'Moderate Drizzle';
    else if (code === 55) label = 'Dense Drizzle';
    else if (code === 56) label = 'Light Freezing Drizzle';
    else if (code === 57) label = 'Dense Freezing Drizzle';
    return {
      category: 'drizzle',
      label,
      iconName: 'CloudDrizzle',
    };
  }

  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
    let label = 'Moderate Rain';
    if (code === 61) label = 'Slight Rain';
    else if (code === 63) label = 'Moderate Rain';
    else if (code === 65) label = 'Heavy Rain';
    else if (code === 66) label = 'Light Freezing Rain';
    else if (code === 67) label = 'Heavy Freezing Rain';
    else if (code === 80) label = 'Slight Rain Showers';
    else if (code === 81) label = 'Moderate Rain Showers';
    else if (code === 82) label = 'Violent Rain Showers';
    return {
      category: 'rain',
      label,
      iconName: 'CloudRain',
    };
  }

  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    let label = 'Snowfall';
    if (code === 71) label = 'Slight Snow';
    else if (code === 73) label = 'Moderate Snow';
    else if (code === 75) label = 'Heavy Snow';
    else if (code === 77) label = 'Snow Grains';
    else if (code === 85) label = 'Slight Snow Showers';
    else if (code === 86) label = 'Heavy Snow Showers';
    return {
      category: 'snow',
      label,
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
    label: 'Unknown',
    iconName: isDay ? 'Sun' : 'Moon',
  };
}
