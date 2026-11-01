import { HourlyForecastItem } from '../../types/weather';
import { UnitSystem, formatTemperature } from '../../utils/unitConversion';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastStripProps {
  hourly: HourlyForecastItem[];
  unit: UnitSystem;
}

export function HourlyForecastStrip({ hourly, unit }: HourlyForecastStripProps) {
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
    } catch {
      return isoString.slice(11, 16);
    }
  };

  return (
    <div className="glass-panel p-4 rounded-xl w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs uppercase tracking-wider font-mono text-slate-400">
          24-Hour Forecast
        </h3>
        <span className="text-xs text-slate-500 font-mono">Hourly timeline</span>
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
                  ? 'bg-slate-800/90 border border-sky-400/50 shadow-sm'
                  : 'bg-slate-900/40 border border-slate-700/40 hover:bg-slate-800/50'
              }`}
            >
              <span className="text-xs font-mono text-slate-300">
                {isNow ? 'Now' : formatTime(item.time)}
              </span>

              <div className="my-2 text-sky-400">
                <WeatherIcon name={item.condition.iconName} className="w-5 h-5" />
              </div>

              <span className="text-sm font-bold font-mono text-slate-100">
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
