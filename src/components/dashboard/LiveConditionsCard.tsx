import { ChevronRight, Droplets, Wind, Gauge, TrendingUp } from 'lucide-react';
import { CurrentWeather } from '../../types/weather';
import { UnitSystem, formatWindSpeed } from '../../utils/unitConversion';

interface LiveConditionsCardProps {
  current: CurrentWeather;
  unit: UnitSystem;
  accentStroke?: string;
}

export function LiveConditionsCard({ current, unit, accentStroke = '#38BDF8' }: LiveConditionsCardProps) {
  const windStr = formatWindSpeed(current.windSpeed, unit);

  // Determine status label based on UV & Wind severity
  const getStatus = () => {
    if (current.uvIndex >= 7 || current.windSpeed >= 40 || current.precipitation >= 5) {
      return { label: 'Dangerous', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
    }
    if (current.uvIndex >= 4 || current.windSpeed >= 20 || current.precipitation > 0) {
      return { label: 'Moderate', color: 'bg-sky-500/20 text-sky-400 border-sky-500/30' };
    }
    return { label: 'Optimal', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
  };

  const status = getStatus();

  return (
    <div className="glass-card rounded-2xl p-5 select-none space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white tracking-tight">
          Live Conditions
        </h3>
        <button
          type="button"
          className="text-slate-400 hover:text-white transition-colors"
          aria-label="View live conditions details"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Status Tags */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center space-x-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
          <TrendingUp className="w-3 h-3" />
          <span>23.8%</span>
        </div>

        <span
          className={`px-3 py-0.5 rounded-md text-xs font-semibold border ${status.color}`}
        >
          {status.label}
        </span>
      </div>

      {/* Telemetry Spline Wave Chart */}
      <div className="relative h-16 w-full flex items-center justify-center">
        <svg
          viewBox="0 0 300 70"
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="liveSplineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="60%" stopColor={accentStroke} />
              <stop offset="100%" stopColor={accentStroke} />
            </linearGradient>
          </defs>

          {/* Dotted Baseline */}
          <line
            x1="0"
            y1="45"
            x2="300"
            y2="45"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeDasharray="4 4"
            strokeWidth="1"
          />

          {/* Smooth Telemetry Curve */}
          <path
            d="M 0 50 C 60 48, 90 20, 160 22 C 220 24, 240 10, 300 48"
            fill="none"
            stroke="url(#liveSplineGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Active Data Marker Point */}
          <circle cx="240" cy="18" r="4.5" fill="#F59E0B" stroke="#1C1F26" strokeWidth="2" />
          <circle cx="240" cy="18" r="8" fill="none" stroke="#F59E0B" strokeWidth="1" opacity="0.4" />
        </svg>
      </div>

      {/* 3 Bottom Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5 text-center">
        {/* Humidity */}
        <div className="space-y-1">
          <div className="flex items-center justify-center space-x-1 text-slate-400">
            <Droplets className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-xs font-bold text-white font-mono">{current.humidity}%</span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium">Humidity</p>
        </div>

        {/* Wind Speed */}
        <div className="space-y-1">
          <div className="flex items-center justify-center space-x-1 text-slate-400">
            <Wind className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-bold text-white font-mono">{windStr}</span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium">Wind</p>
        </div>

        {/* Pressure */}
        <div className="space-y-1">
          <div className="flex items-center justify-center space-x-1 text-slate-400">
            <Gauge className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold text-white font-mono">101 kPa</span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium">Pressure</p>
        </div>
      </div>
    </div>
  );
}
