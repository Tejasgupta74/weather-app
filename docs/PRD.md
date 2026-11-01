# Product Requirements Document (PRD)

## Project: 3D Weather Web App
**Status:** In Review  
**Version:** 1.0.0  
**Target Platform:** Web (Desktop, Tablet, Mobile)  

---

## 1. Problem Statement
Most digital weather applications present atmospheric data through flat, static numeric grids and repetitive stock icons. These interfaces fail to deliver an intuitive sense of real-world ambient conditions. Users must mentally reconstruct what 15 mm of precipitation or 85 percent cloud cover actually feels like. Conversely, existing interactive 3D weather demos frequently suffer from unoptimized render loops, excessive battery drain, illegible text contrast, and poor mobile support.

This project delivers a high-performance web application that connects live meteorological data from Open-Meteo with an interactive, low-poly 3D environmental landscape. It provides instant atmospheric immersion while preserving immediate data legibility through a clean, accessible overlay interface.

---

## 2. Target Users
1. **Daily Commuters and Everyday Planners:** Individuals who need rapid, accurate answers to immediate questions: will it rain during commute hours, what is the temperature trend, and how strong is the wind?
2. **Visual Explorers and Design-Conscious Web Users:** Users who value ambient, immersive data presentation that reflects day/night transitions, precipitation density, and cloud conditions in real time without cognitive clutter.

---

## 3. Goals
- **Zero-Key Open Meteorological Pipeline:** Ingest accurate current conditions, 24-hour hourly forecasts, and 7-day daily forecasts from Open-Meteo APIs with zero API key dependencies.
- **Reactive 3D Low-Poly Landscape:** Render an instanced Three.js scene (hills, trees, low-poly house, sun, moon, stars) that updates its lighting, sky color, fog, and particle systems in direct response to live weather metrics.
- **Zero-Allocation Rendering Performance:** Maintain consistent 60 frames per second on desktop and 30 to 60 frames per second on mobile by using instanced particle buffers (`useMemo`, `useRef`), eliminating per-frame garbage collection.
- **Smooth Weather Transitions:** Interpolate lighting, sky colors, fog density, and particle velocities smoothly when changing target locations, avoiding sudden visual cuts.
- **Accessible, Responsive Overlay UI:** Deliver a structured overlay designed for WCAG AA contrast standards with search autocomplete, unit toggles, hourly strips, and 7-day forecast cards that adapts seamlessly to desktop and mobile displays.
- **Local-First Reliability:** Cache API responses for 5 minutes in memory, save unit preferences and recent locations in `localStorage`, and provide graceful fallbacks (browser geolocation, then default city).

---

## 4. Non-Goals (Scope Boundaries for v1)
- **User Accounts and Cloud Sync:** No user login, OAuth, or server-side user database. All saved preferences remain local to the client browser.
- **Historical Data Analysis:** No multi-year historical weather queries or retrospective trend analysis.
- **Live Doppler Radar Tiles:** No heavy GIS map tile layers (e.g., Leaflet or Mapbox satellite radar overlays).
- **Push Notifications:** No background browser service worker alerts for weather changes.
- **Native App Store Distribution:** No native mobile wrappers (Capacitor/Cordova/React Native). The application runs as a responsive web app.

---

## 5. P0 / P1 / P2 Feature Table

| Priority | Feature | Description | Acceptance Goal |
|---|---|---|---|
| **P0** | Open-Meteo Data Fetching | Ingest current weather, 24h hourly, and 7d daily forecasts | Complete forecast payload delivered under 800ms on broadband |
| **P0** | Geolocation and Fallback | Browser GPS resolution with graceful fallback to default city | Resolved location displayed within 1.5s of initial page render |
| **P0** | City Autocomplete Search | Debounced search input against Open-Meteo Geocoding API | Suggestions render within 300ms of user typing |
| **P0** | Low-Poly 3D Environment | Three.js scene with terrain, trees, house, dynamic sun/moon | Renders without frame drops or memory leaks |
| **P0** | Dynamic Weather FX | Rain, snow, clouds, fog, lightning, and wind drift | Particle systems scale parameters directly from weather metrics |
| **P0** | Primary Metric Overlay | Current temperature, condition label, feels-like, wind, humidity, UV | Clean, high-contrast overlay adhering to accessibility standards |
| **P1** | 24-Hour Hourly Forecast Strip | Horizontally scrollable 24-hour forecast cards | Accurate hour-by-hour temperature and precipitation timeline |
| **P1** | 7-Day Forecast Grid | 7-day overview with high/low temperatures and weather conditions | Clear multi-day planning summary |
| **P1** | Unit Toggle (°C / °F) | Toggle between Celsius and Fahrenheit with unit conversion | Instant recalculation, persisted in `localStorage` |
| **P1** | State Interpolation | Smooth visual crossfades when switching cities | 1.0 to 1.5 second dampening transition on sky, fog, and light |
| **P1** | Mobile Optimization | Dynamic fidelity scaling (reduced particles, disabled shadows) | Stable 30+ FPS on mobile viewports under 768px |
| **P2** | Interactive Camera Parallax | Gentle mouse-following parallax and clamped OrbitControls | Subtle spatial depth without breaking UI legibility |
| **P2** | Air Quality Index (AQI) | Optional secondary atmospheric health indicator card | Integrates Open-Meteo air quality endpoint if data is available |

