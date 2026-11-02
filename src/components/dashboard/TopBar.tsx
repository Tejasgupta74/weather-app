import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { MapPin, Search, X, Loader2, RefreshCw, LocateFixed } from 'lucide-react';
import { CityLocation } from '../../types/geo';
import { UnitSystem } from '../../utils/unitConversion';
import { useGeocoding } from '../../hooks/useGeocoding';

interface TopBarProps {
  locationName: string;
  formattedDate?: string;
  formattedTime?: string;
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
  formattedTime,
  onSelectCity,
  unit,
  onToggleUnit,
  onRefresh,
  isRefreshing = false,
  onLocate,
}: TopBarProps) {
  const [query, setQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
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
        setFocusedIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: CityLocation) => {
    onSelectCity(city);
    setQuery('');
    setIsSearchOpen(false);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isSearchOpen || results.length === 0) {
      if (e.key === 'ArrowDown' && results.length > 0) {
        setIsSearchOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex >= 0 && results[focusedIndex]) {
        handleSelect(results[focusedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsSearchOpen(false);
      setFocusedIndex(-1);
    }
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
          <p className="text-xs text-theme-text/75 font-medium flex items-center gap-1.5 flex-wrap">
            <span>{formattedDate || todayFormatted}</span>
            {formattedTime && (
              <>
                <span className="opacity-40">•</span>
                <span className="font-mono text-theme-text font-semibold">{formattedTime}</span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Right Actions: Search Bar & Unit Toggle */}
      <div className="flex items-center space-x-3">
        {/* Search Bar with Accessible Autocomplete Dropdown */}
        <div ref={searchContainerRef} className="relative">
          <div className="relative flex items-center">
            <input
              type="text"
              role="combobox"
              aria-expanded={isSearchOpen && results.length > 0}
              aria-haspopup="listbox"
              aria-controls="search-results-listbox"
              aria-autocomplete="list"
              aria-label="Search location by city name"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsSearchOpen(true);
                setFocusedIndex(-1);
              }}
              onFocus={() => {
                if (query.length > 0) setIsSearchOpen(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search location..."
              className="w-48 sm:w-64 pl-3.5 pr-8 py-2 text-xs bg-theme-text/[0.06] hover:bg-theme-text/[0.09] focus:bg-theme-text/[0.12] border border-theme-text/15 rounded-lg text-theme-text placeholder-theme-text/50 backdrop-blur-md focus:outline-none focus:ring-1 focus:ring-theme-sky transition-colors"
            />
            {isLoading ? (
              <Loader2 className="absolute right-2.5 w-3.5 h-3.5 text-theme-text/60 animate-spin" />
            ) : query.length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setIsSearchOpen(false);
                  setFocusedIndex(-1);
                }}
                className="absolute right-2.5 p-0.5 text-theme-text/60 hover:text-theme-text"
                aria-label="Clear search input"
              >
                <X className="w-3 h-3" />
              </button>
            ) : (
              <Search className="absolute right-2.5 w-3.5 h-3.5 text-theme-text/60 pointer-events-none" />
            )}
          </div>

          {/* Autocomplete Menu Listbox */}
          {isSearchOpen && results.length > 0 && (
            <ul
              id="search-results-listbox"
              role="listbox"
              aria-label="Search suggestions"
              className="absolute right-0 mt-1.5 w-64 py-1.5 glass-chassis rounded-xl shadow-2xl z-50 max-h-56 overflow-y-auto"
            >
              {results.map((item, index) => (
                <li
                  key={`${item.latitude}-${item.longitude}-${item.name}`}
                  role="option"
                  aria-selected={index === focusedIndex}
                >
                  <button
                    type="button"
                    onClick={() => handleSelect(item)}
                    className={`w-full px-3.5 py-2 text-left flex items-center space-x-2 transition-colors ${
                      index === focusedIndex ? 'bg-theme-text/15 text-theme-text' : 'hover:bg-theme-text/10 text-theme-text/85'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-theme-sky shrink-0" />
                    <div className="truncate text-xs">
                      <span className="font-medium text-theme-text">
                        {item.name}
                      </span>
                      {item.admin1 && (
                        <span className="text-theme-text/60 ml-1">({item.admin1})</span>
                      )}
                      <span className="text-theme-text/75 ml-1.5">{item.country}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Current Location Button */}
        {onLocate && (
          <button
            type="button"
            onClick={onLocate}
            className="px-3.5 py-2 glass-button rounded-lg text-xs font-semibold text-theme-text/85 hover:text-theme-text transition-colors focus:outline-none focus:ring-1 focus:ring-theme-sky flex items-center space-x-1.5"
            title="Detect current location"
            aria-label="Detect current location"
          >
            <LocateFixed className="w-3.5 h-3.5 text-theme-sky shrink-0" />
            <span className="hidden sm:inline">Current Location</span>
          </button>
        )}

        {/* Two-Option Segmented Unit Toggle (Bug 12) */}
        <div
          className="flex items-center rounded-lg border border-theme-text/10 bg-theme-text/5 p-0.5"
          role="group"
          aria-label="Select temperature unit"
        >
          <button
            type="button"
            onClick={() => unit !== 'metric' && onToggleUnit()}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold font-mono transition-colors ${
              unit === 'metric'
                ? 'bg-theme-text/20 text-theme-text font-bold shadow-sm'
                : 'text-theme-text/70 hover:text-theme-text'
            }`}
            aria-pressed={unit === 'metric'}
            aria-label="Display Celsius"
          >
            °C
          </button>
          <button
            type="button"
            onClick={() => unit !== 'imperial' && onToggleUnit()}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold font-mono transition-colors ${
              unit === 'imperial'
                ? 'bg-theme-text/20 text-theme-text font-bold shadow-sm'
                : 'text-theme-text/70 hover:text-theme-text'
            }`}
            aria-pressed={unit === 'imperial'}
            aria-label="Display Fahrenheit"
          >
            °F
          </button>
        </div>

        {/* Refresh Button */}
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="p-2 glass-button rounded-lg text-theme-text/85 transition-colors focus:outline-none focus:ring-1 focus:ring-theme-sky"
            title="Refresh weather"
            aria-label="Refresh weather"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-theme-sky' : ''}`} />
          </button>
        )}
      </div>
    </header>
  );
}
