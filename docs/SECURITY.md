# Application Security Specification

## Project: 3D Weather Web App
**Status:** In Review  
**Version:** 1.0.0  
**Target Architecture:** Client-Side Single Page Application (Vite/React) with External API Integration  

---

## 1. Data Classification and Sensitivity

| Data Class | Examples | Storage Location | Sensitivity Level | Handling Policy |
|---|---|---|---|---|
| **Public Meteorological Data** | Temperatures, wind vectors, WMO codes, forecast arrays | Memory cache, external API | Public | Cached freely; no encryption required. |
| **User Geolocation Coordinates** | Browser GPS latitude and longitude | Browser memory, optional `localStorage` | Confidential | Never transmitted to third-party analytics or external loggers. Held only for forecast resolution. |
| **Search Queries** | City search strings | `localStorage` (max 5 items) | Private | Retained on client device; cleared upon user request. |
| **System Secrets** | Deployment tokens, CI keys | CI/CD environment variables | Secret | Never bundled into client JavaScript. |

---

## 2. Roles and Access Control

1. **Anonymous Web Client (v1 Core):**
   - Permitted: Read access to public Open-Meteo forecast and geocoding endpoints; read/write access to private client `localStorage`.
   - Prohibited: Access to private networks, cross-origin write operations, and server administrative functions.
2. **Authenticated User (Tier 2 Cloud Sync):**
   - Permitted: Read and write access strictly scoped to own user record and saved location entries via PostgreSQL Row Level Security (`auth.uid() = user_id`).
3. **Continuous Integration Runner:**
   - Permitted: Read-only checkout of repository code; write access to static hosting deployment targets.

---

## 3. Authentication and Session Management

- **v1 Architecture:** Stateless and anonymous. The application issues zero cookies, stores zero session identifiers, and avoids tracking tokens.
- **Geolocation Permission Handling:**
  - Browser Geolocation API accessed exclusively through standard explicit prompt (`navigator.geolocation.getCurrentPosition`).
  - Geolocation prompt includes a 3000ms timeout guard to prevent UI blocking on unresponsive device hardware.
  - Failure to grant permission immediately transitions to default city fallback without degraded UI state.

---

## 4. Secret Management and Environment Boundaries

- **Zero Client-Side Secrets:** Open-Meteo APIs require no secret key or token. No API secret is embedded in client build artifacts.
- **Git Hygiene:** 
  - `.env`, `.env.local`, and `.env.production` files are explicitly added to `.gitignore`.
  - Only `.env.example` containing non-secret documentation placeholders is committed.
- **Bundle Inspection:** Production build scripts include automated string audits to verify that no private keys or tokens exist in emitted `.js` chunks.

---

## 5. Input Validation and Sanitization

### 5.1 City Search Input Sanitization
- **Max Input Length:** Enforce a hard ceiling of 100 characters.
- **Allowed Character Set:** Unicode letters, whitespace, numbers, commas, and hyphens (`^[\p{L}\p{N}\s,\-]{1,100}$` in UTF-8).
- **Sanitization:** Strip leading and trailing whitespace, block control characters, and escape HTML entities before rendering to prevent DOM-based Cross-Site Scripting (XSS).

### 5.2 Coordinate Boundary Validation
Latitude and longitude parameters must be strictly validated before issuing network requests:
- **Latitude:** Finite floating-point number, bounded within `-90.00000 <= lat <= 90.00000`.
- **Longitude:** Finite floating-point number, bounded within `-180.00000 <= lon <= 180.00000`.
- **Validation Failure Action:** Reject query, log client-side debug warning, and fallback to default coordinates.

### 5.3 External API Response Schema Validation
- All external API payloads from Open-Meteo are validated at the network boundary using TypeScript type guards and defensive property access.
- WMO codes must be integers between 0 and 99. Any unknown or missing code safely falls back to code `0` (Clear Sky).

---

## 6. File Uploads
- **Upload Scope:** File uploads are completely out of scope and disabled.
- **Enforcement:** No `<input type="file">` elements exist in the codebase. Drag-and-drop file events are intercepted and cancelled at the window boundary.

---