---

## 6. User Stories and Acceptance Criteria

### US-1: Initial Application Load and Geolocation
As a user opening the application for the first time,  
I want the app to detect my approximate location and display my local weather,  
so that I immediately see relevant environmental conditions without manual input.

- [ ] Prompts browser for geolocation permissions on first load.
- [ ] If permission is granted, queries Open-Meteo using the retrieved coordinates.
- [ ] If permission is denied or times out after 3 seconds, falls back to a default location (e.g., London: 51.5074° N, 0.1278° W).
- [ ] Caches weather response for 5 minutes in client state to prevent redundant requests.
- [ ] Displays an accessible loading indicator during initial data resolution.

### US-2: Location Search and Autocomplete
As a user planning travel,  
I want to search for any global city with auto-suggested matches,  
so that I can inspect foreign weather conditions and see their 3D representation.

- [ ] Search input debounces queries by 300ms.
- [ ] Queries the Open-Meteo Geocoding API with a minimum query length of 2 characters.
- [ ] Renders matching results showing city name, administrative region, and country.
- [ ] Selecting a result updates coordinates, triggers the weather fetch, and closes dropdown.
- [ ] Handles zero-result queries with an explicit, non-blocking empty state message.
- [ ] Keyboard accessible (Arrow Down, Arrow Up, Enter, Escape).

### US-3: 3D Environment and Time-of-Day Realism
As a visual user,  
I want the 3D scene to reflect the target city's solar cycle and ambient conditions,  
so that the atmosphere feels grounded in local reality.

- [ ] Determines day vs night state using `is_day`, `sunrise`, and `sunset` from the API.
- [ ] Adjusts directional light angle and color temperature according to solar position.
- [ ] Displays low-poly sun during daytime and moon with star field during nighttime.
- [ ] Renders low-poly landscape geometry (rolling terrain, simplified trees, architectural hut).
- [ ] Smoothly fades lighting values over 1.2 seconds when switching between disparate locations.

### US-4: Dynamic Weather Effects
As a user checking adverse weather conditions,  
I want the scene to accurately portray rain, snow, fog, clouds, or thunderstorms,  
so that I can visually gauge weather severity at a glance.

- [ ] WMO codes 51-67 map to rain particle system with density scaled by precipitation rate.
- [ ] WMO codes 71-77, 85-86 map to snow particle system with drifting velocity.
- [ ] Cloud mesh layer opacity and quantity scale according to `cloud_cover` (0-100%).
- [ ] Fog density adjusts dynamically when WMO code indicates mist or fog (WMO 45, 48).
- [ ] Thunderstorm codes (WMO 95, 96, 99) trigger randomized light flashes and scene pulses.
- [ ] Wind speed and wind direction orient particle drift vectors across the scene.

### US-5: Weather Metric Dashboard and Forecast Strips
As a commuter,  
I want to read key data points clearly over the 3D canvas,  
so that I can plan my day without squinting or navigating multiple menus.

- [ ] Displays prominent current temperature, condition text, and high/low values.
- [ ] Displays secondary metrics: feels-like temperature, humidity percentage, wind speed, UV index.
- [ ] Displays a horizontal 24-hour hourly forecast strip showing time, icon/glyph, and temperature.
- [ ] Displays a 7-day forecast cards section showing weekday, condition, and min/max bars.
- [ ] Designed for WCAG AA contrast standards over dynamic canvas backgrounds via backdrop blur.

