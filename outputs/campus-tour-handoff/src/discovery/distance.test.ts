import { describe, expect, it } from "vitest";
import { distanceMeters } from "./distance";

describe("distanceMeters", () => {
  it("returns zero for identical coordinates", () => {
    const point = { latitude: 29.71476, longitude: -95.39957 };
    expect(distanceMeters(point, point)).toBe(0);
  });

  it("calculates a known distance", () => {
    const a = { latitude: 0, longitude: 0 };
    const b = { latitude: 0, longitude: 1 };
    expect(distanceMeters(a, b)).toBeCloseTo(111_194.9266, 2);
  });

  it("distinguishes points immediately inside and outside the discovery radius", () => {
    const origin = { latitude: 29.71476, longitude: -95.39957 };
    const metersPerDegree = 111_194.9266;
    const inside = {
      latitude: origin.latitude + (6.095 / metersPerDegree),
      longitude: origin.longitude,
    };
    const outside = {
      latitude: origin.latitude + (6.097 / metersPerDegree),
      longitude: origin.longitude,
    };
    expect(distanceMeters(origin, inside)).toBeLessThanOrEqual(6.096);
    expect(distanceMeters(origin, outside)).toBeGreaterThan(6.096);
  });
});
