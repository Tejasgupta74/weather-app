import { Wind, Droplets, Sun, Compass } from 'lucide-react';
import { CurrentWeather } from '../../types/weather';
import { UnitSystem, formatWindSpeed, getWindDirectionCardinal } from '../../utils/unitConversion';

interface MetricsGridProps {
  current: CurrentWeather;
  unit: UnitSystem;
}

export function MetricsGrid({ current, unit }: MetricsGridProps) {
  const windStr = formatWindSpeed(current.windSpeed, unit);
  const windCardinal = getWindDirectionCardinal(current.windDirection);

  const metrics = [
    {
      label: 'Wind',
      value: windStr,
      subValue: `${windCardinal} (${current.windDirection}°)`,
      icon: Wind,
      color: 'text-emerald-400',
    },
    {
      label: 'Humidity',
      value: `${current.humidity}%`,
      subValue: current.humidity > 60 ? 'Humid' : 'Comfortable',
      icon: Droplets,
      color: 'text-sky-400',
    },
    {
      label: 'UV Index',
      value: `${current.uvIndex}`,
      subValue: current.uvIndex >= 6 ? 'High' : current.uvIndex >= 3 ? 'Moderate' : 'Low',
      icon: Sun,
      color: 'text-amber-400',
    },
    {
      label: 'Cloud Cover',
      value: `${current.cloudCover}%`,
      subValue: current.cloudCover > 70 ? 'Overcast' : current.cloudCover > 30 ? 'Partly Cloudy' : 'Clear',
      icon: Compass,
      color: 'text-slate-300',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 w-full">
      {metrics.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="glass-panel p-3.5 rounded-lg flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase tracking-wider font-mono">{item.label}</span>
              <Icon className={`w-4 h-4 ${item.color}`} />
            </div>
            <div>
              <div className="text-lg md:text-xl font-bold font-mono text-slate-100">
                {item.value}
              </div>
              <div className="text-xs text-slate-400 mt-0.5 truncate">
                {item.subValue}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
