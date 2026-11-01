import { DailyForecastItem } from '../../types/weather';
import { UnitSystem, formatTemperature } from '../../utils/unitConversion';
import { WeatherIcon } from './WeatherIcon';

interface DailyForecastListProps {
  daily: DailyForecastItem[];
  unit: UnitSystem;
}

export function DailyForecastList({ daily, unit }: DailyForecastListProps) {
  const getDayName = (dateStr: string, index: number) => {
    if (index === 0) return 'Today';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString([], { weekday: 'short' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="glass-panel p-4 md:p-5 rounded-xl w-full space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
        <h3 className="text-xs uppercase tracking-wider font-mono text-slate-400">
          7-Day Forecast
        </h3>
        <span className="text-xs text-slate-500 font-mono">Daily Outlook</span>
      </div>

      <div className="divide-y divide-slate-800/80">
        {daily.map((item, index) => {
          const maxTemp = formatTemperature(item.temperatureMax, unit);
          const minTemp = formatTemperature(item.temperatureMin, unit);

          return (
            <div
              key={item.date}
              className="py-2.5 flex items-center justify-between text-sm group hover:bg-slate-800/30 px-1.5 rounded transition-colors"
            >
              <span className="w-16 text-xs font-semibold text-slate-200">
                {getDayName(item.date, index)}
              </span>

              <div className="flex items-center space-x-2 w-32">
                <WeatherIcon
                  name={item.condition.iconName}
                  className="w-4 h-4 text-sky-400 shrink-0"
                />
                <span className="text-xs text-slate-400 truncate">
                  {item.condition.label}
                </span>
              </div>

              {/* Min / Max Temperature Bar */}
              <div className="flex items-center space-x-3 text-xs font-mono justify-end">
                <span className="text-slate-400 w-8 text-right">{minTemp}</span>
                <div className="w-14 h-1.5 bg-slate-700/60 rounded-sm overflow-hidden flex">
                  <div
                    className="h-full bg-gradient-to-r from-sky-400 to-amber-400 rounded-sm"
                    style={{ width: '100%' }}
                  />
                </div>
                <span className="text-slate-100 font-bold w-8 text-left">{maxTemp}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
