import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { playDiscoverySound } from "../audio/discoverySound";
import { tourLocationsById } from "../data/locations";
import { NotFoundPage } from "./NotFoundPage";

export function DiscoveryPage() {
  const navigate = useNavigate();
  const { locationId } = useParams();
  const location = locationId ? tourLocationsById.get(locationId) : undefined;
  const lastPlayedLocationId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (location && lastPlayedLocationId.current !== location.id) {
      lastPlayedLocationId.current = location.id;
      void playDiscoverySound();
    }
  }, [location]);

  if (!location) {
    return <NotFoundPage />;
  }

  return (
    <button
      className="discovery-interstitial"
      type="button"
      aria-label={`New location discovered! Open ${location.title}`}
      onClick={() => navigate(`/locations/${location.id}`)}
    >
      <span className="discovery-interstitial__message">
        New location discovered!
      </span>
      <span className="discovery-interstitial__title">{location.title}</span>
      <span>Tap to explore</span>
    </button>
  );
}
