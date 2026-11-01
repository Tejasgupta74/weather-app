import { WeatherConditionCategory } from './weather';

export interface SceneWeatherState {
  isDay: boolean;
  sunAngle: number;
  ambientFactor: number;
  cloudCover: number; // 0 to 100
  precipitation: number; // mm
  windSpeed: number; // km/h
  windDirection: number; // degrees
  weatherCategory: WeatherConditionCategory;
  latitude: number;
  longitude: number;
}
