import { CurrentWeather, DailyForecastItem } from '../../types/weather';
import { UnitSystem, formatTemperature } from '../../utils/unitConversion';

interface HeroBannerProps {
  current: CurrentWeather;
  todayDaily?: DailyForecastItem;
  unit: UnitSystem;
}

export function HeroBanner({ current, todayDaily, unit }: HeroBannerProps) {
  const currentTemp = formatTemperature(current.temperature, unit);
  const maxTemp = todayDaily ? formatTemperature(todayDaily.temperatureMax, unit) : '';
  const minTemp = todayDaily ? formatTemperature(todayDaily.temperatureMin, unit) : '';

  return (
    <div className="relative rounded-2xl overflow-hidden glass-card shadow-2xl min-h-[160px] flex items-center p-6 md:p-8 select-none">
      {/* Foreground Content */}
      <div className="relative z-10 w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Metrics & Condition */}
        <div className="space-y-3">
          <div className="text-6xl md:text-7xl font-light tracking-tight text-theme-text leading-none font-mono">
            {currentTemp}
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-theme-text">
              {current.condition.label}
            </h2>
            <p className="text-xs text-theme-text/75 font-medium mt-0.5">
              Humidity {current.humidity}%, Wind {current.windSpeed} km/h
            </p>
          </div>

          {todayDaily && (
            <div className="flex items-center space-x-2 pt-1">
              <span className="px-2.5 py-1 bg-theme-text/10 backdrop-blur-md rounded-md text-[11px] font-mono text-theme-text/90 border border-theme-text/10">
                H: {maxTemp}
              </span>
              <span className="px-2.5 py-1 bg-theme-text/10 backdrop-blur-md rounded-md text-[11px] font-mono text-theme-text/75 border border-theme-text/10">
                L: {minTemp}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
