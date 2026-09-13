import type { LocationReading, TourLocation } from "../types/tour";
import { distanceMeters } from "./distance";

export const DISCOVERY_RADIUS_METERS = 2000;
export const MAX_ACCURACY_METERS = 200;
export const REQUIRED_CONFIRMATIONS = 2;

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

export function evaluateDiscovery({
  reading,
  locations,
  discoveredIds,
  streaks,
}: DiscoveryInput): DiscoveryEvaluation {
  const candidates = locations.filter((location) => !discoveredIds.has(location.id));
  const nextStreaks: Record<string, number> = {};

  if (reading.accuracy > MAX_ACCURACY_METERS) {
    for (const location of candidates) nextStreaks[location.id] = 0;
    return { discoveredId: null, streaks: nextStreaks, accuracyAccepted: false };
  }

  let discoveredId: string | null = null;
  for (const location of candidates) {
    const discoveryRadiusMeters =
      location.discoveryRadiusMeters ?? DISCOVERY_RADIUS_METERS;
    const qualifying =
      distanceMeters(reading, location.coordinates) <= discoveryRadiusMeters;
    const next = qualifying ? (streaks[location.id] ?? 0) + 1 : 0;
    nextStreaks[location.id] = next;
    if (discoveredId === null && next >= REQUIRED_CONFIRMATIONS) discoveredId = location.id;
  }

  return { discoveredId, streaks: nextStreaks, accuracyAccepted: true };
}
