# Agent Operating Guidelines

## Project Summary
Interactive 3D weather web application built with React, Vite, Three.js via `@react-three/fiber` and `@react-three/drei`, Tailwind CSS, and Framer Motion. Powered by the keyless Open-Meteo forecast and geocoding APIs. Features a low-poly landscape reacting to real-time weather metrics (day/night solar cycle, rain, snow, clouds, fog, lightning, wind drift) with an accessible glassmorphic dashboard overlay.

---

## Exact CLI Commands

```bash
npm run dev           # Start local Vite development server at http://localhost:5100
npm run build         # Compile and optimize production distribution to /dist
npm run typecheck     # Run strict TypeScript compiler verification (tsc --noEmit)
npm run lint          # Run ESLint validation across all source files
npm run test          # Execute Vitest unit and integration test suites once
npm run test:watch    # Run Vitest in interactive watch mode
npm run test:coverage # Generate code coverage report
```

---

## Documentation Routing Table

Read the corresponding specification document before beginning any modification:

| Task Type | Required Document to Read First | Target Source Paths |
|---|---|---|
| New feature, scope, or user story | [PRD](file:///d:/wheather%20app/docs/PRD.md) | `src/types/`, `src/constants/` |
| UI components, colors, typography, or styling | [Design System](file:///d:/wheather%20app/docs/DESIGN_SYSTEM.md) | `src/components/ui/`, `tailwind.config.js` |
| 3D scene, lighting, shaders, or particles | [Architecture](file:///d:/wheather%20app/docs/ARCHITECTURE.md) | `src/components/scene/` |
| Caching, localStorage, or database schemas | [Database](file:///d:/wheather%20app/docs/DATABASE.md) | `src/utils/cache.ts`, `src/hooks/` |
| Geolocation, input validation, or headers | [Security](file:///d:/wheather%20app/docs/SECURITY.md) | `src/hooks/useGeocoding.ts`, `index.html` |
| Refactoring, hook patterns, or conciseness | [Code Style](file:///d:/wheather%20app/docs/CODE_STYLE.md) | `src/utils/`, `src/hooks/` |
| Writing tests, test data, or CI quality gates | [Testing](file:///d:/wheather%20app/docs/TESTING.md) | `src/**/*.test.ts`, `src/**/*.test.tsx` |

---

## Hard Architectural Constraints

1. **Anti-Vibe-Coding Protocol:**
   - Zero purple or violet gradients; use clean slates, navy, or solid semantic accents.
   - Zero pill-shaped (`rounded-full`) buttons; use structured rectangular shapes (4px to 8px radius).
   - Zero raw emoji icons; use SVG glyphs from Lucide React exclusively.
   - Strictly no em dashes anywhere in user-facing copy, headers, comments, or documentation.
2. **Three.js Performance:**
   - Zero object allocations (`new THREE.Vector3()`, `new THREE.Color()`) inside `useFrame`. Pre-allocate scratch objects via `useRef`.
   - Use `THREE.InstancedMesh` with pre-allocated matrix buffers for all particle systems (rain, snow).
3. **Layer Separation:**
   - `src/components/scene/` must contain WebGL / R3F components only. Never emit standard HTML tags.
   - `src/components/ui/` must contain DOM elements only. Never manipulate Three.js scene graphs directly.
4. **Code Conciseness Rules:**
   - Prefer native standard methods (`map`, `filter`, optional chaining, destructuring) over imperative loops.
   - Maximum one level of ternary. No nested ternaries.
   - Delete dead code and unused imports immediately.

---

## Autonomous Agent Execution Workflow

1. **Consult:** Read the relevant specification document from the routing table above before writing code.
2. **Implement:** Write minimal, concise, type-safe code that fulfills the requirement without speculative bloat.
3. **Verify:** Execute `npm run typecheck`, `npm run lint`, and `npm run test` after every meaningful change.
4. **Commit:** Structure commits following Conventional Commits format (`feat:`, `fix:`, `perf:`), under 72 characters, with zero em dashes.
