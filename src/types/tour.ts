import type { ReactNode } from "react";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationReading extends Coordinates {
  accuracy: number;
}

export type LocationMedia =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; label: string; poster?: string };

export interface TourLocation {
  id: string;
  title: string;
  coordinates: Coordinates;
  discoveryRadiusMeters?: number;
  media: readonly LocationMedia[];
  description: ReactNode;
  narrationText?: string;
  activity?: ReactNode;
}
