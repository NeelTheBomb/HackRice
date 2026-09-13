# Campus Tour Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first campus tour SPA that discovers nearby locations from foreground geolocation, persists stable discovered IDs, and presents them through a MapLibre map and media-rich detail pages.

**Architecture:** A Vite React client owns all state and routing. Pure modules handle location data, cookie parsing, distance calculations, and discovery confirmation; thin React providers and hooks connect those modules to geolocation, sound, routing, and MapLibre.

**Tech Stack:** Vite, React, TypeScript, React Router, MapLibre GL JS, Vitest, React Testing Library, ESLint

**Spec:** `docs/superpowers/specs/2026-09-12-campus-tour-design.md`

## Global Constraints

- Track foreground location only; do not add Web Push, background geofencing, or a backend.
- Evaluate proximity every 3,000 milliseconds.
- Use a 6.096-meter discovery radius and require two consecutive qualifying evaluations.
- Reject readings whose reported horizontal accuracy is greater than 10 meters.
- Persist a JSON array of stable location IDs in a site-wide `SameSite=Lax` cookie with a requested 400-day lifetime.
- Include Chao College at `29.71476, -95.39957` and Fondren Library at `29.71811, -95.40013` as field-testable examples.
- Show only discovered locations as blue map markers.
- Use React content for rich descriptions and support both images and videos in the carousel.
- Do not add a developer location simulator, PWA installation, accounts, analytics, or a CMS.
- Keep all browser-only behavior behind small interfaces that can be mocked in tests.

## File Structure

```text
index.html                         Vite HTML entry point
package.json                       Scripts and dependencies
tsconfig.json                      Shared TypeScript project settings
tsconfig.app.json                  Browser TypeScript settings
tsconfig.node.json                 Vite configuration TypeScript settings
vite.config.ts                     Vite and Vitest configuration
eslint.config.js                   React/TypeScript lint configuration
src/main.tsx                       React bootstrap and global CSS imports
src/App.tsx                        Providers and route table
src/styles.css                     Global responsive styles
src/test/setup.ts                  DOM matcher and browser API test setup
src/types/tour.ts                  Shared location, media, and geolocation types
src/data/locations.tsx             Modular Rice example catalog
src/data/locations.test.tsx        Catalog invariants
src/assets/chao-college.svg        Sample Chao media illustration
src/assets/fondren-library.svg     Sample Fondren media illustration
src/progress/progressCookie.ts     Cookie parser and serializer
src/progress/progressCookie.test.ts Persistence unit tests
src/progress/TourProvider.tsx      Session and discovered-progress state
src/progress/TourProvider.test.tsx Provider behavior tests
src/discovery/distance.ts          Haversine distance function
src/discovery/distance.test.ts     Boundary-focused distance tests
src/discovery/evaluateDiscovery.ts Pure consecutive-reading state machine
src/discovery/evaluateDiscovery.test.ts Discovery policy tests
src/discovery/useTourTracking.ts   Geolocation watch and 3-second scheduler
src/discovery/useTourTracking.test.ts Hook tests with fake timers
src/audio/discoverySound.ts        Prime/play Web Audio chime API
src/audio/discoverySound.test.ts   Audio success and fallback tests
src/components/StartTourPanel.tsx  Permission onboarding and tracking status
src/components/StartTourPanel.test.tsx Onboarding component tests
src/components/CampusMap.tsx       MapLibre map, user marker, blue markers
src/components/CampusMap.test.tsx  Map integration tests with MapLibre mocked
src/components/MediaCarousel.tsx   Image/video horizontal carousel
src/components/MediaCarousel.test.tsx Carousel component tests
src/pages/HomePage.tsx             Header, tracker, map, and navigation orchestration
src/pages/HomePage.test.tsx        Home discovery-flow tests
src/pages/DiscoveryPage.tsx        Sound-backed tap-anywhere interstitial
src/pages/DiscoveryPage.test.tsx   Interstitial routing and audio tests
src/pages/LocationPage.tsx         Location detail page
src/pages/LocationPage.test.tsx    Detail and invalid-ID tests
src/pages/NotFoundPage.tsx         Unknown-route recovery UI
README.md                          Setup, browser constraints, and location-authoring guide
```

---

### Task 1: Project Foundation and Typed Location Catalog

