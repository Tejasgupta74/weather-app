import { useCallback, useMemo } from 'react';
import { useGeolocation } from './hooks/useGeolocation';
import { useWeather } from './hooks/useWeather';
import { usePreferences } from './hooks/usePreferences';
import { useWeatherTheme } from './hooks/useWeatherTheme';
import { getPhase, calculateSolarPosition, getLocationLocalTime } from './utils/solarPosition';
import { CityLocation } from './types/geo';
import { SceneWeatherState } from './types/scene';

import { WeatherCanvas } from './components/scene/WeatherCanvas';
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
          // Keep current location if permission is denied
        }
      );
    }
  }, [setLocation]);

  // 1. Normalized weather condition category
  const condition = weather?.current.condition.category || 'clear';

  // 2. Location local time from Open-Meteo utc_offset_seconds as single source of truth
  const locationTime = useMemo(() => {
    return getLocationLocalTime(weather?.utcOffsetSeconds ?? 0);
  }, [weather?.utcOffsetSeconds]);

  // 3. Solar phase computed from searched location time (not browser time)
  const phase = useMemo(() => {
    return getPhase(
      locationTime.date,
      weather?.current.sunrise,
      weather?.current.sunset,
      weather?.current.isDay ?? true
    );
  }, [locationTime, weather?.current.sunrise, weather?.current.sunset, weather?.current.isDay]);

  // 4. Dynamic weather theme hook (sets CSS variables on document.documentElement)
  const theme = useWeatherTheme(condition, phase);

  // 5. Solar arc calculation for 3D celestial tracking
  const solar = useMemo(() => {
    return calculateSolarPosition(
      locationTime.date,
      weather?.current.sunrise || '',
      weather?.current.sunset || ''
    );
  }, [locationTime, weather?.current.sunrise, weather?.current.sunset]);

  // 5. 3D Scene state
  const sceneState: SceneWeatherState = useMemo(
    () => ({
      temperature: weather?.current.temperature ?? 18,
      precipitation: weather?.current.precipitation ?? 0,
      windSpeed: weather?.current.windSpeed ?? 5,
      windDirection: weather?.current.windDirection ?? 180,
      cloudCover: weather?.current.cloudCover ?? 20,
      isDay: weather?.current.isDay ?? (phase === 'day' || phase === 'dawn'),
      sunAngle: solar.sunAngle,
      ambientFactor: solar.ambientFactor,
      weatherCategory: condition,
      latitude: weather?.latitude ?? location?.latitude ?? 51.5074,
      longitude: weather?.longitude ?? location?.longitude ?? -0.1278,
    }),
    [weather, phase, solar, condition, location]
  );

  return (
    <div className="min-h-screen w-full text-theme-text relative flex flex-col p-4 md:p-6 lg:p-8 font-sans overflow-x-hidden transition-colors duration-1000 bg-theme-surface">
      {/* 3D WebGL Scene in Background */}
      <WeatherCanvas
        weatherState={sceneState}
        themeColors={theme}
        phase={phase}
      />

      {/* Transparent Frosted Glass Dashboard Canvas */}
      <div className="relative z-10 w-full glass-chassis rounded-[28px] md:rounded-[36px] p-5 md:p-8 flex flex-col flex-1">
        {/* Top Bar Header */}
        <TopBar
          locationName={weather?.locationName || location?.name || 'Locating...'}
          formattedDate={weather ? locationTime.formattedDate : undefined}
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
              />
              <HourlyStrip hourly={weather.hourly} unit={unit} />
              <DailyForecastGrid daily={weather.daily} unit={unit} />
            </div>

            {/* Right Column (Live Conditions, Recently Searched, Wind Map) */}
            <div className="lg:col-span-4 space-y-4 w-full">
              <LiveConditionsCard
                current={weather.current}
                unit={unit}
                accentStroke={theme.sky}
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
        <footer className="flex items-center justify-between text-[11px] text-theme-text/60 font-mono pt-8 mt-auto border-t border-theme-text/10">
          <div className="flex items-center space-x-3">
            <a href="/privacy.html" className="hover:text-theme-text transition-colors">
              Privacy
            </a>
            <a href="/terms.html" className="hover:text-theme-text transition-colors">
              Terms
            </a>
          </div>
          <span>Powered by Open-Meteo</span>
        </footer>
      </div>
    </div>
  );
}
