export type WeatherConditionCategory =
  | 'clear'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'thunderstorm';

export interface WeatherConditionInfo {
  category: WeatherConditionCategory;
  label: string;
  iconName: 'Sun' | 'Moon' | 'Cloud' | 'CloudFog' | 'CloudDrizzle' | 'CloudRain' | 'CloudSnow' | 'CloudLightning';
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  cloudCover: number;
  weatherCode: number;
  uvIndex: number;
  isDay: boolean;
  sunrise: string;
  sunset: string;
  condition: WeatherConditionInfo;
}

export interface HourlyForecastItem {
  time: string;
  temperature: number;
  precipitation: number;
  weatherCode: number;
  condition: WeatherConditionInfo;
  isDay: boolean;
}

export interface DailyForecastItem {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  precipitation: number;
  weatherCode: number;
  condition: WeatherConditionInfo;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
}

export interface NormalizedWeatherData {
  locationName: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utcOffsetSeconds: number;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  fetchedAt: number;
}

export interface OpenMeteoRawResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset_seconds: number;
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    precipitation: number;
    cloud_cover: number;
    weather_code: number;
    uv_index: number;
    is_day: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation: number[];
    weather_code: number[];
    is_day: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    weather_code: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
  };
}
