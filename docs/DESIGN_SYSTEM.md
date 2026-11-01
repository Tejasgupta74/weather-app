# Design System Specification

## Project: 3D Weather Web App
**Status:** In Review  
**Version:** 1.0.0  
**Target Environment:** Web (Desktop, Tablet, Mobile)  

---

## 1. Core Principles
1. **Atmospheric Immersion with Uncompromised Legibility:** The 3D scene provides physical atmospheric context, while the UI overlay delivers crisp, immediate metrics. UI elements use backdrop blurs and calibrated slate overlays to guarantee contrast over any sky or ground condition.
2. **Zero "Vibe-Coded" SaaS Tropes:** Strictly no purple or violet gradients, no glowing neon meshes, no pill-shaped capsule buttons, no raw emoji icons, and no decorative scroll-jacking.
3. **Structured Geometry:** Interfaces use structured rectangular cards with controlled corner radii (4px to 10px) and 1px crisp borders.
4. **Motion with Restraint:** Canvas motion (camera orbit, particle sway, lightning pulses) operates between 150ms and 250ms or steady-state physical velocities. All motion respects `prefers-reduced-motion`.

---

## 2. Colour Tokens

### 2.1 Dark Mode Palette (Primary Canvas Environment)
Dark mode is the baseline theme for night conditions, overcast weather, and low-light ambient scenes.

| Token Name | Hex Code | Usage |
|---|---|---|
| `bg-canvas-dark` | `#0B0F17` | Base canvas clear color and fallback dark background |
| `surface-glass-dark` | `rgba(15, 23, 42, 0.72)` | Frosted glass card fill (Slate 900 at 72% opacity) |
| `surface-elevated-dark` | `rgba(30, 41, 59, 0.85)` | Elevated menus, search dropdown, active modal sheets |
| `border-glass-dark` | `rgba(255, 255, 255, 0.12)` | 1px border stroke for dark glass cards |
| `border-active-dark` | `rgba(255, 255, 255, 0.28)` | Focus rings and active card borders |
| `text-primary-dark` | `#F8FAFC` | Primary metrics, headings, location titles (Slate 50) |
| `text-secondary-dark` | `#94A3B8` | Labels, timestamps, units, condition descriptors (Slate 400) |
| `text-muted-dark` | `#64748B` | Subtle metadata, min/max secondary values (Slate 500) |

### 2.2 Light Mode Palette (Bright Daylight Scenes)
Used when daylight intensity creates bright sky backgrounds.

| Token Name | Hex Code | Usage |
|---|---|---|
| `bg-canvas-light` | `#F1F5F9` | Base daylight fallback canvas background (Slate 100) |
| `surface-glass-light` | `rgba(255, 255, 255, 0.78)` | Frosted glass card fill with high white opacity |
| `surface-elevated-light` | `rgba(248, 250, 252, 0.94)` | Dropdown search menus and elevated selectors |
| `border-glass-light` | `rgba(15, 23, 42, 0.12)` | 1px border stroke for light glass cards |
| `border-active-light` | `rgba(15, 23, 42, 0.28)` | Focus borders and active tabs |
| `text-primary-light` | `#0F172A` | Primary temperature text, headers (Slate 900) |
| `text-secondary-light` | `#475569` | Metric labels, secondary metrics (Slate 600) |
| `text-muted-light` | `#64748B` | Timestamp subheaders, disabled indicators (Slate 500) |

### 2.3 Semantic Atmospheric Accents
These accents are strictly functional and derived from atmospheric conditions. Never used as decorative gradient fills.

| Token Name | Hex Code | Semantic Role |
|---|---|---|
| `accent-sun` | `#EAB308` | Clear daylight, high UV index, solar markers (Amber 500) |
| `accent-rain` | `#38BDF8` | Precipitation indicators, rain hourly bars (Sky 400) |
| `accent-snow` | `#E2E8F0` | Snowfall indicators, freezing temperature tags (Slate 200) |
| `accent-wind` | `#34D399` | Wind vectors, gale indicators (Emerald 400) |
| `accent-storm` | `#F59E0B` | Severe alerts, lightning flash peaks (Amber 500) |
| `accent-error` | `#EF4444` | Geolocation failure, API timeout notice (Red 500) |
| `accent-focus` | `#38BDF8` | Accessible keyboard focus outline (Sky 400) |

---

## 3. Typography Scale

### 3.1 Font Families
- **Display and Body Font:** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `Roboto`, `sans-serif`. Clean, high-legibility geometric sans.
- **Numeric & Telemetry Font:** `JetBrains Mono`, `"SF Mono"`, `Menlo`, `Consolas`, `monospace`. Tabular figures for coordinates, temperatures, and wind velocity readings.

