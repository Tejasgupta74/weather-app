import { CurrentWeather, DailyForecastItem } from '../../types/weather';
import { UnitSystem, formatTemperature } from '../../utils/unitConversion';

interface HeroBannerProps {
  current: CurrentWeather;
  todayDaily?: DailyForecastItem;
  unit: UnitSystem;
  backdropUrl?: string;
}

export function HeroBanner({ current, todayDaily, unit, backdropUrl }: HeroBannerProps) {
  const currentTemp = formatTemperature(current.temperature, unit);
  const maxTemp = todayDaily ? formatTemperature(todayDaily.temperatureMax, unit) : '';
  const minTemp = todayDaily ? formatTemperature(todayDaily.temperatureMin, unit) : '';

  const bannerImage = backdropUrl || 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="relative rounded-2xl overflow-hidden glass-card shadow-2xl min-h-[220px] flex items-center p-6 md:p-8 select-none">
      {/* Background Image with Atmospheric Darkness Overlay */}
      <img
        src={bannerImage}
        alt="Weather atmosphere"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-75 transition-opacity duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#121418]/90 via-[#161920]/65 to-[#121418]/40" />

      {/* Foreground Content */}
      <div className="relative z-10 w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Metrics & Condition */}
        <div className="space-y-3">
          <div className="text-6xl md:text-7xl font-light tracking-tight text-white leading-none font-mono">
            {currentTemp}
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              {current.condition.label}
            </h2>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              Humidity {current.humidity}%, Wind {current.windSpeed} km/h
            </p>
          </div>

          {todayDaily && (
            <div className="flex items-center space-x-2 pt-1">
              <span className="px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-md text-[11px] font-mono text-slate-200 border border-white/10">
                H: {maxTemp}
              </span>
              <span className="px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-md text-[11px] font-mono text-slate-300 border border-white/10">
                L: {minTemp}
              </span>
            </div>
          )}
        </div>

        {/* Right: Technical Subtext */}
        <div className="max-w-xs text-xs text-slate-300/90 leading-relaxed md:text-right font-normal">
          With real time data and advanced technology, we provide reliable forecasts for any location around the world.
        </div>
      </div>
    </div>
  );
}
