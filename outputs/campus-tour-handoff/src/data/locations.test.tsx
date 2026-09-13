import { describe, expect, it } from "vitest";
import { tourLocations } from "./locations";

describe("tourLocations", () => {
  it("contains stable unique IDs for all four Rice locations", () => {
    const ids = tourLocations.map((location) => location.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([
      "chao-college",
      "fondren-library",
      "rice-memorial-center",
      "oconnor-engineering",
    ]);
  });

  it("keeps every location near Rice while allowing field adjustments", () => {
    for (const { coordinates } of tourLocations) {
      expect(coordinates.latitude).toBeGreaterThan(29.7);
      expect(coordinates.latitude).toBeLessThan(29.73);
      expect(coordinates.longitude).toBeGreaterThan(-95.42);
      expect(coordinates.longitude).toBeLessThan(-95.38);
    }
  });

  it("preserves the requested 20-meter radii and valid location overrides", () => {
    expect(tourLocations.slice(0, 2).map((location) => location.discoveryRadiusMeters)).toEqual([
      20,
      20,
    ]);
    for (const location of tourLocations) {
      expect(location.discoveryRadiusMeters).toBeGreaterThan(0);
    }
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
