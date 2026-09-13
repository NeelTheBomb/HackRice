# Campus Tour

Lightweight Vite + React + TypeScript campus-tour skeleton using MapLibre and foreground browser geolocation.

## Run it

```powershell
npm install
npm run dev
```

The production checks are:

```powershell
npm run test:run
npm run lint
npm run build
```

Geolocation works on `localhost` or an HTTPS deployment. The app stays open while walking and evaluates the latest reading immediately, then every three seconds. A location requires two consecutive qualifying readings; its radius can be set per location, with the global discovery radius used as a fallback.

## Add a location

Import local media through Vite, then add one typed object to `src/data/locations.tsx`:

```tsx
import newLocationImage from "../assets/new-location.svg";

{
  id: "new-location",
  title: "New Location",
  coordinates: { latitude: 29.7, longitude: -95.4 },
  // Optional: overrides DISCOVERY_RADIUS_METERS for this location.
  discoveryRadiusMeters: 20,
  media: [
    { type: "image", src: newLocationImage, alt: "Accessible description" },
    { type: "video", src: "https://example.com/tour.mp4", label: "Tour video" },
  ],
  description: (
    <>
      <h2>About this place</h2>
      <p>Rich React content goes here.</p>
    </>
  ),
  // Optional: any location-specific interactive React content.
  activity: <MyLocationActivity />,
}
```

`discoveryRadiusMeters` is optional and uses meters. If omitted, the location uses `DISCOVERY_RADIUS_METERS` from `src/discovery/evaluateDiscovery.ts`. `activity` is also optional; use it for quizzes, polls, mini-games, or other custom React components without changing the shared location page.

Keep IDs stable: they are stored in the `campusTourProgress` cookie. The cookie stores a JSON array of discovered IDs, uses `SameSite=Lax`, and requests a 400-day lifetime. Unknown or malformed IDs are ignored.

## Deploy to GitHub Pages

The app uses hash-based routes and a relative Vite base, so it works from a repository path such as `https://username.github.io/repository/`. Local assets must be imported as shown above; do not use root-absolute paths such as `/image.svg`.

After moving this folder into a GitHub repository:

1. Push it to a `main` branch.
2. Open the repository's **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.

The included `.github/workflows/deploy-pages.yml` workflow tests, lints, builds, verifies asset URLs, and deploys `dist`. Location links use URLs such as `https://username.github.io/repository/#/locations/chao-college` so refreshing a location does not require server-side route rewriting.

## Map configuration

Without additional configuration, the map uses `src/assets/rice-map.png` as a local MapLibre image layer, so it also works on GitHub Pages without an external tile service. It centers once on the visitor's first location reading, then leaves the camera under the visitor's control. Move or resize the image by editing the `west`, `north`, `east`, and `south` values in `src/components/campusMapConfig.ts`. The values are approximate Rice campus bounds and are intentionally kept in one place for field adjustment.

Set `VITE_MAP_STYLE_URL` to a MapLibre-compatible style URL if you want to opt into a hosted map. If that configured style reports a loading error, the app falls back to the bundled Rice image. The example location coordinates are building-center estimates and should be field-tested against the intended entrance before production use.

## Browser behavior

The Start Tour button requests precise location and primes a short discovery sound. The app intentionally does not use Web Push, background tracking, a service worker, accounts, a backend, or a developer location simulator. Sound failure never prevents the discovery page from opening.

Product and implementation context lives in `docs/superpowers/`. Execution reports and review artifacts live in `.superpowers/sdd/2026-09-12-campus-tour/`.