## 7. Rate Limiting and Fair Use Protection

1. **Client Search Debounce:** City autocomplete requests are debounced with a mandatory 300ms idle delay to eliminate excessive network bursts while typing.
2. **In-Memory Cache Throttling:** Once coordinates are fetched, responses are cached for 300,000ms (5 minutes). Re-selecting or re-rendering the same location hits client cache with zero network overhead.
3. **Client Request Ceiling:** Maximum 30 geocoding queries per minute per client instance. Rapid repeated queries are throttled with a visual idle state.

---

## 8. Dependency Management and Supply Chain Security

- **Deterministic Lockfiles:** Production and CI builds execute exclusively with `npm ci` against a verified `package-lock.json`.
- **Vulnerability Auditing:** `npm audit --audit-level=high` is integrated into the pre-commit and CI verification pipeline. Zero high or critical vulnerabilities are permitted.
- **Minimal Dependency Surface:** Only essential, heavily maintained libraries are included (`react`, `three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion`, `lucide-react`, `tailwindcss`).

---

## 9. Logging, Telemetry, and Privacy

- **Zero External Telemetry:** No user coordinates, device locations, or search queries are sent to external analytics or ad tracking vendors.
- **Production Console Sanitization:** Vite compiler configuration strips `console.log` and `console.debug` statements in production builds (`drop_console: true` in Terser/ESBuild options).
- **Error Boundaries:** Runtime React crashes display an accessible fallback card without exposing component stack traces or internal memory addresses to end users.

---

## 10. Content Security Policy (CSP) and HTTP Security Headers

When serving the production web application, the following HTTP response headers must be configured:

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.open-meteo.com https://geocoding-api.open-meteo.com; img-src 'self' data: blob:; worker-src 'self' blob:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests;
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(self), camera=(), microphone=(), payment=()
```

---

## 11. Pre-Merge Checklist Mapped to OWASP Top 10:2025

| OWASP Category | Security Mitigation | Verification Step |
|---|---|---|
| **A01:2025 Broken Access Control** | Client features respect sandboxed boundaries. RLS policies drafted for any future database table. | [ ] Verify no unauthorized state escalation or exposed admin paths exist. |
| **A02:2025 Cryptographic Failures** | Strict HTTPS enforcement with HSTS header. Geolocation and weather data transit exclusively over TLS 1.3. | [ ] Audit network panel to confirm zero mixed-content or HTTP requests. |
| **A03:2025 Injection & XSS** | React virtual DOM auto-escaping; explicit input character whitelisting on city searches; zero `dangerouslySetInnerHTML`. | [ ] Verify search input escapes HTML entities and rejects script injections. |
| **A04:2025 Insecure Design** | Rate limiting, 5-minute cache TTL, graceful fallback for denied geolocation permissions. | [ ] Verify app functions cleanly when geolocation is denied or network fails. |
| **A05:2025 Security Misconfiguration** | Content Security Policy, X-Frame-Options DENY, and Permissions-Policy configured on web server. | [ ] Validate security headers via automated header inspection tool. |
| **A06:2025 Vulnerable Components** | All dependencies locked in `package-lock.json`; automated vulnerability audit in CI pipeline. | [ ] Execute `npm audit` and confirm zero high or critical findings. |
| **A07:2025 Authentication Failures** | Stateless anonymous client for v1. No hardcoded credentials or session vulnerabilities. | [ ] Confirm zero authentication tokens or user passwords exist in storage. |
| **A08:2025 Integrity Failures** | Subresource integrity and verified npm package hashes; schema validation on external API payloads. | [ ] Test invalid JSON responses from API mock to verify non-crashing recovery. |
| **A09:2025 Logging Failures** | Console logs stripped in production; zero user GPS coordinates leaked to external servers. | [ ] Verify production bundle has zero console logging of coordinate pairs. |
| **A10:2025 Request Forgery** | External fetch targets constrained exclusively to official `open-meteo.com` domains via CSP `connect-src`. | [ ] Confirm outgoing network requests cannot be redirected to arbitrary URLs. |

---

*End of Document 5 (docs/SECURITY.md). Awaiting user review and explicit approval.*
