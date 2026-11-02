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
    const x = (idx / Math.max(1, temps.length - 1)) * 100;
    const y = 85 - ((t - minTemp) / tempRange) * 70;
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

      {/* Real Hourly Temperature Chart with Non-Stretched Labels */}
      {pathData && (
        <div className="space-y-1">
          <div className="relative h-16 w-full flex items-center">
            {/* Y-Axis Value Labels (HTML - never stretched) */}
            <div className="flex flex-col justify-between h-full pr-2 text-right">
              <span className="text-[9px] font-mono text-theme-text/75 leading-none">
                {formatTemperature(maxTemp, unit)}
              </span>
              <span className="text-[9px] font-mono text-theme-text/75 leading-none">
                {formatTemperature(minTemp, unit)}
              </span>
            </div>

            {/* Scaled SVG Line Container */}
            <div className="relative flex-1 h-full">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                {/* Horizontal reference lines */}
                <line
                  x1="0"
                  y1="15"
                  x2="100"
                  y2="15"
                  stroke="currentColor"
                  className="text-theme-text/10"
                  strokeDasharray="2 2"
                  strokeWidth="0.5"
                  vectorEffect="non-scaling-stroke"
                />
                <line
                  x1="0"
                  y1="85"
                  x2="100"
                  y2="85"
                  stroke="currentColor"
                  className="text-theme-text/10"
                  strokeDasharray="2 2"
                  strokeWidth="0.5"
                  vectorEffect="non-scaling-stroke"
                />

                {/* Real Temperature Path */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={accentStroke}
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* X-Axis Time Labels (HTML - never stretched) */}
          <div className="flex justify-between pl-8 text-[9px] font-mono text-theme-text/70">
            <span>Now</span>
            <span>+11h</span>
          </div>
        </div>
      )}

      {/* Real Telemetry Grid */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-theme-text/10 text-left">
        <div className="p-2 rounded-lg bg-theme-text/5 flex items-center space-x-2.5">
          <Thermometer className="w-4 h-4 text-theme-sky flex-shrink-0" />
          <div>
            <p className="text-[10px] text-theme-text/70 font-medium">Feels Like</p>
            <p className="text-xs font-bold font-mono text-theme-text">{feelsLikeStr}</p>
          </div>
        </div>

        <div className="p-2 rounded-lg bg-theme-text/5 flex items-center space-x-2.5">
          <Droplets className="w-4 h-4 text-theme-sky flex-shrink-0" />
          <div>
            <p className="text-[10px] text-theme-text/70 font-medium">Humidity</p>
            <p className="text-xs font-bold font-mono text-theme-text">{current.humidity}%</p>
          </div>
        </div>

        <div className="p-2 rounded-lg bg-theme-text/5 flex items-center space-x-2.5">
          <Wind className="w-4 h-4 text-theme-sky flex-shrink-0" />
          <div>
            <p className="text-[10px] text-theme-text/70 font-medium">Wind</p>
            <p className="text-xs font-bold font-mono text-theme-text">{windStr}</p>
          </div>
        </div>

        <div className="p-2 rounded-lg bg-theme-text/5 flex items-center space-x-2.5">
          <SunMedium className="w-4 h-4 text-theme-sky flex-shrink-0" />
          <div>
            <p className="text-[10px] text-theme-text/70 font-medium">UV Index</p>
            <p className="text-xs font-bold font-mono text-theme-text">{current.uvIndex}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
