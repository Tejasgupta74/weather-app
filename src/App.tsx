import { useCallback, useMemo } from 'react';
import { useGeolocation } from './hooks/useGeolocation';
import { useWeather } from './hooks/useWeather';
import { usePreferences } from './hooks/usePreferences';
import { CityLocation } from './types/geo';
import { resolveWeatherTheme } from './utils/themeResolver';

import { TopBar } from './components/dashboard/TopBar';
import { HeroBanner } from './components/dashboard/HeroBanner';
import { HourlyStrip } from './components/dashboard/HourlyStrip';
import { DailyForecastGrid } from './components/dashboard/DailyForecastGrid';
import { LiveConditionsCard } from './components/dashboard/LiveConditionsCard';
import { RecentlySearchedCard } from './components/dashboard/RecentlySearchedCard';
import { WindMapCard } from './components/dashboard/WindMapCard';

export default function App() {
  const { location, setLocation } = useGeolocation();
  const { unit, toggleUnit, recentLocations, addRecentLocation } = usePreferences();
  const { weather, isLoading, error, refetch } = useWeather(location);

  const handleSelectCity = useCallback(
    (city: CityLocation) => {
      setLocation(city);
      addRecentLocation(city);
    },
    [setLocation, addRecentLocation]
  );

  const handleResetGeolocation = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            name: 'Current Location',
            country: 'GPS',
            latitude: Number(pos.coords.latitude.toFixed(4)),
            longitude: Number(pos.coords.longitude.toFixed(4)),
          });
        },
        () => {
          // Keep current location if denied
        }
      );
    }
  }, [setLocation]);

  // Dynamically resolve theme according to live weather condition & solar cycle
  const theme = useMemo(() => {
    const category = weather?.current.condition.category || 'clear';
    const isDay = weather?.current.isDay ?? true;
    return resolveWeatherTheme(category, isDay);
  }, [weather]);

  return (
    <div
      className="min-h-screen w-full text-slate-100 relative flex flex-col p-4 md:p-6 lg:p-8 font-sans overflow-x-hidden transition-colors duration-700"
      style={{ backgroundColor: theme.bgBase }}
    >
      {/* Ambient Lighting Depth Adapting to Weather Theme */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden transition-all duration-700">
        {/* Primary Ambient Glow (Right side) */}
        <div
          className="absolute right-[-5%] top-[10%] w-[750px] h-[750px] rounded-full blur-[140px] transition-colors duration-700"
          style={{ backgroundColor: theme.glowRight }}
        />
        {/* Secondary Ambient Glow (Left side) */}
        <div
          className="absolute left-[-6%] bottom-[5%] w-[650px] h-[650px] rounded-full blur-[140px] transition-colors duration-700"
          style={{ backgroundColor: theme.glowLeft }}
        />
        {/* Horizon Shadow at Base */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t ${theme.horizonGradient} opacity-90 transition-all duration-700`}
        />
      </div>

      {/* Transparent Frosted Glass Dashboard Canvas */}
      <div className="relative z-10 w-full glass-chassis rounded-[28px] md:rounded-[36px] p-5 md:p-8 flex flex-col flex-1">
        {/* Top Bar Header */}
        <TopBar
          locationName={weather?.locationName || location?.name || 'Locating...'}
          onSelectCity={handleSelectCity}
          unit={unit}
          onToggleUnit={toggleUnit}
          onRefresh={refetch}
          isRefreshing={isLoading}
          onLocate={handleResetGeolocation}
        />

        {/* Loading or Error Banners */}
        {error && (
          <div className="mb-4 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-xs">
            {error}
          </div>
        )}

        {/* Core Weather Grid (Edge-to-Edge Inside Translucent Glass Chassis) */}
        {weather && (
          <main className="flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column (Hero Card, Hourly Rail, 7-Day Forecast) */}
            <div className="lg:col-span-8 space-y-4 w-full">
              <HeroBanner
                current={weather.current}
                todayDaily={weather.daily[0]}
                unit={unit}
                backdropUrl={theme.heroBackdrop}
              />
              <HourlyStrip hourly={weather.hourly} unit={unit} />
              <DailyForecastGrid daily={weather.daily} unit={unit} />
            </div>

            {/* Right Column (Live Conditions, Recently Searched, Wind Map) */}
            <div className="lg:col-span-4 space-y-4 w-full">
              <LiveConditionsCard
                current={weather.current}
                unit={unit}
                accentStroke={theme.accentStroke}
              />
              <RecentlySearchedCard
                recentLocations={recentLocations}
                onSelectCity={handleSelectCity}
                unit={unit}
              />
              <WindMapCard
                windSpeed={weather.current.windSpeed}
                windDirection={weather.current.windDirection}
                unit={unit}
                onLocate={handleResetGeolocation}
              />
            </div>
          </main>
        )}

        {/* Footer Legal Links */}
        <footer className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-8 mt-auto border-t border-white/5">
          <div className="flex items-center space-x-3">
            <a href="/privacy.html" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="/terms.html" className="hover:text-slate-300 transition-colors">Terms</a>
          </div>
          <span>Powered by Open-Meteo</span>
        </footer>
      </div>
    </div>
  );
}
