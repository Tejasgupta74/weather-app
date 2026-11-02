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
    const hour = parseInt(isoString.slice(11, 13), 10);
    if (Number.isNaN(hour)) return isoString.slice(11, 16);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour} ${period}`;
  };

  return (
    <div className="glass-card rounded-2xl p-4 md:p-5 select-none overflow-x-auto">
      <div className="flex items-center justify-between min-w-[540px] space-x-2">
        {displayItems.map((item, index) => {
          const temp = formatTemperature(item.temperature, unit);
          const precipProb = item.precipitationProbability ?? 0;
          const showPrecip = precipProb > 0 || item.precipitation > 0;

          return (
            <div
              key={item.time}
              className="flex-1 flex flex-col items-center justify-between py-1 text-center space-y-2"
            >
              {/* Hour Label */}
              <span className="text-xs font-medium text-theme-text/75">
                {formatHour(item.time, index)}
              </span>

              {/* Weather Icon with Optional Precipitation Probability */}
              <div className="flex flex-col items-center my-1">
                <WeatherIcon
                  name={item.condition.iconName}
                  className="w-5 h-5 text-theme-text/85"
                />
                {showPrecip && (
                  <span className="text-[10px] font-mono text-theme-sky font-medium mt-0.5">
                    {precipProb}%
                  </span>
                )}
              </div>

              {/* Temperature */}
              <span className="text-sm font-bold font-mono text-theme-text">
                {temp}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