### US-6: Unit Preference and Persistence
As an international user,  
I want to toggle between Metric (°C, km/h) and Imperial (°F, mph) units,  
so that the metrics match my regional conventions.

- [ ] Global toggle button switches between °C and °F.
- [ ] Immediately converts temperatures and wind speeds across all current, hourly, and daily cards.
- [ ] Stores selected unit preference in `localStorage` under key `weather_app_unit`.
- [ ] Restores stored preference on return visits without flashing default units.

---

## 7. User Flows

### Flow 1: First Visit Geolocation Flow
```
[User Opens App]
        │
        ▼
[Check Local Storage for Last City]
   ├── Exists ─────────► [Fetch Forecast for Saved City]
   └── Does Not Exist ─► [Request Browser Geolocation]
                               │
                 ┌─────────────┴─────────────┐
                 ▼                           ▼
        [Permission Granted]        [Denied / Timeout (3s)]
                 │                           │
                 ▼                           ▼
        [Fetch via GPS Coords]      [Fetch Default City (London)]
                 │                           │
                 └─────────────┬─────────────┘
                               ▼
                   [Parse WMO & Forecast Data]
                               │
                 ┌─────────────┴─────────────┐
                 ▼                           ▼
     [Configure 3D Scene Params]    [Populate Overlay Cards]
                 │                           │
                 └─────────────┬─────────────┘
                               ▼
                    [Interactive Display Ready]
```

### Flow 2: City Search and Scene Transition Flow
```
[User Types in Search Bar] ──► [Debounce 300ms] ──► [Query Open-Meteo Geocoding]
                                                              │
                                                              ▼
                                                   [Render Result List]
                                                              │
                                                   [User Selects City]
                                                              │
                                                              ▼
                                                   [Fetch Weather Endpoint]
                                                              │
                                                              ▼
                                            [Trigger State Transition Engine]
                                                              │
                              ┌───────────────────────────────┴───────────────────────────────┐
                              ▼                                                               ▼
                 [Smoothly Lerp 3D Canvas]                                     [Update UI Overlay]
         (Sky colors, fog, sun angle, particles)                              (Current, hourly, 7-day)
```

---

## 8. Screens and Layout Breakdown

The application uses a single-page responsive viewport architecture composed of two layers:
1. **Background Layer:** Full-screen interactive WebGL canvas (`react-three-fiber`).
2. **Foreground Layer:** Accessible glassmorphism overlay container (`HTML/CSS/Tailwind`).

### Desktop Viewport Layout (>= 1024px)
- **Top Bar:** Brand title on the left, centered search bar with dropdown autocomplete, unit toggle (°C/°F) and geolocation re-center button on the right.
- **Main Left / Center Area:** Spacious view of the 3D low-poly landscape with subtle camera interaction.
- **Hero Metric Card (Bottom Left or Floating Card):** Current temperature, local time, weather condition label, feels-like, humidity, wind velocity, and UV index.
- **Hourly Forecast Strip (Bottom Center / Full Width Bottom):** Horizontally scrollable strip displaying the upcoming 24 hours.
- **Weekly Forecast Panel (Right Rail or Floating Sidebar):** Vertical list of the 7-day outlook with daily icons, condition summaries, and high/low ranges.

### Mobile Viewport Layout (< 768px)
- **Compact Top Bar:** Search trigger icon/input and unit toggle.
- **3D Canvas:** Rendered with low-poly landscape, shadows disabled, and particle counts reduced by 60% for battery efficiency.
- **Swipeable / Stacked Cards:**
  - Hero summary card displaying current conditions and immediate metrics.
  - Horizontally swipable 24-hour hourly rail.
  - Vertical accordion or compact card list for 7-day forecast.
- **Floating Controls:** Re-center button positioned within easy thumb reach.

---

## 9. Open Questions and Clarifications
1. **Default Fallback Coordinates:** We have established London (51.5074° N, 0.1278° W) as the primary fallback city when browser geolocation is denied. Confirm if an alternative default city is preferred.
2. **Search Results History:** Should recent city searches be saved to `localStorage` (e.g., up to 5 recent searches) and displayed in the search dropdown before the user types?
3. **Camera Controls Limits:** Are OrbitControls rotation limits restricted to horizontal panning only (azimuth clamped to +/- 30 degrees, elevation locked), to prevent users from clipping underneath the ground plane?

---

*End of Document 1 (docs/PRD.md). Awaiting user review and explicit approval.*