### 3.2 Type Scale Specifications

| Level | Size (px / rem) | Line Height | Weight | Tracking | Usage |
|---|---|---|---|---|---|
| **Display** | 64px / 4.0rem | 1.0 (64px) | 700 (Bold) | -0.03em | Primary current temperature reading |
| **Heading 1** | 28px / 1.75rem | 1.2 (34px) | 600 (Semibold) | -0.02em | City name, major modal titles |
| **Heading 2** | 20px / 1.25rem | 1.3 (26px) | 600 (Semibold) | -0.01em | Section headers (Hourly, 7-Day Forecast) |
| **Heading 3** | 16px / 1.0rem | 1.4 (22px) | 500 (Medium) | 0.0em | Metric card titles (Wind, Humidity, UV) |
| **Body Large**| 16px / 1.0rem | 1.5 (24px) | 400 (Regular) | 0.0em | Primary condition text (e.g. Moderate Rain) |
| **Body Small**| 14px / 0.875rem| 1.4 (20px) | 400 (Regular) | 0.0em | Hourly forecast labels, search items |
| **Caption**   | 12px / 0.75rem | 1.3 (16px) | 500 (Medium) | +0.02em | Coordinate badges, timestamp indicators |

---

## 4. Spacing Scale
Built on a strict 4px grid.

| Token | Size (px) | Size (rem) | Usage |
|---|---|---|---|
| `space-1` | 4px | 0.25rem | Icon gaps, compact badge padding |
| `space-2` | 8px | 0.50rem | Button internal vertical padding, list item gap |
| `space-3` | 12px | 0.75rem | Horizontal button padding, hourly card inner gap |
| `space-4` | 16px | 1.00rem | Card internal padding, grid column gaps |
| `space-6` | 24px | 1.50rem | Section spacing, overlay margins |
| `space-8` | 32px | 2.00rem | Top navigation bar height padding |
| `space-12`| 48px | 3.00rem | Desktop viewport edges margin |

---

## 5. Border Radius & Shadows

### 5.1 Border Radius Tokens
In adherence to the anti-vibe-coding standard, `rounded-full` (capsule pill) buttons are prohibited.

| Token | Value | Applied To |
|---|---|---|
| `radius-none` | 0px | Crisp telemetry markers |
| `radius-sm` | 4px | Badges, unit toggle segments, tooltip containers |
| `radius-md` | 6px | Buttons, input fields, dropdown search items |
| `radius-lg` | 8px | Hourly forecast individual cards, quick metric boxes |
| `radius-xl` | 10px | Primary hero card, 7-day forecast container panel |

### 5.2 Elevation and Backdrop Filters
Cards float over the 3D canvas and rely on backdrop filters rather than heavy drop shadows.

- **Standard Card Elevation:**
  - `backdrop-filter: blur(16px) saturate(180%)`
  - `box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.35)`
  - `border: 1px solid var(--border-glass)`
- **Hover Card Elevation:**
  - `backdrop-filter: blur(20px) saturate(190%)`
  - `box-shadow: 0 8px 28px -4px rgba(0, 0, 0, 0.45)`
  - `border: 1px solid var(--border-active)`
- **Dropdown Menu Elevation:**
  - `backdrop-filter: blur(24px) saturate(200%)`
  - `box-shadow: 0 12px 36px 0 rgba(0, 0, 0, 0.55)`

---

## 6. Components and Interactive States

### 6.1 Buttons and Segmented Controls (Unit Toggle)
- **Shape:** Rectangular with `radius-md` (6px) or `radius-sm` (4px).
- **Default State:** Semi-transparent background `rgba(30, 41, 59, 0.60)`, 1px border `rgba(255, 255, 255, 0.12)`, text `text-secondary`.
- **Hover State:** Background `rgba(51, 65, 85, 0.80)`, border `rgba(255, 255, 255, 0.24)`, text `text-primary`. Transition duration: 150ms.
- **Active / Pressed State:** Scale transform `scale(0.98)`, background `rgba(15, 23, 42, 0.90)`.
- **Focus Visible State:** 2px solid outline in `#38BDF8` with a 2px offset.
- **Disabled State:** Opacity 0.40, cursor `not-allowed`, pointer-events none.

### 6.2 Search Input and Autocomplete
- **Container:** Rectangular input with `radius-md` (6px). Height: 40px.
- **States:**
  - *Default:* Border `rgba(255, 255, 255, 0.16)`, background `rgba(15, 23, 42, 0.65)`.
  - *Focus:* Border `#38BDF8`, background `rgba(15, 23, 42, 0.85)`, box-shadow ring 1px `#38BDF8`.
  - *Loading:* Displays compact SVG spinner on right rail (16px diameter).
