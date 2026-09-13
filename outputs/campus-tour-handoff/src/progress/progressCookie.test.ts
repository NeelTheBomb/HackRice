import { describe, expect, it } from "vitest";
import {
  createProgressCookie,
  readDiscoveredLocationIds,
} from "./progressCookie";

const validIds = new Set(["chao-college", "fondren-library"]);

describe("tour progress cookies", () => {
  it("keeps unique valid IDs in cookie order", () => {
    expect(
      readDiscoveredLocationIds(
        "campusTourProgress=%5B%22chao-college%22%2C%22unknown%22%2C%22chao-college%22%5D",
        validIds,
      ),
    ).toEqual(["chao-college"]);
  });

  it("returns no discoveries for an invalid cookie payload", () => {
    expect(readDiscoveredLocationIds("campusTourProgress=broken", validIds)).toEqual(
      [],
    );
  });

  it("serializes a year-long, site-wide lax cookie", () => {
    const cookie = createProgressCookie(["chao-college"]);

    expect(cookie).toContain("campusTourProgress=%5B%22chao-college%22%5D");
    expect(cookie).toContain("Max-Age=34560000");
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).toContain("Path=/");
  });
});
