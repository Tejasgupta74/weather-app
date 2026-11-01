import { HourlyForecastItem } from '../../types/weather';
import { UnitSystem, formatTemperature } from '../../utils/unitConversion';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastStripProps {
  hourly: HourlyForecastItem[];
  unit: UnitSystem;
}

export function HourlyForecastStrip({ hourly, unit }: HourlyForecastStripProps) {
  const formatTime = (isoString: string) => {
    const hour = parseInt(isoString.slice(11, 13), 10);
    if (Number.isNaN(hour)) return isoString.slice(11, 16);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour} ${period}`;
  };

  return (
    <div className="glass-panel p-4 rounded-xl w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs uppercase tracking-wider font-mono text-theme-text/60">
          24-Hour Forecast
        </h3>
        <span className="text-xs text-theme-text/40 font-mono">Hourly timeline</span>
      </div>

      <div className="flex space-x-2.5 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
        {hourly.map((item, index) => {
          const isNow = index === 0;
          const temp = formatTemperature(item.temperature, unit);

          return (
            <div
              key={item.time}
              className={`shrink-0 flex flex-col items-center justify-between p-2.5 rounded-lg w-16 transition-colors ${
                isNow
                  ? 'bg-theme-surface/90 border border-theme-sky/50 shadow-sm'
                  : 'bg-theme-surface/40 border border-theme-text/10 hover:bg-theme-surface/60'
              }`}
            >
              <span className="text-xs font-mono text-theme-text/80">
                {isNow ? 'Now' : formatTime(item.time)}
              </span>

              <div className="my-2 text-theme-sky">
                <WeatherIcon name={item.condition.iconName} className="w-5 h-5" />
              </div>

              <span className="text-sm font-bold font-mono text-theme-text">
                {temp}
              </span>

              {item.precipitation > 0 && (
                <span className="text-[10px] font-mono text-sky-300 mt-1">
                  {item.precipitation}mm
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
