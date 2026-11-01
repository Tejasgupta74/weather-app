# Testing Strategy and Quality Assurance Specification

## Project: 3D Weather Web App
**Status:** In Review  
**Version:** 1.0.0  
**Target Environment:** Vitest with React Testing Library  

---

## 1. Testing Layers and Scope

```
                ┌─────────────────────────┐
                │   Component Smoke Tests │  (UI Render & Search Interaction)
                ├─────────────────────────┤
                │ Integration Hook Tests  │  (useWeather, useGeocoding, Cache)
                ├─────────────────────────┤
                │   Core Unit Tests       │  (Normalizers, Math, Conversions)
                └─────────────────────────┘
```

1. **Unit Testing Layer (Highest Density):**
   - Pure utility functions: `weatherCodeMap`, `normalizeWeatherData`, `unitConversion`, and `solarPosition`.
   - In-memory cache hit, miss, and expiration logic.
2. **Integration Hook Layer:**
   - Custom React hooks: `useWeather`, `useGeocoding`, and `usePreferences`.
   - Verified with mocked fetch boundaries, timeout triggers, and abort signal handling.
3. **Component UI Smoke Layer:**
   - Overlay components: `SearchBar`, `HeroWeatherCard`, `HourlyForecastStrip`, and `DailyForecastList`.
   - Verified for accessible DOM presence, ARIA attributes, keyboard navigation, and responsive visibility.
4. **Out of Scope for Automated Unit Testing:**
   - WebGL shaders and Three.js internal render loops inside `WeatherCanvas` (validated via visual inspection).

---

## 2. Tooling and Test Harness

| Tool | Version | Purpose |
|---|---|---|
| **Vitest** | `^2.1.0` | Vite-native unit and integration test runner with instant ESM execution. |
| **@testing-library/react** | `^16.0.0` | Component DOM testing focusing on user-observable behavior. |
| **@testing-library/user-event** | `^14.5.0` | Realistic user event simulation (typing, clicking, keyboard focus). |
| **happy-dom** | `^15.7.0` | High-performance, lightweight DOM implementation for Vitest. |
| **@testing-library/jest-dom** | `^6.5.0` | Custom matchers for asserting DOM elements and states. |

---

## 3. Exact CLI Commands

| Command | Action | Execution Context |
|---|---|---|
| `npm run test` | Run complete unit and integration test suite once | Pre-commit hook & CI pipeline |
| `npm run test:watch` | Start interactive test runner watching file changes | Active local development |
| `npm run test:coverage` | Generate Istanbul/V8 code coverage report | Pull request CI gate |
| `npm run typecheck` | Run `tsc --noEmit` to validate TypeScript contracts | Pre-commit & CI gate |
| `npm run lint` | Run ESLint to verify code structure and imports | Pre-commit & CI gate |

---

## 4. What Must and Must Not Be Tested

### 4.1 What Must Be Tested (Mandatory 100% Coverage Target)
1. **Weather Code Mapping (`weatherCodeMap.ts`):**
   - Every valid WMO code (0 through 99) maps to an established semantic condition category (`clear`, `cloudy`, `fog`, `drizzle`, `rain`, `snow`, `thunderstorm`).
   - Invalid or out-of-bounds codes fallback gracefully to `clear` with zero thrown exceptions.
2. **Data Normalization (`normalizeWeatherData.ts`):**
   - Accurate parsing of raw Open-Meteo current, hourly, and daily JSON structures.
   - Resilient handling of missing, empty, or undefined numeric arrays without runtime crashes.
3. **Unit Conversion (`unitConversion.ts`):**
   - Celsius to Fahrenheit mathematical precision: `(C * 9/5) + 32`.
   - Kilometers per hour to miles per hour precision: `kmh * 0.621371`.
4. **Solar Position Calculations (`solarPosition.ts`):**
   - Correct elevation angle and daylight boolean when local time is between sunrise and sunset.
   - Inversion handling for southern hemisphere coordinates.
