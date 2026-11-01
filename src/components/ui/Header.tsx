import { LocateFixed } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { CityLocation } from '../../types/geo';
import { UnitSystem } from '../../utils/unitConversion';

interface HeaderProps {
  onSelectCity: (city: CityLocation) => void;
  onResetGeolocation: () => void;
  unit: UnitSystem;
  onToggleUnit: () => void;
  locationName?: string;
}

export function Header({
  onSelectCity,
  onResetGeolocation,
  unit,
  onToggleUnit,
}: HeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-3 w-full pointer-events-auto">
      {/* Brand Title */}
      <div className="flex items-center space-x-3">
        <div className="px-3 py-1.5 glass-panel rounded-md">
          <span className="text-xs uppercase tracking-wider text-theme-text/60 font-mono">
            3D Atmosphere
          </span>
        </div>
      </div>

      {/* Search Input & Action Controls */}
      <div className="flex items-center space-x-2.5">
        <SearchBar onSelectCity={onSelectCity} />

        {/* GPS Re-center Button */}
        <button
          type="button"
          onClick={onResetGeolocation}
          className="p-2 glass-panel rounded-md hover:bg-theme-surface/80 text-theme-text/75 hover:text-theme-text transition-colors focus:outline-none focus:ring-1 focus:ring-theme-sky"
          title="Detect Current Location"
          aria-label="Detect Current Location"
        >
          <LocateFixed className="w-4 h-4" />
        </button>

        {/* Unit Toggle Button */}
        <button
          type="button"
          onClick={onToggleUnit}
          className="px-3 py-2 glass-panel rounded-md hover:bg-theme-surface/80 transition-colors text-xs font-mono font-medium focus:outline-none focus:ring-1 focus:ring-theme-sky text-theme-text/90"
          aria-label={`Switch to ${unit === 'metric' ? 'Fahrenheit' : 'Celsius'}`}
        >
          {unit === 'metric' ? '°C' : '°F'}
        </button>
      </div>
    </header>
  );
}
