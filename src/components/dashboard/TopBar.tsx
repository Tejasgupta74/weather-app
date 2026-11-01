import { useState, useRef, useEffect } from 'react';
import { MapPin, Search, X, Loader2, RefreshCw, LocateFixed } from 'lucide-react';
import { CityLocation } from '../../types/geo';
import { UnitSystem } from '../../utils/unitConversion';
import { useGeocoding } from '../../hooks/useGeocoding';

interface TopBarProps {
  locationName: string;
  formattedDate?: string;
  onSelectCity: (city: CityLocation) => void;
  unit: UnitSystem;
  onToggleUnit: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onLocate?: () => void;
}

export function TopBar({
  locationName,
  formattedDate,
  onSelectCity,
  unit,
  onToggleUnit,
  onRefresh,
  isRefreshing = false,
  onLocate,
}: TopBarProps) {
  const [query, setQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { results, isLoading } = useGeocoding(query);

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  // Close search on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: CityLocation) => {
    onSelectCity(city);
    setQuery('');
    setIsSearchOpen(false);
  };

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-4">
      {/* Location & Date Header */}
      <div className="flex items-center space-x-2.5">
        <MapPin className="w-5 h-5 text-theme-sky shrink-0" />
        <div>
          <h1 className="text-base md:text-lg font-bold tracking-tight text-theme-text leading-tight">
            {locationName}
          </h1>
          <p className="text-xs text-theme-text/60 font-medium">
            {formattedDate || todayFormatted}
          </p>
        </div>
      </div>

      {/* Right Actions: Search Bar & Unit Toggle */}
      <div className="flex items-center space-x-3">
        {/* Search Bar with Autocomplete Dropdown */}
        <div ref={searchContainerRef} className="relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search location..."
              className="w-48 sm:w-64 pl-3.5 pr-8 py-2 text-xs bg-white/[0.06] hover:bg-white/[0.09] focus:bg-white/[0.12] border border-white/10 rounded-xl text-slate-100 placeholder-slate-400 backdrop-blur-md focus:outline-none focus:ring-1 focus:ring-sky-400 transition-colors"
            />
            {isLoading ? (
              <Loader2 className="absolute right-2.5 w-3.5 h-3.5 text-slate-400 animate-spin" />
            ) : query.length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-2.5 p-0.5 text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            ) : (
              <Search className="absolute right-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            )}
          </div>

          {/* Autocomplete Menu */}
          {isSearchOpen && results.length > 0 && (
            <div className="absolute right-0 mt-1.5 w-64 py-1.5 glass-chassis rounded-xl shadow-2xl z-50 max-h-56 overflow-y-auto">
              {results.map((item) => (
                <button
                  key={`${item.latitude}-${item.longitude}-${item.name}`}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full px-3.5 py-2 text-left flex items-center space-x-2 hover:bg-white/10 transition-colors group"
                >
                  <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <div className="truncate text-xs">
                    <span className="font-medium text-slate-200 group-hover:text-white">
                      {item.name}
                    </span>
                    {item.admin1 && (
                      <span className="text-slate-400 ml-1">({item.admin1})</span>
                    )}
                    <span className="text-slate-500 ml-1.5">{item.country}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Current Location Button */}
        {onLocate && (
          <button
            type="button"
            onClick={onLocate}
            className="px-3.5 py-2 glass-button rounded-xl text-xs font-semibold text-slate-200 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-sky-400 flex items-center space-x-1.5"
            title="Detect Current GPS Location"
            aria-label="Detect Current GPS Location"
          >
            <LocateFixed className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="hidden sm:inline">Current Location</span>
          </button>
        )}

        {/* Unit Toggle Button (°C / °F) */}
        <button
          type="button"
          onClick={onToggleUnit}
          className="px-4 py-2 glass-button rounded-xl text-xs font-semibold text-slate-200 transition-colors focus:outline-none focus:ring-1 focus:ring-sky-400"
          aria-label={`Switch to ${unit === 'metric' ? 'Fahrenheit' : 'Celsius'}`}
        >
          {unit === 'metric' ? 'Display °F' : 'Display °C'}
        </button>

        {/* Refresh Button */}
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="p-2 glass-button rounded-xl text-slate-200 transition-colors focus:outline-none focus:ring-1 focus:ring-sky-400"
            title="Refresh weather"
            aria-label="Refresh weather"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
          </button>
        )}
      </div>
    </header>
  );
}
