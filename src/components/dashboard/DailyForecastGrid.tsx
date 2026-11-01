import { DailyForecastItem } from '../../types/weather';
import { UnitSystem, formatTemperature } from '../../utils/unitConversion';
import { WeatherIcon } from '../ui/WeatherIcon';

interface DailyForecastGridProps {
  daily: DailyForecastItem[];
  unit: UnitSystem;
}

export function DailyForecastGrid({ daily, unit }: DailyForecastGridProps) {
  const displayDays = daily.slice(0, 7);

  const getDayLabel = (dateStr: string, index: number) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } catch {
      const fallback = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return fallback[index % 7];
    }
  };

  return (
    <div className="glass-card rounded-2xl p-4 md:p-5 select-none overflow-x-auto">
      <div className="flex items-center justify-between min-w-[540px] space-x-2">
        {displayDays.map((item, index) => {
          const maxTemp = formatTemperature(item.temperatureMax, unit);
          const minTemp = formatTemperature(item.temperatureMin, unit);
          const hasRain = item.precipitation > 0;

          return (
            <div
              key={item.date}
              className="flex-1 flex flex-col items-center justify-between py-1 text-center space-y-2.5"
            >
              {/* Weekday Label */}
              <span className="text-xs font-semibold text-slate-300">
                {getDayLabel(item.date, index)}
              </span>

              {/* Weather Icon with Rain Probability */}
              <div className="flex flex-col items-center my-1">
                <div className="text-amber-400">
                  <WeatherIcon
                    name={item.condition.iconName}
                    className="w-5 h-5"
                  />
                </div>
                {hasRain && (
                  <span className="text-[10px] font-mono text-sky-400 font-medium mt-0.5">
                    {Math.round(Math.min(100, item.precipitation * 20))}%
                  </span>
                )}
              </div>

              {/* High & Low Temperature Stack */}
              <div className="flex flex-col items-center font-mono leading-tight">
                <span className="text-sm font-bold text-white">
                  {maxTemp}
                </span>
                <span className="text-xs text-slate-500 font-medium mt-0.5">
                  {minTemp}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