**Files:**
- Create: `package.json`, `index.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`, `eslint.config.js`
- Create: `src/main.tsx`, `src/App.tsx`, `src/styles.css`, `src/test/setup.ts`
- Create: `src/types/tour.ts`, `src/data/locations.tsx`, `src/data/locations.test.tsx`
- Create: `src/assets/chao-college.svg`, `src/assets/fondren-library.svg`

**Interfaces:**
- Produces: `Coordinates`, `LocationReading`, `LocationMedia`, `TourLocation`, `tourLocations`, and `tourLocationsById`.

- [ ] **Step 1: Create the Vite dependency and configuration files**

Create the package with scripts `dev`, `build`, `lint`, `test`, and `test:run`. Install runtime dependencies with:

```powershell
npm install react react-dom react-router-dom maplibre-gl
npm install -D vite typescript @vitejs/plugin-react eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/react @types/react-dom
```

Configure Vitest in `vite.config.ts` with `environment: "jsdom"`, `setupFiles: ["./src/test/setup.ts"]`, and CSS enabled. Configure `src/test/setup.ts` to import `@testing-library/jest-dom/vitest` and reset DOM mocks after each test.

- [ ] **Step 2: Write the failing catalog invariant test**

```tsx
import { describe, expect, it } from "vitest";
import { tourLocations } from "./locations";

describe("tourLocations", () => {
  it("contains stable unique IDs and both Rice examples", () => {
    const ids = tourLocations.map((location) => location.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(["chao-college", "fondren-library"]);
  });

  it("contains valid media accessibility metadata", () => {
    for (const location of tourLocations) {
      expect(location.media.length).toBeGreaterThan(0);
      for (const item of location.media) {
        expect(item.type === "image" ? item.alt : item.label).not.toBe("");
      }
    }
  });
});
```

- [ ] **Step 3: Run the catalog test and verify it fails**

Run: `npm run test:run -- src/data/locations.test.tsx`

Expected: FAIL because `src/data/locations.tsx` does not exist.

- [ ] **Step 4: Implement the shared types, catalog, sample assets, and minimal route shell**

Define these exact public types:

```tsx
import type { ReactNode } from "react";

export interface Coordinates { latitude: number; longitude: number }
export interface LocationReading extends Coordinates { accuracy: number }
export type LocationMedia =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; label: string; poster?: string };
export interface TourLocation {
  id: string;
  title: string;
  coordinates: Coordinates;
  media: readonly LocationMedia[];
  description: ReactNode;
}
```

Export `tourLocations: readonly TourLocation[]` and `tourLocationsById: ReadonlyMap<string, TourLocation>`. Give each example React-authored headings, paragraphs, and lists. Use local SVG sample images; use `https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4` as a clearly labeled CC0 sample video so mixed-media behavior is exercised without committing a binary asset. Add a temporary `App` heading only to prove the shell mounts.

- [ ] **Step 5: Run foundation checks**

Run: `npm run test:run -- src/data/locations.test.tsx && npm run build && npm run lint`

Expected: all commands exit 0.

- [ ] **Step 6: Commit the foundation**

```powershell
git add package.json package-lock.json index.html tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts eslint.config.js src
git commit -m "chore: scaffold campus tour client"
```

---

### Task 2: Cookie Persistence and Tour State

**Files:**
- Create: `src/progress/progressCookie.ts`, `src/progress/progressCookie.test.ts`
- Create: `src/progress/TourProvider.tsx`, `src/progress/TourProvider.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `tourLocations` and stable `TourLocation.id` values.
- Produces: `readDiscoveredLocationIds(cookieString: string, validIds: ReadonlySet<string>): string[]`, `createProgressCookie(ids: readonly string[]): string`, `TourProvider`, and `useTour()` returning `{ discoveredIds: ReadonlySet<string>, markDiscovered(id: string): void, tourStarted: boolean, startTour(): void }`.

- [ ] **Step 1: Write failing cookie tests**

Test this exact behavior:

```ts
expect(readDiscoveredLocationIds("campusTourProgress=%5B%22chao-college%22%2C%22unknown%22%2C%22chao-college%22%5D", validIds))
  .toEqual(["chao-college"]);
expect(readDiscoveredLocationIds("campusTourProgress=broken", validIds)).toEqual([]);
expect(createProgressCookie(["chao-college"]))
  .toContain("campusTourProgress=%5B%22chao-college%22%5D");
