import { CityLocation } from '../../types/geo';
import { WeatherIcon } from '../ui/WeatherIcon';
import { UnitSystem, formatTemperature } from '../../utils/unitConversion';

interface RecentlySearchedCardProps {
  recentLocations: CityLocation[];
  onSelectCity: (city: CityLocation) => void;
  unit: UnitSystem;
}

export function RecentlySearchedCard({
  recentLocations,
  onSelectCity,
  unit,
}: RecentlySearchedCardProps) {
  return (
    <div className="glass-card rounded-2xl p-5 select-none space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-theme-text tracking-tight">
          Recently Searched
        </h3>
      </div>

      {/* List */}
      <div className="space-y-2">
        {recentLocations.length > 0 ? (
          recentLocations.slice(0, 3).map((item) => (
            <button
              key={`${item.latitude}-${item.longitude}-${item.name}`}
              type="button"
              onClick={() => onSelectCity(item)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-theme-text/5 transition-colors group text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-theme-text/5 rounded-lg text-theme-text/75 group-hover:text-theme-sky transition-colors">
                  <WeatherIcon name="Cloud" className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-theme-text group-hover:text-theme-sky">
                    {item.name}, {item.countryCode || item.country}
                  </h4>
                  <p className="text-[11px] text-theme-text/60">
                    {item.conditionLabel || 'Forecast available'}
                  </p>
                </div>
              </div>
              {item.temperature !== undefined && (
                <span className="text-sm font-bold font-mono text-theme-text">
                  {formatTemperature(item.temperature, unit)}
                </span>
              )}
            </button>
          ))
        ) : (
          <p className="text-xs text-theme-text/60 py-3 text-center">
            No recent searches
          </p>
        )}
      </div>
    </div>
  );
}
