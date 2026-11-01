# Code Style and Architectural Guidelines

## Project: 3D Weather Web App
**Status:** In Review  
**Version:** 1.0.0  
**Scope:** Semantic rules, patterns, and constraints beyond automated linter capabilities  

---

## 1. Scope and Automated Tooling Boundary
Standard formatting rules (indentation width, semicolon placement, quotes, and line wrapping) are automatically handled by Prettier and ESLint. This document governs semantic naming, component decomposition, memory management, Three.js patterns, error handling, and Git conventions that static linters cannot verify.

---

## 2. Semantic Naming Conventions

### 2.1 Variables and Booleans
- **Boolean Variables:** Must always begin with an auxiliary verb (`is`, `has`, `should`, `can`). Never use bare nouns or ambiguous adjectives.
  - Good: `isDaylight`, `hasPrecipitation`, `isLoading`, `canOrbit`
  - Bad: `day`, `rain`, `loadingState`, `orbit`
- **Constants:** Truly immutable global values (such as cache timeouts or coordinate limits) must use `UPPER_SNAKE_CASE`.
  - Good: `CACHE_TTL_MS`, `DEFAULT_FALLBACK_CITY`, `MAX_HOURLY_ITEMS`
  - Bad: `cacheTtl`, `defaultCity`, `MaxHourly`
- **3D Object References:** Three.js references held in React `useRef` must carry the suffix `Ref` describing the exact geometry or mesh.
  - Good: `landscapeGroupRef`, `rainInstancedMeshRef`, `sunLightRef`
  - Bad: `landscape`, `rain`, `sunMesh`

### 2.2 Files and Directories
- **React Components:** PascalCase matching the default export name (`LowPolyLandscape.tsx`, `HeroWeatherCard.tsx`).
- **Custom Hooks:** camelCase prefixed with `use` (`useWeather.ts`, `useGeocoding.ts`).
- **Pure Utilities:** camelCase indicating domain or primary responsibility (`weatherCodeMap.ts`, `solarPosition.ts`).
- **TypeScript Type Definitions:** camelCase domain name (`weather.ts`, `scene.ts`).

---

## 3. File and Component Size Limits

| Structural Unit | Hard Ceiling | Corrective Action |
|---|---|---|
| **File Length** | 250 lines of code | Extract sub-components, move pure math to `src/utils/`, or extract custom hooks. |
| **Component Body** | 60 lines of code | Split UI presentation logic from state orchestration. |
| **Hook Return Values** | 2+ properties | Return a typed object, never a positional tuple (except for simple `[value, setter]` pairs). |
| **Render Hook Nesting** | Max 3 custom hooks per component | Extract a domain orchestrator hook to encapsulate child hooks. |

---

## 4. Architectural Patterns with Concrete Examples

### 4.1 Pattern 1: Zero-Allocation 3D Render Loops (`useFrame`)
Inside Three.js render loops, allocating new objects triggers garbage collection spikes and micro-stutters. All scratch objects (vectors, matrices, quaternions, colors) must be allocated once and mutated in place.

```typescript
// BAD: Allocates a new Vector3 on every single frame (60 allocations per second)
useFrame((state) => {
  const target = new THREE.Vector3(state.pointer.x * 2, state.pointer.y * 2, 5);
  camera.position.lerp(target, 0.05);
});

// GOOD: Reuses a single pre-allocated scratch vector across all frames
const scratchVector = new THREE.Vector3();

export function ParallaxCameraRig() {
  useFrame((state) => {
    scratchVector.set(state.pointer.x * 1.5, state.pointer.y * 1.5, 6);
    state.camera.position.lerp(scratchVector, 0.04);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}
```

### 4.2 Pattern 2: Normalization at the Network Boundary
Raw API payloads must never propagate directly into UI components or 3D scene elements. Data must be validated and transformed into clean domain interfaces immediately upon receipt.

```typescript
// BAD: Exposing raw nested API structures deep in UI presentation cards
function CurrentTemp({ payload }: { payload: any }) {
  return <span>{payload.current.temperature_2m} °C</span>;
}

// GOOD: Transforming raw structures into a flat, typed domain model
export function normalizeWeatherData(raw: OpenMeteoRawResponse): NormalizedWeather {
  return {
    current: {
      temperature: Math.round(raw.current.temperature_2m),
      apparentTemperature: Math.round(raw.current.apparent_temperature),
      humidity: raw.current.relative_humidity_2m,
      windSpeed: Math.round(raw.current.wind_speed_10m),
      windDirection: raw.current.wind_direction_10m,
      uvIndex: raw.current.uv_index,
      condition: weatherCodeMap(raw.current.weather_code),
      isDay: Boolean(raw.current.is_day)
    },
    // hourly and daily arrays normalized similarly...
  };
}
```

### 4.3 Pattern 3: Abortable Asynchronous Hook Requests
All external network requests initiated by React effects must support abort signals to prevent state updates on unmounted components or stale search queries.