expect(createProgressCookie(["chao-college"])).toContain("Max-Age=34560000");
expect(createProgressCookie(["chao-college"])).toContain("SameSite=Lax");
expect(createProgressCookie(["chao-college"])).toContain("Path=/");
```

- [ ] **Step 2: Run the cookie tests and verify they fail**

Run: `npm run test:run -- src/progress/progressCookie.test.ts`

Expected: FAIL because the cookie functions do not exist.

- [ ] **Step 3: Implement defensive cookie parsing and serialization**

Use `campusTourProgress` as the cookie name. Parse only a JSON array, retain only unique strings present in `validIds`, preserve their cookie order, and return `[]` after any decode or JSON error. Serialize with `encodeURIComponent(JSON.stringify(ids))`, `Max-Age=34560000`, `SameSite=Lax`, and `Path=/`.

- [ ] **Step 4: Write failing provider tests**

Render a test consumer and verify that the provider loads valid cookie IDs, starts with `tourStarted === false`, changes it through `startTour()`, and makes `markDiscovered("fondren-library")` update both context state and `document.cookie` without duplicating an existing ID.

- [ ] **Step 5: Run provider tests and verify they fail**

Run: `npm run test:run -- src/progress/TourProvider.test.tsx`

Expected: FAIL because `TourProvider` and `useTour` do not exist.

- [ ] **Step 6: Implement the provider and connect it at the app root**

Keep session state in memory so returning from a detail page resumes tracking, while a full reload requires another user gesture to prime audio. Catch cookie write failures; state remains usable for the current session.

- [ ] **Step 7: Run persistence tests and commit**

Run: `npm run test:run -- src/progress`

Expected: PASS.

```powershell
git add src/progress src/App.tsx
git commit -m "feat: persist tour discoveries"
```

---

### Task 3: Distance and Consecutive Discovery Engine

**Files:**
- Create: `src/discovery/distance.ts`, `src/discovery/distance.test.ts`
- Create: `src/discovery/evaluateDiscovery.ts`, `src/discovery/evaluateDiscovery.test.ts`

**Interfaces:**
- Consumes: `Coordinates`, `LocationReading`, `TourLocation`.
- Produces: `distanceMeters(a, b): number`, constants `DISCOVERY_RADIUS_METERS = 6.096`, `MAX_ACCURACY_METERS = 10`, `REQUIRED_CONFIRMATIONS = 2`, and `evaluateDiscovery(input): DiscoveryEvaluation`.

- [ ] **Step 1: Write failing Haversine tests**

Verify identical coordinates return 0, known coordinates return the expected distance within tolerance, and points immediately inside/outside 6.096 meters classify correctly.

- [ ] **Step 2: Run the distance tests and verify they fail**

Run: `npm run test:run -- src/discovery/distance.test.ts`

Expected: FAIL because `distanceMeters` does not exist.

- [ ] **Step 3: Implement the Haversine function**

Use Earth radius `6_371_000` meters and convert degree deltas to radians. Keep the function pure and do not round its return value.

- [ ] **Step 4: Write failing discovery-state tests**

Define the public interface:

```ts
export type ConfirmationStreaks = Readonly<Record<string, number>>;
export interface DiscoveryInput {
  reading: LocationReading;
  locations: readonly TourLocation[];
  discoveredIds: ReadonlySet<string>;
  streaks: ConfirmationStreaks;
}
export interface DiscoveryEvaluation {
  discoveredId: string | null;
  streaks: ConfirmationStreaks;
  accuracyAccepted: boolean;
}
```

Test first qualifying reading, second qualifying discovery, out-of-range reset, low-accuracy reset, previously discovered exclusion, and deterministic selection of the first catalog entry when overlapping candidates qualify simultaneously.

- [ ] **Step 5: Run the discovery tests and verify they fail**

Run: `npm run test:run -- src/discovery/evaluateDiscovery.test.ts`

Expected: FAIL because `evaluateDiscovery` does not exist.

- [ ] **Step 6: Implement the minimal pure state machine**

Evaluate undiscovered locations in catalog order. If accuracy is greater than 10, reset all candidate streaks and return `accuracyAccepted: false`. Otherwise increment or reset each location independently, returning at most one `discoveredId`.

- [ ] **Step 7: Run discovery tests and commit**

Run: `npm run test:run -- src/discovery`

Expected: PASS.

```powershell
git add src/discovery/distance.ts src/discovery/distance.test.ts src/discovery/evaluateDiscovery.ts src/discovery/evaluateDiscovery.test.ts
git commit -m "feat: add proximity discovery engine"
```

---

### Task 4: Geolocation Tracking, Sound, and Onboarding

**Files:**
- Create: `src/discovery/useTourTracking.ts`, `src/discovery/useTourTracking.test.ts`
- Create: `src/audio/discoverySound.ts`, `src/audio/discoverySound.test.ts`
- Create: `src/components/StartTourPanel.tsx`, `src/components/StartTourPanel.test.tsx`

**Interfaces:**
- Consumes: `evaluateDiscovery`, `TourLocation[]`, discovered IDs, and `markDiscovered` supplied by its caller.
- Produces: `useTourTracking(options: UseTourTrackingOptions): TrackingState`, `primeDiscoverySound(): Promise<void>`, `playDiscoverySound(): Promise<void>`, and `StartTourPanel({ tourStarted, status, onStart })`.

- [ ] **Step 1: Write failing tracking-hook tests**

Use fake timers and a mocked `navigator.geolocation.watchPosition`. Verify:

- no watch starts while disabled;
- enabling starts exactly one watch;
- the latest reading is evaluated immediately and then every 3,000 ms;
- the hook calls `onDiscovery(id)` only once and suspends further evaluation;
- permission denied maps to `status: "denied"`;
- position unavailable and timeout map to readable error statuses;
- unmount calls `clearWatch` and clears the interval.

- [ ] **Step 2: Run the hook tests and verify they fail**

Run: `npm run test:run -- src/discovery/useTourTracking.test.ts`

Expected: FAIL because the hook does not exist.

- [ ] **Step 3: Implement the tracking hook**

Expose:

```ts
type TrackingStatus = "idle" | "locating" | "tracking" | "inaccurate" | "denied" | "unavailable" | "timed-out" | "unsupported";
interface TrackingState { status: TrackingStatus; reading: LocationReading | null }
interface UseTourTrackingOptions {
  enabled: boolean;
  locations: readonly TourLocation[];
  discoveredIds: ReadonlySet<string>;
  onDiscovery: (locationId: string) => void;
}
```

Store the latest reading and streaks in refs to avoid recreating the interval. Use high accuracy, a 10-second geolocation timeout, and no cached reading (`maximumAge: 0`). Lock after the first discovery callback.

- [ ] **Step 4: Write failing sound and onboarding tests**

Mock `AudioContext`. Verify priming creates/resumes a context, playback schedules a short two-tone oscillator chime, and missing or rejected audio APIs resolve without throwing. Verify `StartTourPanel` calls `primeDiscoverySound()` before `startTour()` and renders messages for each `TrackingStatus`.

- [ ] **Step 5: Run these tests and verify they fail**

Run: `npm run test:run -- src/audio src/components/StartTourPanel.test.tsx`

Expected: FAIL because the sound module and panel do not exist.

- [ ] **Step 6: Implement the sound API and onboarding panel**

Keep a module-level `AudioContext`. Prime it from the Start Tour click. Generate a brief, low-volume two-tone chime with oscillator and gain nodes; catch all failures. The panel must explain precise location use before the button and show `Improving location accuracy...` for inaccurate readings.

- [ ] **Step 7: Run tracking/onboarding tests and commit**

Run: `npm run test:run -- src/discovery/useTourTracking.test.ts src/audio src/components/StartTourPanel.test.tsx`

Expected: PASS.

```powershell
git add src/discovery/useTourTracking.ts src/discovery/useTourTracking.test.ts src/audio src/components/StartTourPanel.tsx src/components/StartTourPanel.test.tsx
git commit -m "feat: track location and prime discovery sound"
```

---

### Task 5: Router, Discovery Interstitial, and Location Pages

**Files:**
- Create: `src/components/MediaCarousel.tsx`, `src/components/MediaCarousel.test.tsx`
- Create: `src/pages/DiscoveryPage.tsx`, `src/pages/DiscoveryPage.test.tsx`
- Create: `src/pages/LocationPage.tsx`, `src/pages/LocationPage.test.tsx`
- Create: `src/pages/NotFoundPage.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `tourLocationsById`, `LocationMedia`, `playDiscoverySound`, and React Router params/navigation.
- Produces: working `/discovered/:locationId`, `/locations/:locationId`, and fallback routes; `MediaCarousel({ media, title })`.

