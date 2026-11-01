import { MapPin } from 'lucide-react';
import { UnitSystem, formatWindSpeed, getWindDirectionCardinal } from '../../utils/unitConversion';

interface WindMapCardProps {
  windSpeed: number;
  windDirection: number;
  unit: UnitSystem;
  onLocate?: () => void;
}

export function WindMapCard({
  windSpeed,
  windDirection,
  unit,
  onLocate,
}: WindMapCardProps) {
  const speedStr = formatWindSpeed(windSpeed, unit);
  const cardinal = getWindDirectionCardinal(windDirection);

  const getFullCardinal = (dir: string) => {
    const map: Record<string, string> = {
      N: 'North',
      NE: 'Northeast',
      E: 'East',
      SE: 'Southeast',
      S: 'South',
      SW: 'Southwest',
      W: 'West',
      NW: 'Northwest',
    };
    return map[dir] || dir;
  };

  return (
    <div className="glass-card rounded-2xl p-5 select-none flex items-center justify-between">
      {/* Left: Wind Metrics */}
      <div className="space-y-1">
        <h3 className="text-xs font-semibold text-slate-400">Wind Map</h3>
        <div className="text-lg md:text-xl font-bold font-mono text-white">
          {speedStr}
        </div>
        <p className="text-xs text-slate-400 font-medium">
          {getFullCardinal(cardinal)}
        </p>
      </div>

      {/* Right: Stylized Dark Swirl Radar Tile with MapPin Button */}
      <div className="relative w-24 h-20 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center bg-slate-900 group">
        {/* Animated Radial / Conical Wind Stream Contours */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle at center, transparent 30%, rgba(56, 189, 248, 0.2) 32%, transparent 35%, rgba(56, 189, 248, 0.25) 55%, transparent 60%)`,
          }}
        />

        {/* Animated Rotating Radar Scan Line */}
        <div
          className="absolute inset-0 animate-spin"
          style={{
            animationDuration: '8s',
            background:
              'conic-gradient(from 0deg, transparent 0deg, rgba(56, 189, 248, 0.25) 60deg, transparent 90deg)',
          }}
        />

        {/* Interactive Location Target Button */}
        <button
          type="button"
          onClick={onLocate}
          className="relative z-10 w-9 h-9 rounded-full bg-white text-slate-900 shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          title="Detect Current GPS Location"
          aria-label="Detect Current GPS Location"
        >
          <MapPin className="w-4 h-4 fill-slate-900" />
        </button>
      </div>
    </div>
  );
}
