import { useEffect, useRef, useState } from "react";
import type { LocationReading, TourLocation } from "../types/tour";
import { evaluateDiscovery, type ConfirmationStreaks } from "./evaluateDiscovery";

export type TrackingStatus =
  | "idle"
  | "locating"
  | "tracking"
  | "inaccurate"
  | "denied"
  | "unavailable"
  | "timed-out"
  | "unsupported";

export interface TrackingState {
  status: TrackingStatus;
  reading: LocationReading | null;
}

export interface UseTourTrackingOptions {
  enabled: boolean;
  locations: readonly TourLocation[];
  discoveredIds: ReadonlySet<string>;
  onDiscovery: (locationId: string) => void;
}

const TRACKING_INTERVAL_MS = 3_000;

export function useTourTracking({
  enabled,
  locations,
  discoveredIds,
  onDiscovery,
}: UseTourTrackingOptions): TrackingState {
  const [state, setState] = useState<TrackingState>({ status: "idle", reading: null });
  const latestReadingRef = useRef<LocationReading | null>(null);
  const streaksRef = useRef<ConfirmationStreaks>({});
  const locationsRef = useRef(locations);
  const discoveredIdsRef = useRef(discoveredIds);
  const onDiscoveryRef = useRef(onDiscovery);
  const geolocationSupported =
    typeof navigator !== "undefined" && navigator.geolocation !== undefined;

  useEffect(() => {
    locationsRef.current = locations;
  }, [locations]);

  useEffect(() => {
    discoveredIdsRef.current = discoveredIds;
  }, [discoveredIds]);

  useEffect(() => {
    onDiscoveryRef.current = onDiscovery;
  }, [onDiscovery]);

  useEffect(() => {
    if (!enabled) {
      latestReadingRef.current = null;
      streaksRef.current = {};
      return;
    }

    const geolocation = navigator.geolocation;
    if (!geolocation) {
      return;
    }

    let active = true;
    let locked = false;
    let watchId: number | null = null;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    latestReadingRef.current = null;
    streaksRef.current = {};

    const stopTracking = () => {
      if (watchId !== null) {
        geolocation.clearWatch(watchId);
        watchId = null;
      }
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const evaluateLatest = () => {
      const reading = latestReadingRef.current;
      if (!active || locked || reading === null) return;

      const evaluation = evaluateDiscovery({
        reading,
        locations: locationsRef.current,
        discoveredIds: discoveredIdsRef.current,
        streaks: streaksRef.current,
      });
      streaksRef.current = evaluation.streaks;
      setState({
        status: evaluation.accuracyAccepted ? "tracking" : "inaccurate",
        reading,
      });

      if (evaluation.discoveredId !== null) {
        locked = true;
        stopTracking();
        onDiscoveryRef.current(evaluation.discoveredId);
      }
    };

    watchId = geolocation.watchPosition(
      (position) => {
        if (!active || locked) return;
        latestReadingRef.current = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        evaluateLatest();
      },
      (error) => {
        if (!active || locked) return;
        latestReadingRef.current = null;
        streaksRef.current = {};
        const status: TrackingStatus =
          error.code === error.PERMISSION_DENIED
            ? "denied"
            : error.code === error.TIMEOUT
              ? "timed-out"
              : "unavailable";
        setState({ status, reading: null });
        if (status === "denied") {
          locked = true;
          stopTracking();
        }
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 0 },
    );

    if (locked) {
      stopTracking();
    } else {
      intervalId = setInterval(evaluateLatest, TRACKING_INTERVAL_MS);
    }

    return () => {
      active = false;
      stopTracking();
    };
  }, [enabled]);

  if (!enabled) return { status: "idle", reading: null };
  if (!geolocationSupported) return { status: "unsupported", reading: null };
  return state.status === "idle" ? { status: "locating", reading: null } : state;
}