- [ ] **Step 1: Write failing carousel tests**

Render mixed image/video media. Verify the image alt text, video accessible label and controls, previous/next buttons, active slide indicator, wraparound navigation, and no autoplay attribute.

- [ ] **Step 2: Run the carousel tests and verify they fail**

Run: `npm run test:run -- src/components/MediaCarousel.test.tsx`

Expected: FAIL because `MediaCarousel` does not exist.

- [ ] **Step 3: Implement the carousel**

Use one active index, touch-friendly buttons, `aria-live="polite"` position text, and a horizontally animated track. Disable movement animation under `prefers-reduced-motion`; videos always use native controls.

- [ ] **Step 4: Write failing route-page tests**

With a memory router, verify:

- a valid discovery route renders `New location discovered!` and plays sound once;
- tapping or pressing Enter/Space on the interstitial opens `/locations/:locationId`;
- invalid discovery and location IDs render the not-found state;
- a valid location renders its title, carousel, React description, and back button;
- back returns to `/`.

- [ ] **Step 5: Run the page tests and verify they fail**

Run: `npm run test:run -- src/pages/DiscoveryPage.test.tsx src/pages/LocationPage.test.tsx`

Expected: FAIL because the pages and routes do not exist.

- [ ] **Step 6: Implement route pages and route table**