5. **Caching Mechanics (`cache.ts` / `useWeather.ts`):**
   - Cache hit returns cached object without issuing secondary fetch.
   - Cache miss fetches from network and populates cache.
   - Expired cache entries (> 300,000ms) trigger refetch.
6. **Search Input & Debounce (`useGeocoding.ts`):**
   - 300ms debounce prevents intermediate queries during typing.
   - Queries shorter than 2 characters emit empty suggestions without network calls.

### 4.2 What Must NOT Be Tested
1. **WebGL Canvas Internal Shaders:** Do not attempt to mock Three.js WebGL contexts, glMatrix uniforms, or shader compile stages in Vitest.
2. **Third-Party Library Internals:** Do not test whether Framer Motion translates coordinates or whether Tailwind generates CSS classes.
3. **Browser Native APIs:** Do not test browser-level implementation of `localStorage` or `fetch` beyond mocking their return interfaces.

---

## 5. Test File Conventions and Structure

- **Location:** Co-located next to implementation files using the `.test.ts` or `.test.tsx` extension.
  - Implementation: `src/utils/weatherCodeMap.ts`
  - Test File: `src/utils/weatherCodeMap.test.ts`
- **Pattern:** Strict Arrange, Act, Assert (AAA) structure.
- **Naming:** Semantic test blocks stating expected outcome:
  ```typescript
  describe('weatherCodeMap', () => {
    it('returns rain condition for WMO code 61', () => {
      // Arrange
      const code = 61;

      // Act
      const result = weatherCodeMap(code);

      // Assert
      expect(result.category).toBe('rain');
    });
  });
  ```

---

## 6. Test Data Strategies and Mock Fixtures

### 6.1 Static Fixtures (`src/test/fixtures/`)
- `mockCurrentWeather.json`: Complete Open-Meteo current weather payload.
- `mockHourlyForecast.json`: 24-element hourly arrays for temperature, weather codes, and precipitation.
- `mockDailyForecast.json`: 7-element daily arrays for min/max temperatures, sunrise, and sunset times.
- `mockGeocodingResults.json`: Multi-city search result payload for autocomplete verification.

### 6.2 Deterministic Mocking
- Global `fetch` is mocked using `vi.spyOn(global, 'fetch')` or Vitest test hooks.
- Mock timers (`vi.useFakeTimers()`) are used to verify 300ms debounce delays and 5-minute cache TTL expirations without real-world waiting.

---

## 7. Continuous Integration (CI) Pipeline

GitHub Actions configuration (`.github/workflows/ci.yml`) enforces the following sequential pipeline on every push and pull request:

```yaml
name: CI Quality Gate

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Verify TypeScript Contracts
        run: npm run typecheck

      - name: Lint Codebase
        run: npm run lint

      - name: Run Test Suite with Coverage
        run: npm run test:coverage

      - name: Build Production Assets
        run: npm run build
```

---

## 8. Definition of Done (DoD)

A task or pull request is strictly marked complete only when all criteria below are verified:
1. **Acceptance Criteria Satisfied:** Every checkbox item defined in the PRD user story is functional.
2. **Automated Verification Clean:**
   - `npm run typecheck` passes with zero TypeScript diagnostics.
   - `npm run lint` passes with zero errors or warnings.
   - `npm run test` passes 100% of unit and integration test assertions.
   - Code coverage on `src/utils/` and `src/hooks/` exceeds 85%.
3. **Zero Allocation in Render Loops:** Confirmed via code review that no objects or arrays are created in `useFrame`.
4. **Anti-Vibe-Coding Compliance:**
   - Zero purple or violet gradients.
   - Zero rounded-full pill buttons (standard rectangular radii only).
   - Zero raw emoji icons (100% Lucide SVGs).
   - Zero em dashes anywhere in code, comments, or documentation.
5. **Responsive Performance:** Stable 60 FPS on desktop; 30+ FPS on simulated mobile viewports with shadows disabled.

---

*End of Document 7 (docs/TESTING.md). Awaiting user review and explicit approval.*
