import riceMapImageUrl from "../assets/rice-map.png";

// Adjust these four values to move or resize the Rice campus image.
// Longitude: west/east move the left/right edges.
// Latitude: north/south move the top/bottom edges.
export const RICE_MAP_BOUNDS = {
  west: -95.416,
  north: 29.724,
  east: -95.3925,
  south: 29.709,
} as const;

export const RICE_MAP_IMAGE_URL = riceMapImageUrl;

export const RICE_MAP_CORNERS: [
  [number, number],
  [number, number],
  [number, number],
  [number, number],
] = [
  [RICE_MAP_BOUNDS.west, RICE_MAP_BOUNDS.north],
  [RICE_MAP_BOUNDS.east, RICE_MAP_BOUNDS.north],
  [RICE_MAP_BOUNDS.east, RICE_MAP_BOUNDS.south],
  [RICE_MAP_BOUNDS.west, RICE_MAP_BOUNDS.south],
];
