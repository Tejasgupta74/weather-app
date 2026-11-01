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
  // Curated fallback matching the exact Dribbble screenshot if empty
  const defaultItems = [
    {
      name: 'Liverpool',
      country: 'UK',
      latitude: 53.4084,
      longitude: -2.9916,
      conditionLabel: 'Partly Cloudy',
      iconName: 'Cloud',
      tempC: 16,
    },
    {
      name: 'Palermo',
      country: 'Italy',
      latitude: 38.1157,
      longitude: 13.3615,
      conditionLabel: 'Rain/Thunder',
      iconName: 'CloudLightning',
      tempC: -2,
    },
  ];

  return (
    <div className="glass-card rounded-2xl p-5 select-none space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white tracking-tight">
          Recently Searched
        </h3>
      </div>

      {/* List */}
      <div className="space-y-2">
        {recentLocations.length > 0
          ? recentLocations.slice(0, 3).map((item) => (
              <button
                key={`${item.latitude}-${item.longitude}-${item.name}`}
                type="button"
                onClick={() => onSelectCity(item)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-colors group text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/5 rounded-lg text-slate-300 group-hover:text-sky-400 transition-colors">
                    <WeatherIcon name="Cloud" className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white group-hover:text-sky-300">
                      {item.name}, {item.countryCode || item.country}
                    </h4>
                    <p className="text-[11px] text-slate-400">Forecast available</p>
                  </div>
                </div>
                <span className="text-sm font-bold font-mono text-white">
                  {formatTemperature(18, unit)}
                </span>
              </button>
            ))
          : defaultItems.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() =>
                  onSelectCity({
                    name: item.name,
                    country: item.country,
                    latitude: item.latitude,
                    longitude: item.longitude,
                  })
                }
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors group text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/5 rounded-lg text-slate-300 group-hover:text-sky-400 transition-colors">
                    <WeatherIcon name={item.iconName} className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white group-hover:text-sky-300">
                      {item.name}, {item.country}
                    </h4>
                    <p className="text-[11px] text-slate-400">{item.conditionLabel}</p>
                  </div>
                </div>
                <span className="text-sm font-bold font-mono text-white">
                  {formatTemperature(item.tempC, unit)}
                </span>
              </button>
            ))}
      </div>
    </div>
  );
}