Make the interstitial a semantic full-screen button so tapping anywhere and keyboard activation share native behavior. Look up params through `tourLocationsById`. Add `BrowserRouter` in `main.tsx` and keep provider composition in `App.tsx`.

- [ ] **Step 7: Run route tests and commit**

Run: `npm run test:run -- src/components/MediaCarousel.test.tsx src/pages`

Expected: PASS.

```powershell
git add src/main.tsx src/App.tsx src/components/MediaCarousel.tsx src/components/MediaCarousel.test.tsx src/pages
git commit -m "feat: add discovery and location routes"
```

---

### Task 6: MapLibre Home Experience and End-to-End Discovery Flow

**Files:**
- Create: `src/components/CampusMap.tsx`, `src/components/CampusMap.test.tsx`
- Create: `src/pages/HomePage.tsx`, `src/pages/HomePage.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `useTour`, `useTourTracking`, `tourLocations`, `TourLocation`, `LocationReading`, React Router navigation, and `VITE_MAP_STYLE_URL`.
- Produces: `CampusMap({ reading, discoveredLocations, onLocationSelect })` where `reading` is `LocationReading | null`, `discoveredLocations` is `readonly TourLocation[]`, and `onLocationSelect` is `(locationId: string) => void`; also produces the complete `/` route.

- [ ] **Step 1: Write failing map tests with MapLibre mocked**

Mock `maplibre-gl` constructors. Verify one map is created with the configured style, the user marker updates when readings change, only supplied discovered locations receive blue markers, marker clicks call `onLocationSelect(id)`, and unmount removes map and markers.

- [ ] **Step 2: Run the map tests and verify they fail**

Run: `npm run test:run -- src/components/CampusMap.test.tsx`

Expected: FAIL because `CampusMap` does not exist.

- [ ] **Step 3: Implement the MapLibre wrapper**

Default the style URL to `https://demotiles.maplibre.org/style.json` when `VITE_MAP_STYLE_URL` is absent. Center the initial view between the two example locations, use a distinct user-location element, and create blue buttons as discovered markers with each location title as an accessible label.

- [ ] **Step 4: Write failing home-flow tests**

Mock `CampusMap` and `useTourTracking`. Verify:

- the header starts at `0 / 2 locations explored`;
- Start Tour invokes session start;
- discovered IDs determine which locations reach the map;
- selecting a blue marker opens its location page;
- `onDiscovery("chao-college")` persists through `markDiscovered` before navigating to `/discovered/chao-college`;
- the tracker is enabled only after Start Tour and while HomePage is mounted.

- [ ] **Step 5: Run home tests and verify they fail**

Run: `npm run test:run -- src/pages/HomePage.test.tsx`

Expected: FAIL because `HomePage` does not exist.

- [ ] **Step 6: Implement HomePage and connect the root route**

