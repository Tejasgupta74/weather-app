# Weather App

Interactive weather web application connecting Open-Meteo forecasts with a low-poly 3D WebGL scene and a frosted glass dashboard. Built with React, Vite, Three.js (`@react-three/fiber` and `@react-three/drei`), and Tailwind CSS.

---

## Features

### Weather Data Integration
- **Open-Meteo API:** Retrieves current conditions, 24-hour hourly forecast, and 7-day daily forecast without API keys.
- **WMO Code Normalization:** Maps World Meteorological Organization weather codes to standard categories (clear, cloudy, fog, drizzle, rain, snow, thunderstorm).
- **Client-Side Caching:** In-memory 5-minute cache with coordinate keying to avoid redundant network requests.
- **Geolocation and City Search:** Browser GPS detection with search autocomplete for global cities.
- **Unit Preferences:** Celsius and Fahrenheit toggle persisted in localStorage.

### Glassmorphic IoT Dashboard
- **Translucent Chassis:** Frosted glass interface with dynamic ambient lighting that adapts to the current weather condition and solar cycle.
- **Current Conditions:** Large temperature display, condition description, and daily high/low range.
- **Hourly Timeline:** 24-hour horizontal forecast strip with hourly temperatures and precipitation probability.
- **7-Day Forecast:** Weekly outlook with high and low temperatures.
- **Live Metrics:** Humidity, wind speed, barometric pressure, and live trend indicators.
- **Wind Map:** Wind direction and velocity radar card.
- **Recently Searched:** Quick-access list of previously viewed locations.
- **Accessibility:** Designed for AA contrast with keyboard-navigable search.

### 3D Environmental Scene
- **Low-Poly Landscape:** Procedural terrain with low-poly house, pine trees, and rocks.
- **Solar and Lunar Cycle:** Sun and moon positions calculated from sunrise and sunset times, smoothly transitioning between day and night lighting.
- **Rain Particles:** Up to 1,500 raindrops via `THREE.InstancedMesh` scaled by precipitation rate.
- **Snow Particles:** 800 snowflakes via `THREE.InstancedMesh` reacting to wind vectors.
- **Dynamic Clouds:** Low-poly cloud layers adjusting opacity and speed based on cloud cover and wind speed.
- **Atmospheric Fog:** Exponential fog adjusting density based on visibility and precipitation.
- **Lightning System:** Directional light pulses during active thunderstorms.
- **Zero-Allocation Render Loop:** Scratch vectors and matrices pre-allocated outside `useFrame` to eliminate per-frame garbage collection.

---

## Setup and Development

### Prerequisites
- Node.js 20+ (recommended: Node.js 22+)
- npm 10+

### Installation
```bash
git clone https://github.com/Tejasgupta74/weather-app.git
cd weather-app
npm install
```

### Development Server
```bash
npm run dev
```
Starts the local development server at `http://localhost:5100`.

### Production Build
```bash
npm run build
```
Compiles and optimizes static assets to the `/dist` directory.

### Testing and Verification
```bash
npm run test          # Execute Vitest unit test suites
npm run test:watch    # Interactive test watch mode
npm run typecheck     # Verify strict TypeScript compiler contracts (tsc --noEmit)
npm run lint          # Run ESLint validation
```

---

## Architecture and Project Structure

```
weather-app/
├── docs/                      # 8 pre-code planning specifications
│   ├── PRD.md                 # Product requirements document
│   ├── DESIGN_SYSTEM.md       # Color tokens, typography, radii, accessibility
│   ├── ARCHITECTURE.md        # Stack rationale, request flow, ADRs
│   ├── DATABASE.md            # Storage schemas, localStorage, in-memory cache
│   ├── SECURITY.md            # Data classification, sanitization, OWASP checklist
│   ├── CODE_STYLE.md          # Naming, size limits, conciseness rules
│   └── TESTING.md             # Testing layers, commands, definition of done
├── public/                    # Favicon, privacy policy, terms and conditions
├── src/
│   ├── components/
│   │   ├── dashboard/         # Glassmorphic IoT dashboard components
│   │   ├── scene/             # WebGL / React Three Fiber components
│   │   └── ui/                # Shared UI controls and icons
│   ├── constants/             # Configuration, URLs, fallback city
│   ├── hooks/                 # useWeather, useGeolocation, useGeocoding, usePreferences
│   ├── types/                 # TypeScript interfaces for weather and scene
│   └── utils/                 # weatherCodeMap, unitConversion, solarPosition, cache
├── AGENTS.md                  # Autonomous agent operating instructions
└── README.md                  # Project overview and setup instructions
```

---

## License
MIT
