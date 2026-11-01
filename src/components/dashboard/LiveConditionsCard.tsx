import { Droplets, Wind, Thermometer, SunMedium } from 'lucide-react';
import { CurrentWeather, HourlyForecastItem } from '../../types/weather';
import { UnitSystem, formatTemperature, formatWindSpeed } from '../../utils/unitConversion';

interface LiveConditionsCardProps {
  current: CurrentWeather;
  hourly?: HourlyForecastItem[];
  unit: UnitSystem;
  accentStroke?: string;
}

export function LiveConditionsCard({
  current,
  hourly,
  unit,
  accentStroke = '#38BDF8',
}: LiveConditionsCardProps) {
  const windStr = formatWindSpeed(current.windSpeed, unit);
  const feelsLikeStr = formatTemperature(current.apparentTemperature, unit);

  const hourlySlice = hourly ? hourly.slice(0, 12) : [];
  const temps = hourlySlice.map((h) => h.temperature);
  const minTemp = temps.length > 0 ? Math.min(...temps) : 0;
  const maxTemp = temps.length > 0 ? Math.max(...temps) : 0;
  const tempRange = Math.max(1, maxTemp - minTemp);

  const svgPoints = temps.map((t, idx) => {
    const x = 38 + (idx / Math.max(1, temps.length - 1)) * 242;
    const y = 46 - ((t - minTemp) / tempRange) * 32;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const pathData = svgPoints.length > 0 ? `M ${svgPoints.join(' L ')}` : '';

  return (
    <div className="glass-card rounded-2xl p-5 select-none space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-theme-text tracking-tight">
          Live Conditions
        </h3>
        <span className="text-xs font-mono text-theme-text/75">
          12h Temperature Trend
        </span>
      </div>

      {/* Real Hourly Temperature Chart with Labeled Axes */}
      {pathData && (
        <div className="relative h-20 w-full flex items-center justify-center">
          <svg
            viewBox="0 0 300 70"
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            {/* Horizontal Reference Gridlines */}
            <line
              x1="36"
              y1="14"
              x2="285"
              y2="14"
              stroke="currentColor"
              className="text-theme-text/10"
              strokeDasharray="3 3"
              strokeWidth="1"
            />
            <line
              x1="36"
              y1="46"
              x2="285"
              y2="46"
              stroke="currentColor"
              className="text-theme-text/10"
              strokeDasharray="3 3"
              strokeWidth="1"
            />

            {/* Y-Axis Value Labels */}
            <text
              x="2"
              y="17"
              className="fill-current text-theme-text/75 font-mono text-[9px]"
            >
              {formatTemperature(maxTemp, unit)}
            </text>
            <text
              x="2"
              y="49"
              className="fill-current text-theme-text/75 font-mono text-[9px]"
            >
              {formatTemperature(minTemp, unit)}
            </text>

            {/* Real Temperature Line */}
            <path
              d={pathData}
              fill="none"
              stroke={accentStroke}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* X-Axis Time Labels */}
            <text
              x="38"
              y="64"
              className="fill-current text-theme-text/60 font-mono text-[9px]"
            >
              Now
            </text>
            <text
              x="264"
              y="64"
              className="fill-current text-theme-text/60 font-mono text-[9px]"
            >
              +12h
            </text>
          </svg>
        </div>
      )}

      {/* Real Telemetry Grid */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-theme-text/10 text-left">
        <div className="p-2 rounded-lg bg-theme-text/5 flex items-center space-x-2.5">
          <Thermometer className="w-4 h-4 text-theme-sky flex-shrink-0" />
          <div>
            <p className="text-[10px] text-theme-text/60">Feels Like</p>
            <p className="text-xs font-bold font-mono text-theme-text">{feelsLikeStr}</p>
          </div>
        </div>

        <div className="p-2 rounded-lg bg-theme-text/5 flex items-center space-x-2.5">
          <Droplets className="w-4 h-4 text-theme-sky flex-shrink-0" />
          <div>
            <p className="text-[10px] text-theme-text/60">Humidity</p>
            <p className="text-xs font-bold font-mono text-theme-text">{current.humidity}%</p>
          </div>
        </div>

        <div className="p-2 rounded-lg bg-theme-text/5 flex items-center space-x-2.5">
          <Wind className="w-4 h-4 text-theme-sky flex-shrink-0" />
          <div>
            <p className="text-[10px] text-theme-text/60">Wind</p>
            <p className="text-xs font-bold font-mono text-theme-text">{windStr}</p>
          </div>
        </div>

        <div className="p-2 rounded-lg bg-theme-text/5 flex items-center space-x-2.5">
          <SunMedium className="w-4 h-4 text-theme-sky flex-shrink-0" />
          <div>
            <p className="text-[10px] text-theme-text/60">UV Index</p>
            <p className="text-xs font-bold font-mono text-theme-text">{current.uvIndex}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
