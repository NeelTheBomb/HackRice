# Campus Tour Web App Design

## Summary

Build a mobile-first, client-only campus tour as a Vite, React, and TypeScript single-page application. The app tracks the visitor's foreground location, reveals tour locations when proximity is confirmed, persists discoveries in a long-lived cookie, and presents discovered locations on an interactive MapLibre map.

The initial catalog contains example entries for Chao College and Fondren Library at Rice University. The architecture keeps location content modular so developers can add entries without modifying shared UI or discovery logic.

## Scope

The initial skeleton includes:

- Foreground browser geolocation with a three-second discovery evaluation interval.
- A 20-foot (6.096-meter) discovery radius.
- Confirmation from two consecutive qualifying evaluations.
- Rejection of readings whose reported horizontal accuracy is worse than 10 meters.
- A discovery sound and full-screen discovery interstitial.
- A MapLibre home map showing the user and discovered locations.
- Location detail pages with mixed image/video carousels and React-authored rich text.
- Cookie persistence using stable location IDs.
- Responsive, accessible loading and error states.
- Automated unit and component tests.

The initial skeleton does not include a backend, accounts, analytics, Web Push, background geofencing, PWA installation, a content-management system, or a developer location simulator.

## Technology

- Vite
- React
- TypeScript
- React Router
- MapLibre GL JS
- Vitest
- React Testing Library

The map style URL is configured separately from map components so the tile/style provider can be replaced without changing application logic.

## Routes

- `/` renders the home map and tracking experience.
- `/discovered/:locationId` renders the full-screen discovery interstitial.
- `/locations/:locationId` renders a location detail page.
- Unknown paths and invalid location IDs render a compact not-found state with a route back home.

## Location Catalog

Each location is a typed TSX object with the following conceptual shape:

- `id`: stable persistence and lookup identifier.
- `title`: display title.
- `coordinates`: latitude and longitude.
- `media`: ordered image and video entries.
- `description`: React content rendered by the shared detail page.

Image entries contain a source and alternative text. Video entries contain a source, optional poster, and an accessible label. Shared components own layout and behavior; catalog entries own content.

The initial example coordinates are building-center estimates derived from OpenStreetMap data:

- Chao College: `29.71476, -95.39957`
- Fondren Library: `29.71811, -95.40013`

These values must be labeled as examples in developer documentation. A production tour should field-test and adjust each point to the intended entrance or gathering place.

Example location pages use clearly labeled placeholder media and introductory content. The carousel supports both media types even if a particular location uses only one type.

## Home Experience

The home screen consists of a compact header and a map filling the remaining viewport.

The header contains:

- The placeholder title `Campus Tour`.
- A right-aligned `x / y locations explored` count.

The map contains:

- The visitor's current position when available.
- Blue, interactive markers for discovered locations only.
- No markers for undiscovered locations.

Selecting a discovered marker opens its location page. Map controls and markers must be touch-friendly and keyboard accessible where MapLibre permits.

On first use, a welcome panel explains why precise location is needed. The visitor taps `Start Tour`; this user gesture requests location permission and primes the discovery sound to comply with mobile browser audio restrictions.

## Location Tracking and Discovery

The app maintains the browser's latest geolocation reading and evaluates it against undiscovered locations every three seconds. Distance is calculated with the Haversine formula.

A location receives one confirmation when an evaluation satisfies both conditions:

- Computed distance is no greater than 6.096 meters.
- Reported horizontal accuracy is no worse than 10 meters.

Two consecutive qualifying evaluations are required. A non-qualifying evaluation resets that location's confirmation count. Confirmation state is maintained independently for each undiscovered location.

When a location is confirmed:

1. A discovery lock prevents concurrent discoveries.
2. The stable location ID is added to persisted progress immediately.
3. Active tracking is suspended.
4. The app navigates to `/discovered/:locationId`.
5. The discovery screen attempts to play the sound and displays `New location discovered!`.
6. Tapping anywhere on the discovery screen navigates to `/locations/:locationId`.
7. Returning to the home page allows tracking to resume.

The progress write occurs before navigation so a reload cannot repeatedly rediscover the same location.

## Progress Persistence

Progress is stored in a cookie as a JSON array of stable location IDs, for example:

```json
["chao-college", "fondren-library"]
```

The cookie applies site-wide, uses `SameSite=Lax`, and requests a 400-day lifetime that is refreshed whenever progress is written. Browsers may impose a shorter cap.

On load, the app:

1. Parses the cookie defensively.
2. Accepts only strings matching IDs in the current catalog.
3. Removes duplicates.
4. Falls back to an empty list when the cookie is absent or malformed.

Stable IDs allow the location catalog to be reordered, extended, or pruned without corrupting the meaning of existing progress.

## Location Detail Page

Each location page contains:

- The location title.
- A horizontal media carousel directly beneath the title.
- Rich React content beneath the carousel.
- A back button that returns to the home page.

The carousel supports touch gestures or native horizontal scrolling, previous/next controls, position indicators, images, and videos. Videos use native controls and do not autoplay. Media respects responsive sizing and reduced-motion preferences.

## Interface Direction

The skeleton uses a restrained, campus-appropriate navy-and-white palette with blue discovery markers. It does not claim official Rice branding or include protected brand assets.

The experience is mobile-first, with:

- A compact title banner.
- Large touch targets.
- Readable overlays over the map.
- A full-screen, tap-anywhere discovery interstitial.
- Clear permission, loading, accuracy, and error messages.

## Error Handling

- Unsupported geolocation produces an explanatory state while leaving discovered map locations available.
- Denied, unavailable, or timed-out geolocation produces actionable retry guidance without repeatedly prompting.
- Low-accuracy readings do not advance discovery and can surface an `Improving location accuracy...` status.
- A discovery lock prevents duplicate navigation when locations overlap or updates arrive close together.
- Failure to play the sound never blocks the discovery interstitial.
- Invalid location routes render a not-found state.
- Geolocation watches, timers, and media effects are cleaned up when their owning screen unmounts or tracking pauses.
- Cookie read/write failures degrade to in-memory progress for the current session.

## Testing

Vitest and React Testing Library tests cover:

- Haversine distance calculations around the 6.096-meter boundary.
- Two consecutive qualifying evaluations.
- Reset behavior after an out-of-range or low-accuracy evaluation.
- Ignoring discovered locations.
- Duplicate and overlapping discovery protection.
- Valid, missing, malformed, duplicated, and stale cookie data.
- Loading and permission/error states.
- Progress count and discovered-marker visibility.
- Discovery and location route transitions.
- Image and video carousel rendering and controls.
- Audio failure fallback.
- Cleanup of timers and location watchers.

Linting, type checking, tests, and a production build form the completion verification.

## Success Criteria

The skeleton is complete when:

- A user can start tracking from the home screen and see their current map position.
- Qualifying proximity readings discover an undiscovered location only after two consecutive three-second evaluations.
- Discovery is persisted before the app shows the sound-backed interstitial.
- Tapping the interstitial opens the correct modular location page.
- The home count and blue map markers accurately reflect cookie-backed discoveries after reload.
- Developers can add a location by creating one typed catalog entry and its React description without changing shared tracking, routing, or page components.
- The two Rice example locations render correctly.
- Automated checks pass.
