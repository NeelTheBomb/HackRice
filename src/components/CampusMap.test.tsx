import { fireEvent, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TourLocation } from "../types/tour";
import { CampusMap } from "./CampusMap";

interface MapDouble {
  options: Record<string, unknown>;
  easeTo: ReturnType<typeof vi.fn>;
  setStyle: ReturnType<typeof vi.fn>;
  remove: ReturnType<typeof vi.fn>;
  emit: (event: string) => void;
}

interface MarkerDouble {
  element: HTMLElement;
  setLngLat: ReturnType<typeof vi.fn>;
  addTo: ReturnType<typeof vi.fn>;
  remove: ReturnType<typeof vi.fn>;
}

const mapLibreDoubles = vi.hoisted(() => ({
  maps: [] as MapDouble[],
  markers: [] as MarkerDouble[],
}));

vi.mock("maplibre-gl", () => {
  class Map {
    options: Record<string, unknown>;
    listeners: Record<string, Array<() => void>> = {};
    on = vi.fn((event: string, listener: () => void) => {
      this.listeners[event] = [...(this.listeners[event] ?? []), listener];
      return this;
    });
    off = vi.fn((event: string, listener: () => void) => {
      this.listeners[event] = (this.listeners[event] ?? []).filter(
        (candidate) => candidate !== listener,
      );
      return this;
    });
    easeTo = vi.fn(() => this);
    setStyle = vi.fn(() => this);
    remove = vi.fn();

    constructor(options: Record<string, unknown>) {
      this.options = options;
      mapLibreDoubles.maps.push(this);
    }

    emit(event: string) {
      for (const listener of this.listeners[event] ?? []) listener();
    }
  }

  class Marker {
    element: HTMLElement;
    setLngLat = vi.fn(() => this);
    addTo = vi.fn(() => this);
    remove = vi.fn();

    constructor(options: { element: HTMLElement }) {
      this.element = options.element;
      mapLibreDoubles.markers.push(this);
    }
  }

  return { default: { Map, Marker } };
});

const locations: readonly TourLocation[] = [
  {
    id: "chao-college",
    title: "Chao College",
    coordinates: { latitude: 29.71476, longitude: -95.39957 },
    media: [],
    description: null,
  },
  {
    id: "fondren-library",
    title: "Fondren Library",
    coordinates: { latitude: 29.71811, longitude: -95.40013 },
    media: [],
    description: null,
  },
];

beforeEach(() => {
  mapLibreDoubles.maps.length = 0;
  mapLibreDoubles.markers.length = 0;
  vi.stubEnv("VITE_MAP_STYLE_URL", "https://maps.example.test/campus-style.json");
});

