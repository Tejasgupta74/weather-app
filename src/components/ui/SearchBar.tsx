import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { useGeocoding } from '../../hooks/useGeocoding';
import { CityLocation } from '../../types/geo';

interface SearchBarProps {
  onSelectCity: (city: CityLocation) => void;
}

export function SearchBar({ onSelectCity }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { results, isLoading } = useGeocoding(query);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: CityLocation) => {
    onSelectCity(city);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xs md:max-w-sm">
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-theme-text/60 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search city..."
          className="w-full pl-9 pr-9 py-2 text-sm bg-theme-surface/70 border border-theme-text/10 rounded-md text-theme-text placeholder-theme-text/40 backdrop-blur-md focus:outline-none focus:ring-1 focus:ring-theme-sky focus:border-theme-sky transition-colors"
          aria-label="Search city"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 w-4 h-4 text-theme-text/60 animate-spin" />
        )}
        {!isLoading && query.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3 p-0.5 text-theme-text/60 hover:text-theme-text"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute left-0 right-0 mt-1.5 py-1 glass-panel-elevated rounded-md shadow-xl z-50 max-h-60 overflow-y-auto">
          {results.map((city) => (
            <button
              key={`${city.latitude}-${city.longitude}-${city.name}`}
              type="button"
              onClick={() => handleSelect(city)}
              className="w-full px-3 py-2 text-left flex items-center space-x-2.5 hover:bg-slate-800/80 transition-colors group"
            >
              <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <div className="truncate text-xs">
                <span className="font-medium text-slate-200 group-hover:text-white">
                  {city.name}
                </span>
                {city.admin1 && (
                  <span className="text-slate-400 ml-1">({city.admin1})</span>
                )}
                <span className="text-slate-500 ml-1.5">{city.country}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
