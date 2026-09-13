import { describe, expect, it } from "vitest";
import type { TourLocation } from "../types/tour";
import {
  evaluateDiscovery,
  MAX_ACCURACY_METERS,
  REQUIRED_CONFIRMATIONS,
} from "./evaluateDiscovery";

const makeLocation = (id: string, latitude = 29.71476): TourLocation => ({
  id,
  title: id,
  coordinates: { latitude, longitude: -95.39957 },
  discoveryRadiusMeters: 20,
  media: [],
  description: id,
});

const location = makeLocation("one");
const readingAt = (latitude = location.coordinates.latitude, accuracy = 5) => ({
  latitude,
  longitude: location.coordinates.longitude,
  accuracy,
});

describe("evaluateDiscovery", () => {
  it("increments a first qualifying reading without discovering", () => {
    const result = evaluateDiscovery({
      reading: readingAt(), locations: [location], discoveredIds: new Set(), streaks: {},
    });
    expect(result).toEqual({ discoveredId: null, streaks: { one: 1 }, accuracyAccepted: true });
  });

  it("discovers after the required consecutive qualifying readings", () => {
    const result = evaluateDiscovery({
      reading: readingAt(), locations: [location], discoveredIds: new Set(), streaks: { one: 1 },
    });
    expect(result.discoveredId).toBe("one");
    expect(result.streaks.one).toBe(REQUIRED_CONFIRMATIONS);
  });

  it("resets an out-of-range candidate", () => {
    const result = evaluateDiscovery({
      reading: readingAt(location.coordinates.latitude + 0.001), locations: [location], discoveredIds: new Set(), streaks: { one: 1 },
    });
    expect(result).toEqual({ discoveredId: null, streaks: { one: 0 }, accuracyAccepted: true });
  });

  it("resets all candidates for low-accuracy readings", () => {
    const result = evaluateDiscovery({
      reading: readingAt(undefined, MAX_ACCURACY_METERS + 0.01),
      locations: [location, makeLocation("two", 29.715)], discoveredIds: new Set(), streaks: { one: 1, two: 1 },
    });
    expect(result).toEqual({ discoveredId: null, streaks: { one: 0, two: 0 }, accuracyAccepted: false });
  });

  it("excludes locations already discovered", () => {
    const result = evaluateDiscovery({
      reading: readingAt(), locations: [location], discoveredIds: new Set(["one"]), streaks: { one: 1 },
    });
    expect(result).toEqual({ discoveredId: null, streaks: {}, accuracyAccepted: true });
  });

  it("selects the first catalog entry when overlapping candidates qualify", () => {
    const first = makeLocation("first");
    const second = makeLocation("second");
    const reading = { ...readingAt(), latitude: first.coordinates.latitude };
    const result = evaluateDiscovery({
      reading, locations: [first, second], discoveredIds: new Set(), streaks: { first: 1, second: 1 },
    });
    expect(result.discoveredId).toBe("first");
  });

  it("uses a location-specific discovery radius instead of the global fallback", () => {
    const customRadiusLocation = {
      ...location,
      discoveryRadiusMeters: 20,
    };
    const result = evaluateDiscovery({
      reading: readingAt(location.coordinates.latitude + 0.00027),
      locations: [customRadiusLocation],
      discoveredIds: new Set(),
      streaks: { one: 1 },
    });

    expect(result).toEqual({
      discoveredId: null,
      streaks: { one: 0 },
      accuracyAccepted: true,
    });
  });

});
