import { useEffect, useRef } from "react";
import * as maplibre from "maplibre-gl";
import type { Map as MapLibreMap, Marker, StyleSpecification } from "maplibre-gl";
import type { LocationReading, TourLocation } from "../types/tour";
import { RICE_MAP_CORNERS, RICE_MAP_IMAGE_URL } from "./campusMapConfig";
import "maplibre-gl/dist/maplibre-gl.css";

interface CampusMapProps {
  reading: LocationReading | null;
  discoveredLocations: readonly TourLocation[];
  onLocationSelect: (locationId: string) => void;
}

const OPEN_FREE_MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

const RICE_MAP_FALLBACK_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    "rice-campus-map": {
      type: "image",
      url: RICE_MAP_IMAGE_URL,
      coordinates: RICE_MAP_CORNERS,
    },
  },
  layers: [
    {
      id: "campus-background",
      type: "background",
      paint: { "background-color": "#eef4ea" },
    },
    {
      id: "rice-campus-map",
      type: "raster",
      source: "rice-campus-map",
    },
  ],
};
const INITIAL_CENTER: [number, number] = [-95.39985, 29.716435];

type MapConstructor = typeof maplibre.Map;
type MarkerConstructor = typeof maplibre.Marker;

function constructors(): { Map: MapConstructor | undefined; Marker: MarkerConstructor | undefined } {
  const namespace = maplibre as typeof maplibre & {
    default?: { Map?: MapConstructor; Marker?: MarkerConstructor };
  };
  let namedMap: MapConstructor | undefined;
  let namedMarker: MarkerConstructor | undefined;
  try {
    namedMap = namespace.Map;
  } catch {
    namedMap = undefined;
  }
  try {
    namedMarker = namespace.Marker;
  } catch {
    namedMarker = undefined;
  }
  return {
    Map: namedMap ?? namespace.default?.Map,
    Marker: namedMarker ?? namespace.default?.Marker,
  };
}

export function CampusMap({
  reading,
  discoveredLocations,
  onLocationSelect,
}: CampusMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const userMarkerRef = useRef<Marker | null>(null);
  const userElementRef = useRef<HTMLDivElement | null>(null);
  const locationMarkersRef = useRef<Marker[]>([]);
  const hasCenteredOnUserRef = useRef(false);
  const onLocationSelectRef = useRef(onLocationSelect);

  useEffect(() => {
    onLocationSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

  useEffect(() => {
    if (!containerRef.current) return;
    const { Map: MapConstructor } = constructors();
    if (!MapConstructor) return;

    let map: MapLibreMap;
    try {
      map = new MapConstructor({
        container: containerRef.current,
        style: import.meta.env.VITE_MAP_STYLE_URL || OPEN_FREE_MAP_STYLE_URL,
        center: INITIAL_CENTER,
        zoom: 16,
      });
    } catch {
      return;
    }
    mapRef.current = map;

    let fallbackApplied = false;
    const handleMapError = () => {
      if (fallbackApplied) return;
      fallbackApplied = true;
      try {
        map.setStyle(RICE_MAP_FALLBACK_STYLE);
      } catch {
        // Keep tracking and markers usable even if map rendering is unavailable.
      }
    };
    map.on("error", handleMapError);

    return () => {
      map.off("error", handleMapError);
      userMarkerRef.current?.remove();
      locationMarkersRef.current.forEach((marker) => marker.remove());
      userMarkerRef.current = null;
      userElementRef.current = null;
      locationMarkersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const { Marker: MarkerConstructor } = constructors();
    if (!map || !MarkerConstructor) return;

    if (reading) {
      if (!hasCenteredOnUserRef.current) {
        map.easeTo({
          center: [reading.longitude, reading.latitude],
          zoom: 17,
          duration: 700,
        });
        hasCenteredOnUserRef.current = true;
      }

      if (!userMarkerRef.current) {
        const userElement = document.createElement("div");
        userElement.className = "campus-map__user-marker";
        userElementRef.current = userElement;
        userMarkerRef.current = new MarkerConstructor({ element: userElement })
          .setLngLat([reading.longitude, reading.latitude])
          .addTo(map);
      } else {
        userMarkerRef.current.setLngLat([reading.longitude, reading.latitude]);
      }
    } else {
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      userElementRef.current = null;
    }
  }, [reading]);

  useEffect(() => {
    const map = mapRef.current;
    const { Marker: MarkerConstructor } = constructors();
    if (!map || !MarkerConstructor) return;

    locationMarkersRef.current.forEach((marker) => marker.remove());
    locationMarkersRef.current = discoveredLocations.map((location) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "campus-map__location-marker";
      button.setAttribute("aria-label", location.title);
      button.addEventListener("click", () => onLocationSelectRef.current(location.id));

      return new MarkerConstructor({ element: button })
        .setLngLat([location.coordinates.longitude, location.coordinates.latitude])
        .addTo(map);
    });

    return () => {
      locationMarkersRef.current.forEach((marker) => marker.remove());
      locationMarkersRef.current = [];
    };
  }, [discoveredLocations]);

  return <div ref={containerRef} className="campus-map" aria-label="Campus map" />;
}
