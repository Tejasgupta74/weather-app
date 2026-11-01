# 3D Weather Web Application

An interactive 3D meteorological web application connecting real-time Open-Meteo forecasts with a reactive low-poly WebGL landscape. Built with React, Vite, Three.js (`@react-three/fiber` and `@react-three/drei`), Tailwind CSS, and Framer Motion.

---

## Features

### Meteorological Data Layer
- **Open-Meteo REST Integration:** Ingests current conditions, 24-hour hourly timeline, and 7-day daily forecasts without API keys.
- **WMO Code Mapping:** Normalizes 100 World Meteorological Organization condition codes into established categories (clear, cloudy, fog, drizzle, rain, snow, thunderstorm).
- **In-Memory Caching:** 5-minute client-side cache prevents duplicate queries and respects server capacity.
- **Geolocation & Search:** Browser GPS auto-detection with fallback to London, plus debounced city autocomplete.
- **Unit Preferences:** Celsius / Fahrenheit toggle with localStorage persistence.

### 3D Environmental Scene
- **Low-Poly Diorama:** Procedural rolling hills, low-poly pine trees, cozy architectural house, and rocky outcrops.
- **Solar & Lunar Cycle:** Sun and moon positions calculated from sunrise and sunset times; sky color and ambient lighting smoothly crossfade between day and night.
- **Instanced Rain Particles:** Up to 1,500 raindrops moving simultaneously via `THREE.InstancedMesh` with density and speed scaled by precipitation rates.
- **Instanced Snow Particles:** 800 soft snowflakes drifting with realistic wind sway.
- **Dynamic Cloud Layers:** Procedural low-poly cloud meshes whose opacity and drift velocity adjust based on cloud cover percentage and wind vectors.
- **Scene Fog Controller:** Atmospheric exponential fog reacts to mist and precipitation severity.
- **Thunderstorm Strobe:** Realistic multi-stage lightning pulses that illuminate the landscape during storms.
- **Zero-Allocation Rendering:** Scratch vectors and matrices pre-allocated outside `useFrame` to guarantee zero per-frame garbage collection stutter.
- **Gentle Interaction:** Clamped OrbitControls and dampened camera parallax following cursor movement.

### Glassmorphic Dashboard Overlay
- **Hero Card:** Current temperature, weather condition description, feels-like temperature, and daily high/low range.
- **Metrics Grid:** Humidity, wind speed with cardinal direction, UV index, and cloud cover.
- **24-Hour Hourly Strip:** Horizontally scrollable timeline showing upcoming temperatures and precipitation amounts.
- **7-Day Forecast:** Daily outlook with high/low temperature range visualizations.
- **Accessibility:** WCAG 2.1 AA compliant text contrast and keyboard-navigable search.

---

## Setup and Development

### Prerequisites
- Node.js 20+ (recommended: Node.js 22+)
- npm 10+

### Installation
```bash
git clone <repository-url>
cd "wheather app"
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

### Testing and Quality Gates
```bash
npm run test          # Execute Vitest unit and integration tests
npm run test:watch    # Interactive test watch mode
npm run typecheck     # Verify strict TypeScript compiler contracts (tsc --noEmit)
npm run lint          # Run ESLint validation
```

---

## Architecture and Project Structure

```
wheather app/
├── docs/                      # 8 pre-code planning specifications
│   ├── PRD.md                 # Product requirements document
│   ├── DESIGN_SYSTEM.md       # Color tokens, typography, radii, accessibility
│   ├── ARCHITECTURE.md        # Stack rationale, request flow, ADRs
│   ├── DATABASE.md            # Storage schemas, indexes, RLS policies
│   ├── SECURITY.md            # Data classification, sanitization, OWASP checklist
│   ├── CODE_STYLE.md          # Naming, size limits, conciseness rules
│   └── TESTING.md             # Testing layers, commands, definition of done
├── public/                    # Favicon, privacy policy, terms and conditions
├── src/
│   ├── components/
│   │   ├── scene/             # WebGL / React Three Fiber components
│   │   └── ui/                # Glassmorphic DOM dashboard overlay
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
