import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CampusMap } from "../components/CampusMap";
import { StartTourPanel } from "../components/StartTourPanel";
import { tourLocations } from "../data/locations";
import { useTourTracking } from "../discovery/useTourTracking";
import { useTour } from "../progress/TourProvider";

export function HomePage() {
  const navigate = useNavigate();
  const { discoveredIds, markDiscovered, startTour, tourStarted } = useTour();
  const discoveredLocations = tourLocations.filter((location) => discoveredIds.has(location.id));
  const tracking = useTourTracking({
    enabled: tourStarted,
    locations: tourLocations,
    discoveredIds,
    onDiscovery: (locationId) => {
      markDiscovered(locationId);
      navigate(`/discovered/${locationId}`);
    },
  });

  const handleLocationSelect = useCallback(
    (locationId: string) => navigate(`/locations/${locationId}`),
    [navigate],
  );

  return (
    <div className="home-page">
      <header className="tour-header">
        <h1>Campus Tour</h1>
        <p aria-label={`${discoveredIds.size} of ${tourLocations.length} locations explored`}>
          {discoveredIds.size} / {tourLocations.length} locations explored
        </p>
      </header>
      <div className="home-map">
        <CampusMap
          reading={tracking.reading}
          discoveredLocations={discoveredLocations}
          onLocationSelect={handleLocationSelect}
        />
        <div className="tour-status-overlay">
          <StartTourPanel
            tourStarted={tourStarted}
            status={tracking.status}
            onStart={startTour}
          />
        </div>
      </div>
    </div>
  );
}
