import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { TourLocation } from "../types/tour";
import { MAX_ACCURACY_METERS } from "./evaluateDiscovery";
import { useTourTracking } from "./useTourTracking";

const location: TourLocation = {
  id: "chao-college",
  title: "Chao College",
  coordinates: { latitude: 29.71476, longitude: -95.39957 },
  media: [],
  description: "Chao College",
};

const position = (accuracy = 5): GeolocationPosition =>
  ({
    coords: {
      latitude: location.coordinates.latitude,
      longitude: location.coordinates.longitude,
      accuracy,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
      toJSON: () => ({}),
    },
    timestamp: 1,
    toJSON: () => ({}),
  }) satisfies GeolocationPosition;

const positionError = (code: number): GeolocationPositionError =>
  ({
    code,
    message: "geolocation failed",
    PERMISSION_DENIED: 1,
    POSITION_UNAVAILABLE: 2,
    TIMEOUT: 3,
  }) as GeolocationPositionError;

describe("useTourTracking", () => {
  let success: PositionCallback;
  let failure: PositionErrorCallback;
  let watchPosition: ReturnType<typeof vi.fn>;
  let clearWatch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    watchPosition = vi.fn((onSuccess: PositionCallback, onError: PositionErrorCallback) => {
      success = onSuccess;
      failure = onError;
      return 42;
    });
    clearWatch = vi.fn();
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: { watchPosition, clearWatch },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: undefined,
    });
  });

  it("does not start a geolocation watch while disabled", () => {
    const { result } = renderHook(() =>
      useTourTracking({
        enabled: false,
        locations: [location],
        discoveredIds: new Set(),
        onDiscovery: vi.fn(),
      }),
    );

    expect(watchPosition).not.toHaveBeenCalled();
    expect(result.current).toEqual({ status: "idle", reading: null });
  });

  it("starts exactly one high-accuracy watch when enabled", () => {
    const onDiscovery = vi.fn();
    const { rerender } = renderHook(
      ({ enabled }) =>
        useTourTracking({
          enabled,
          locations: [location],
          discoveredIds: new Set(),
          onDiscovery,
        }),
      { initialProps: { enabled: false } },
    );

    rerender({ enabled: true });
    rerender({ enabled: true });

    expect(watchPosition).toHaveBeenCalledTimes(1);
    expect(watchPosition).toHaveBeenCalledWith(expect.any(Function), expect.any(Function), {
      enableHighAccuracy: true,
      timeout: 10_000,
      maximumAge: 0,
    });
  });

  it("evaluates the latest reading immediately and every 3,000 milliseconds", () => {
    const onDiscovery = vi.fn();
    const { result } = renderHook(() =>
      useTourTracking({
        enabled: true,
        locations: [location],
        discoveredIds: new Set(),
        onDiscovery,
      }),
    );

    act(() => success(position()));
    expect(result.current).toEqual({
      status: "tracking",
      reading: { latitude: 29.71476, longitude: -95.39957, accuracy: 5 },
    });
    expect(onDiscovery).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(2_999));
    expect(onDiscovery).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1));
    expect(onDiscovery).toHaveBeenCalledOnce();
    expect(onDiscovery).toHaveBeenCalledWith("chao-college");
  });

  it("locks after the first discovery and suspends further evaluation", () => {
    const onDiscovery = vi.fn();
    renderHook(() =>
      useTourTracking({
        enabled: true,
        locations: [location],
        discoveredIds: new Set(),
        onDiscovery,
      }),
    );

    act(() => success(position()));
    act(() => vi.advanceTimersByTime(3_000));
    act(() => success(position()));
    act(() => vi.advanceTimersByTime(12_000));

    expect(onDiscovery).toHaveBeenCalledTimes(1);
    expect(clearWatch).toHaveBeenCalledWith(42);
  });

  it.each([
    [1, "denied"],
    [2, "unavailable"],
    [3, "timed-out"],
  ] as const)("keeps geolocation error %i in %s without discovering from a stale reading", (code, status) => {
    const onDiscovery = vi.fn();
    const { result } = renderHook(() =>
      useTourTracking({
        enabled: true,
        locations: [location],
        discoveredIds: new Set(),
        onDiscovery,
      }),
    );

    act(() => success(position()));
    act(() => failure(positionError(code)));
    act(() => vi.advanceTimersByTime(3_000));

    expect(result.current).toEqual({ status, reading: null });
    expect(onDiscovery).not.toHaveBeenCalled();
    if (status === "denied") {
      expect(clearWatch).toHaveBeenCalledWith(42);
    }
  });

  it.each([2, 3] as const)("resets confirmation progress after recoverable error %i", (code) => {
    const onDiscovery = vi.fn();
    renderHook(() =>
      useTourTracking({
        enabled: true,
        locations: [location],
        discoveredIds: new Set(),
        onDiscovery,
      }),
    );

    act(() => success(position()));
    act(() => failure(positionError(code)));
    act(() => success(position()));

    expect(onDiscovery).not.toHaveBeenCalled();
  });

  it("reports unsupported geolocation without throwing", () => {
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: undefined,
    });

    const { result } = renderHook(() =>
      useTourTracking({
        enabled: true,
        locations: [location],
        discoveredIds: new Set(),
        onDiscovery: vi.fn(),
      }),
    );

    expect(result.current.status).toBe("unsupported");
  });

  it("marks readings over the accuracy threshold as inaccurate", () => {
    const { result } = renderHook(() =>
      useTourTracking({
        enabled: true,
        locations: [location],
        discoveredIds: new Set(),
        onDiscovery: vi.fn(),
      }),
    );

    act(() => success(position(MAX_ACCURACY_METERS + 1)));

    expect(result.current.status).toBe("inaccurate");
  });

  it("clears its watch and interval when unmounted", () => {
    const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");
    const { unmount } = renderHook(() =>
      useTourTracking({
        enabled: true,
        locations: [location],
        discoveredIds: new Set(),
        onDiscovery: vi.fn(),
      }),
    );

    unmount();

    expect(clearWatch).toHaveBeenCalledWith(42);
    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
