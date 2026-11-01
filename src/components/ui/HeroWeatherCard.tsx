import { CurrentWeather, DailyForecastItem } from '../../types/weather';
import { UnitSystem, formatTemperature } from '../../utils/unitConversion';
import { WeatherIcon } from './WeatherIcon';

interface HeroWeatherCardProps {
  current: CurrentWeather;
  todayDaily?: DailyForecastItem;
  locationName: string;
  unit: UnitSystem;
}

export function HeroWeatherCard({
  current,
  todayDaily,
  locationName,
  unit,
}: HeroWeatherCardProps) {
  const currentTemp = formatTemperature(current.temperature, unit);
  const feelsLikeTemp = formatTemperature(current.apparentTemperature, unit);
  const maxTemp = todayDaily ? formatTemperature(todayDaily.temperatureMax, unit) : '';
  const minTemp = todayDaily ? formatTemperature(todayDaily.temperatureMin, unit) : '';

  return (
    <div className="glass-panel p-5 md:p-6 rounded-xl max-w-sm w-full space-y-4">
      {/* Location & Condition Badge */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">
            Current Weather
          </span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-50 mt-0.5">
            {locationName}
          </h2>
        </div>
        <div className="p-2.5 bg-slate-800/60 rounded-lg text-sky-400 border border-slate-700/50">
          <WeatherIcon name={current.condition.iconName} className="w-6 h-6" />
        </div>
      </div>

      {/* Main Temperature & Condition Label */}
      <div className="space-y-1">
        <div className="flex items-baseline space-x-2">
          <span className="text-5xl md:text-6xl font-extrabold font-mono tracking-tight text-white">
            {currentTemp}
          </span>
        </div>
        <div className="text-sm font-medium text-slate-200">
          {current.condition.label}
        </div>
      </div>

      {/* Secondary Temperature Meta */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-700/60">
        <div>
          <span>Feels like </span>
          <span className="text-slate-200 font-medium font-mono">{feelsLikeTemp}</span>
        </div>
        {todayDaily && (
          <div className="space-x-2">
            <span>H: <strong className="text-slate-200 font-mono">{maxTemp}</strong></span>
            <span>L: <strong className="text-slate-400 font-mono">{minTemp}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
}