- **Autocomplete Dropdown Panel:**
  - Anchored directly below input with 4px gap.
  - Background `rgba(15, 23, 42, 0.95)`, border `1px solid rgba(255, 255, 255, 0.14)`.
  - Items: 36px height, `radius-sm` (4px), hover/focus background `rgba(51, 65, 85, 0.70)`.

### 6.3 Hero Weather Card
- **Structure:** Left column with location title, local time, and primary temperature. Right column with current condition summary, feels-like temperature, and high/low values.
- **Padding:** 20px desktop, 16px mobile.
- **Background:** `surface-glass-dark` with `backdrop-filter: blur(16px)`.

### 6.4 Hourly Forecast Strip
- **Layout:** Horizontal flex rail with scroll snap (`snap-x mandatory`).
- **Cards:** Width 64px, vertical layout (Time, SVG weather icon, Temperature, Rain Probability bar).
- **Active / Current Hour:** Highlighted with subtle 1px border `#38BDF8` and slightly brighter background.

### 6.5 7-Day Forecast Grid / List
- **Layout:** Vertical row items (Day name, condition SVG icon, min temp, temperature range bar, max temp).
- **Row Hover:** Subtle background lighten `rgba(255, 255, 255, 0.04)`, transition 150ms.

---

## 7. Iconography Standards
- **Zero Raw Emojis:** Strictly prohibited as icons or section labels.
- **Icon Library:** Lucide React or standard Heroicons SVG icons.
- **Render Specifications:** 
  - Stroke width: 1.75px.
  - Size variants: 16px (small metric indicators), 20px (action buttons, search), 24px (hero weather condition indicators).
  - Fill: `none`, stroke: `currentColor`.
- **Weather Condition Glyphs:**
  - Clear Day: `Sun`
  - Clear Night: `Moon`
  - Cloudy / Overcast: `Cloud`
  - Fog / Mist: `CloudFog`
  - Drizzle / Rain: `CloudRain`
  - Snow: `CloudSnow`
  - Thunderstorm: `CloudLightning`

---

## 8. Responsive Breakpoints

| Breakpoint | Width Range | Layout Behavior |
|---|---|---|
| **Mobile (`sm`)** | 0px to 639px | Single column overlay, stacked cards, top bar compact search, reduced 3D particle count by 60%, shadows disabled on canvas |
| **Tablet (`md`)** | 640px to 1023px | Dual card horizontal layout, search bar expands to 320px, medium particle density |
| **Desktop (`lg`)** | 1024px to 1439px | Multi-column overlay layout with fixed left hero panel and floating bottom hourly rail, full shadow maps enabled |
| **Wide Desktop (`xl`)** | 1440px+ | Side-docked weather telemetry rail, expansive central 3D viewport, 100% particle fidelity |

---

## 9. Accessibility Specifications (WCAG 2.1 AA)
1. **Contrast Ratios:**
   - All text rendered over glassmorphic overlays maintains a minimum 4.5:1 contrast ratio against the blurred background.
   - Large display temperature figures (64px) maintain at least 3.0:1 contrast ratio.
2. **Keyboard Navigation:**
   - Full keyboard focus ring on all interactive components (`search-input`, `unit-toggle`, `forecast-item`, `recenter-button`).
   - Arrow keys navigate search autocomplete options; `Escape` dismisses the dropdown.
3. **Screen Reader Support:**
   - Dynamic weather status wrapped in `aria-live="polite"` region.
   - Unit toggle buttons include explicit `aria-label="Switch to Fahrenheit"` and `aria-pressed` states.
   - SVG icons include `aria-hidden="true"` accompanied by screen-reader-only labels (`sr-only`).
4. **Motion Preference:**
   - Detects `prefers-reduced-motion: reduce`.
   - Disables camera parallax on mouse movement.
   - Reduces particle sway and disables lightning scene flashes, substituting a subtle static brightness shift.

---

## 10. Copywriting and Tone Standards
- **Clarity and Precision:** State exact values and conditions. Use "18°C, Light rain with 72% humidity" instead of subjective phrases.
- **Zero AI Slop:** Banned phrases include "Unleash", "Elevate", "Seamless", "Supercharge", "Transform your day".
- **Strictly No Em Dashes:** Never use em dashes anywhere in copy, tooltips, or labels. Use commas, parentheses, or colons.
- **Telemetry Precision:** Wind speed displayed with directional cardinal indicators (e.g. "14 km/h NW").

---

*End of Document 2 (docs/DESIGN_SYSTEM.md). Awaiting user review and explicit approval.*
