import { LocateFixed, Navigation } from 'lucide-react';
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

  return (
    <div className="glass-card rounded-2xl p-5 select-none flex items-center justify-between">
      {/* Left: Wind Metrics */}
      <div className="space-y-1">
        <h3 className="text-xs font-semibold text-theme-text/70 tracking-tight">Wind Conditions</h3>
        <div className="text-lg md:text-xl font-bold font-mono text-theme-text">
          {speedStr}
        </div>
        <p className="text-xs text-theme-text/75 font-medium">
          Wind from {cardinal} ({windDirection}°)
        </p>
      </div>

      {/* Right: Static Wind Direction Compass Indicator with Locate Button */}
      <div className="flex items-center space-x-2.5">
        <div
          className="w-11 h-11 rounded-lg border border-theme-text/10 bg-theme-text/5 flex items-center justify-center text-theme-sky"
          title={`Wind from ${cardinal} (${windDirection}°)`}
          aria-label={`Wind from ${cardinal} (${windDirection}°)`}
        >
          <Navigation
            className="w-5 h-5 transition-transform duration-500"
            style={{ transform: `rotate(${(windDirection + 135) % 360}deg)` }}
          />
        </div>

        {onLocate && (
          <button
            type="button"
            onClick={onLocate}
            className="w-11 h-11 rounded-lg border border-theme-text/10 bg-theme-text/5 hover:bg-theme-text/10 text-theme-text transition-colors flex items-center justify-center"
            title="Detect current location"
            aria-label="Detect current location"
          >
            <LocateFixed className="w-4 h-4 text-theme-sky" />
          </button>
        )}
      </div>
    </div>
  );
}