describe("CampusMap", () => {
  it("uses the bundled Rice campus image when no external style is configured", () => {
    vi.stubEnv("VITE_MAP_STYLE_URL", "");

    render(
      <CampusMap
        reading={null}
        discoveredLocations={[]}
        onLocationSelect={vi.fn()}
      />,
    );

    expect(mapLibreDoubles.maps[0].options.style).toMatchObject({
      sources: {
        "rice-campus-map": {
          type: "image",
          url: expect.stringMatching(/rice-map.*\.png$/),
        },
      },
    });
  });

  it("falls back to the local Rice campus image when the live style errors", () => {
    render(
      <CampusMap
        reading={null}
        discoveredLocations={[]}
        onLocationSelect={vi.fn()}
      />,
    );

    const map = mapLibreDoubles.maps[0];
    map.emit("error");

    expect(map.setStyle).toHaveBeenCalledOnce();
    const style = map.setStyle.mock.calls[0][0] as {
      sources: Record<string, unknown>;
      layers: Array<Record<string, unknown>>;
    };
    expect(style.sources["rice-campus-map"]).toMatchObject({
      type: "image",
      url: expect.stringMatching(/rice-map.*\.png$/),
    });
    expect(style.layers).toContainEqual(
      expect.objectContaining({
        id: "rice-campus-map",
        type: "raster",
        source: "rice-campus-map",
      }),
    );
  });

  it("falls back to the Rice campus image when a tile errors after the live style loads", () => {
    render(
      <CampusMap
        reading={null}
        discoveredLocations={[]}
        onLocationSelect={vi.fn()}
      />,
    );

    const map = mapLibreDoubles.maps[0];
    map.emit("style.load");
    map.emit("error");

    expect(map.setStyle).toHaveBeenCalledOnce();
    expect(map.setStyle.mock.calls[0][0]).toMatchObject({
      sources: {
        "rice-campus-map": {
          type: "image",
        },
      },
    });
  });

  it("creates one map with the configured style and campus center", () => {
    const { getByLabelText } = render(
      <CampusMap
        reading={null}
        discoveredLocations={[]}
        onLocationSelect={vi.fn()}
      />,
    );

    expect(mapLibreDoubles.maps).toHaveLength(1);
    expect(mapLibreDoubles.maps[0].options).toMatchObject({
      container: getByLabelText("Campus map"),
      style: "https://maps.example.test/campus-style.json",
    });
    const center = mapLibreDoubles.maps[0].options.center as [number, number];
    expect(center[0]).toBeCloseTo(-95.39985);
    expect(center[1]).toBeCloseTo(29.716435);
  });

  it("updates the existing user marker when the location reading changes", () => {
    const { rerender } = render(
      <CampusMap
        reading={{ latitude: 29.71, longitude: -95.39, accuracy: 8 }}
        discoveredLocations={[]}
        onLocationSelect={vi.fn()}
      />,
    );

    expect(mapLibreDoubles.markers).toHaveLength(1);
    const userMarker = mapLibreDoubles.markers[0];
    expect(userMarker.element).toHaveClass("campus-map__user-marker");
    expect(userMarker.setLngLat).toHaveBeenLastCalledWith([-95.39, 29.71]);

    rerender(
      <CampusMap
        reading={{ latitude: 29.72, longitude: -95.4, accuracy: 6 }}
        discoveredLocations={[]}
        onLocationSelect={vi.fn()}
      />,
    );

    expect(mapLibreDoubles.markers).toHaveLength(1);
    expect(userMarker.setLngLat).toHaveBeenLastCalledWith([-95.4, 29.72]);
  });

  it("centers on the first user reading without overriding later map movement", () => {
    const { rerender } = render(
      <CampusMap
        reading={null}
        discoveredLocations={[]}
        onLocationSelect={vi.fn()}
      />,
    );
    const map = mapLibreDoubles.maps[0];

    rerender(
      <CampusMap
        reading={{ latitude: 29.714, longitude: -95.401, accuracy: 6 }}
        discoveredLocations={[]}
        onLocationSelect={vi.fn()}
      />,
    );

    expect(map.easeTo).toHaveBeenCalledOnce();
    expect(map.easeTo).toHaveBeenCalledWith({
      center: [-95.401, 29.714],
      zoom: 17,
      duration: 700,
    });

    rerender(
      <CampusMap
        reading={{ latitude: 29.715, longitude: -95.402, accuracy: 5 }}
        discoveredLocations={[]}
        onLocationSelect={vi.fn()}
      />,
    );

    expect(map.easeTo).toHaveBeenCalledOnce();
  });

  it("renders blue accessible markers only for supplied discoveries", () => {
    render(
      <CampusMap
        reading={null}
        discoveredLocations={[locations[1]]}
        onLocationSelect={vi.fn()}
      />,
    );

    expect(mapLibreDoubles.markers).toHaveLength(1);
    const discoveredMarker = mapLibreDoubles.markers[0];
    expect(discoveredMarker.element).toHaveAccessibleName("Fondren Library");
    expect(discoveredMarker.element).toHaveClass("campus-map__location-marker");
    expect(discoveredMarker.setLngLat).toHaveBeenCalledWith([-95.40013, 29.71811]);
  });

  it("selects the location represented by a discovered marker", () => {
    const onLocationSelect = vi.fn();
    render(
      <CampusMap
        reading={null}
        discoveredLocations={locations}
        onLocationSelect={onLocationSelect}
      />,
    );

    fireEvent.click(mapLibreDoubles.markers[0].element);

    expect(onLocationSelect).toHaveBeenCalledOnce();
    expect(onLocationSelect).toHaveBeenCalledWith("chao-college");
  });

  it("removes the map and every marker on unmount", () => {
    const { unmount } = render(
      <CampusMap
        reading={{ latitude: 29.71, longitude: -95.39, accuracy: 8 }}
        discoveredLocations={locations}
        onLocationSelect={vi.fn()}
      />,
    );
    const map = mapLibreDoubles.maps[0];
    const markers = [...mapLibreDoubles.markers];

    unmount();

    expect(map.remove).toHaveBeenCalledOnce();
    for (const marker of markers) {
      expect(marker.remove).toHaveBeenCalledOnce();
    }
  });
});