```typescript
// GOOD: Cleaning up network calls when query dependencies change
useEffect(() => {
  if (query.trim().length < 2) return;

  const controller = new AbortController();

  async function executeSearch() {
    try {
      const results = await fetchCitySuggestions(query, controller.signal);
      setSuggestions(results);
    } catch (err: unknown) {
      if ((err as Error).name !== 'AbortError') {
        setError('Failed to fetch location suggestions.');
      }
    }
  }

  executeSearch();
  return () => controller.abort();
}, [query]);
```

---

## 5. Anti-Patterns to Strictly Avoid

1. **Direct DOM or Scene State Cross-Pollination:**
   - Never query or mutate the Three.js scene graph from standard DOM event handlers (e.g. `document.getElementById` or global window variables).
   - Communicate strictly via React props, state hooks, or context dispatchers.
2. **Derived State Duplication in `useState`:**
   - Never store derived data (such as converted Fahrenheit values or filtered hourly lists) in separate state variables. Compute them on the fly or wrap in `useMemo`.
3. **Magic Meteorological Numbers:**
   - Never scatter raw WMO integer codes (such as `61` or `95`) across presentation templates. Always reference central condition enums from `weatherCodes.ts`.
4. **Per-Component Unit Conversion Logic:**
   - Never write inline mathematical conversions (`temp * 9/5 + 32`) in presentation components. Use centralized utility functions from `src/utils/unitConversion.ts`.

---

## 6. Error Handling Standards

1. **Structured Result Types:** Asynchronous custom hooks must return explicit, typed status flags:
   ```typescript
   interface UseWeatherResult {
     weather: NormalizedWeather | null;
     isLoading: boolean;
     isError: boolean;
     errorMessage: string | null;
     refetch: () => Promise<void>;
   }
   ```
2. **Never Swallow Exceptions Silently:** Empty `catch` blocks are strictly forbidden. If an error is non-fatal, log it via an internal diagnostic logger and assign a fallback state.
3. **Explicit Request Timeouts:** External API calls must incorporate an explicit 8-second timeout using `AbortSignal.timeout(8000)`.

---

## 7. Commenting Philosophy
- **Prohibited Comments:** Do not write comments that narrate what the code visibly does.
  - Bad: `// increment count by 1`
  - Bad: `// render button element`
- **Mandatory Comments:**
  - Complex mathematical formulas (such as solar elevation or spherical coordinates calculations).
  - Stride, attribute count, and matrix offset calculations for Three.js instanced buffers.
  - Non-obvious browser workarounds or performance compensation hacks.

---

## 8. Code Conciseness Rules and Readability Limits

### 8.1 Conciseness Rules
- **One-Line Parity:** If one line can accomplish the same task as multiple lines with identical behavior, write the single line.
- **Native Methods Over Loops:** Always prefer built-in standard library utilities over hand-written imperative loops (`map`, `filter`, `find`, `some`, `every`, `Object.entries`, optional chaining, nullish coalescing, and object destructuring).
- **Zero Single-Use Boilerplate:** Do not create helper functions, variables, or wrappers that are called only once and add no clarity.
- **Zero Speculative Abstractions:** Do not write abstractions, extra configuration flags, or error branches for scenarios that cannot physically happen.
- **Immediate Dead Code Removal:** Delete unused imports and dead code immediately. Never leave commented-out code blocks in the repository.

### 8.2 Readability Limits
- **Ternary Depth:** Maximum one level of ternary. Nested ternaries are strictly banned.
- **Complex One-Liners:** Avoid chained reduce calls or complex regex one-liners that require explanatory comments to decipher.
- **Line Length Threshold:** If a line extends past roughly 100 characters or requires a second read to understand, split it cleanly across multiple lines.
- **Uncompromised Safety:** Never shorten error handling, input validation, or security boundary checks to save lines.
- **Behavioral Equivalence:** Output, edge cases, and type safety must never be compromised simply to shorten a code block.

---

## 9. Git Commit and Pull Request Conventions

### 8.1 Commit Message Format
All commits must follow the Conventional Commits specification:
```
<type>(<scope>): <short imperative description>
```
- **Allowed Types:** `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `chore`.
- **Allowed Scopes:** `scene`, `ui`, `data`, `types`, `config`.
- **Rules:**
  - Maximum 72 characters on the subject line.
  - Written in lowercase imperative mood ("add rain instanced buffer", not "added" or "adds").
  - No trailing period.
  - Strictly no em dashes anywhere in commit messages or pull request descriptions.

### 8.2 Pull Request Standards
- PR titles must mirror the primary Conventional Commit subject line.
- Each PR must reference its target user story or architectural decision record.
- Every PR must verify:
  1. TypeScript compilation passes with zero errors (`tsc --noEmit`).
  2. Lint checks pass (`npm run lint`).
  3. No visual regression in 3D canvas or glassmorphic overlay.

---

*End of Document 6 (docs/CODE_STYLE.md). Awaiting user review and explicit approval.*
