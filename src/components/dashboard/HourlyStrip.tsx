import { HourlyForecastItem } from '../../types/weather';
import { UnitSystem, formatTemperature } from '../../utils/unitConversion';
import { WeatherIcon } from '../ui/WeatherIcon';

interface HourlyStripProps {
  hourly: HourlyForecastItem[];
  unit: UnitSystem;
}

export function HourlyStrip({ hourly, unit }: HourlyStripProps) {
  const displayItems = hourly.slice(0, 8);

  const formatHour = (isoString: string, index: number) => {
    if (index === 0) return 'Now';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
    } catch {
      return isoString.slice(11, 16);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-4 md:p-5 select-none overflow-x-auto">
      <div className="flex items-center justify-between min-w-[540px] space-x-2">
        {displayItems.map((item, index) => {
          const temp = formatTemperature(item.temperature, unit);
          const hasPrecip = item.precipitation > 0;

          return (
            <div
              key={item.time}
              className="flex-1 flex flex-col items-center justify-between py-1 text-center space-y-2"
            >
              {/* Hour Label */}
              <span className="text-xs font-medium text-slate-400">
                {formatHour(item.time, index)}
              </span>

              {/* Weather Icon with Optional Precipitation % */}
              <div className="flex flex-col items-center my-1">
                <WeatherIcon
                  name={item.condition.iconName}
                  className="w-5 h-5 text-slate-300"
                />
                {hasPrecip && (
                  <span className="text-[10px] font-mono text-sky-400 font-medium mt-0.5">
                    {Math.round(Math.min(100, item.precipitation * 30))}%
                  </span>
                )}
              </div>

              {/* Temperature */}
              <span className="text-sm font-bold font-mono text-white">
                {temp}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