Render the banner above a full-height map. Derive discovered location objects from catalog order. In the discovery callback, call `markDiscovered(id)` synchronously before `navigate`. Overlay `StartTourPanel` and current tracking status without hiding already-discovered markers.

- [ ] **Step 7: Run map/home tests and commit**

Run: `npm run test:run -- src/components/CampusMap.test.tsx src/pages/HomePage.test.tsx`

Expected: PASS.

```powershell
git add src/App.tsx src/components/CampusMap.tsx src/components/CampusMap.test.tsx src/pages/HomePage.tsx src/pages/HomePage.test.tsx
git commit -m "feat: add interactive campus map"
```

---

### Task 7: Responsive Styling, Accessibility, and Documentation

**Files:**
- Modify: `src/styles.css`
- Modify: `index.html`
- Create: `README.md`
- Modify: tests only where assertions are required for accessibility behavior

**Interfaces:**
- Consumes: the semantic class names and states from Tasks 4-6.
- Produces: a complete mobile-first presentation and developer authoring instructions.

- [ ] **Step 1: Add failing presentation/accessibility assertions**

Add focused assertions that the banner has a visible `Campus Tour` heading, progress uses an accessible label, discovery is a full-screen button, map status changes use an appropriate live region, carousel controls are named, and all sample media has accessible text.

- [ ] **Step 2: Run the affected tests and verify the new assertions fail**

Run: `npm run test:run -- src/components src/pages`

Expected: FAIL on the newly added semantic assertions.

- [ ] **Step 3: Implement the mobile-first visual system**

Use CSS custom properties for navy, white, blue, neutral backgrounds, focus rings, spacing, and safe-area insets. Make the app exactly viewport-height with a fixed-size header and flexible map. Add responsive detail-page widths, scroll-snap media, 44px minimum touch targets, visible focus states, high-contrast errors, and reduced-motion overrides.

- [ ] **Step 4: Write exact setup and authoring documentation**

Document:

- `npm install`, `npm run dev`, `npm run test:run`, `npm run lint`, and `npm run build`;
- HTTPS requirement for geolocation outside localhost;
- foreground-only tracking and mobile GPS limitations;
- optional `VITE_MAP_STYLE_URL` configuration;
- cookie name and 400-day requested lifetime;
- the two-reading/three-second/20-foot/10-meter policy;
- how to add a typed location and React description;
- the need to field-test example coordinates;
- sample media replacement and supported image/video fields.

- [ ] **Step 5: Run presentation checks and commit**

Run: `npm run test:run -- src/components src/pages && npm run lint && npm run build`

Expected: all commands exit 0.

```powershell
git add index.html README.md src/styles.css src/components src/pages
git commit -m "docs: polish and document campus tour"
```

---

### Task 8: Full Verification and Scope Audit

**Files:**
- Modify: only files implicated by verification failures.

**Interfaces:**
- Consumes: the complete application.
- Produces: verified release-ready skeleton with no known spec gaps.

- [ ] **Step 1: Run the complete automated suite**

Run: `npm run test:run`

Expected: all tests pass with no unhandled rejections or timer leaks.

- [ ] **Step 2: Run static checks and production build**

Run: `npm run lint && npm run build`

Expected: lint exits 0 and Vite emits `dist/` successfully.

- [ ] **Step 3: Perform a local smoke test**

Run: `npm run dev -- --host 127.0.0.1`

Open the local URL and verify the welcome panel, title/progress banner, MapLibre tiles, permission interaction, responsive location pages, mixed-media carousel, back navigation, and invalid-route recovery. Use browser developer tools only to mock geolocation for this verification; do not add simulator UI to the app.

- [ ] **Step 4: Audit the implementation against the specification**

Confirm every Success Criteria item in `docs/superpowers/specs/2026-09-12-campus-tour-design.md` has corresponding passing automated coverage or a completed smoke-test observation. Confirm no backend, Push API, service worker, simulator UI, analytics, or account code was introduced.

- [ ] **Step 5: Commit verification fixes if any**

If verification required source changes, rerun Steps 1-3 and commit only those fixes:

```powershell
git add README.md src package.json package-lock.json vite.config.ts
git commit -m "fix: resolve campus tour verification findings"
```

If no files changed, record the passing commands in the task handoff and do not create an empty commit.
