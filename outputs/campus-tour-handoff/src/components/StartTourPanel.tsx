import { primeDiscoverySound } from "../audio/discoverySound";
import type { TrackingStatus } from "../discovery/useTourTracking";

interface StartTourPanelProps {
  tourStarted: boolean;
  status: TrackingStatus;
  onStart: () => void;
}

const statusMessages: Record<TrackingStatus, string> = {
  idle: "Ready to start location tracking.",
  locating: "Finding your location...",
  tracking: "Tracking your location.",
  inaccurate: "Improving location accuracy...",
  denied: "Location permission was denied. Enable precise location in your browser settings, then try again.",
  unavailable: "Your location is currently unavailable. Check your device settings and try again.",
  "timed-out": "The location request timed out. Move to an open area and try again.",
  unsupported: "This browser does not support location tracking.",
};

export function StartTourPanel({ tourStarted, status, onStart }: StartTourPanelProps) {
  if (tourStarted) {
    return <p role="status">{statusMessages[status]}</p>;
  }

  const startTour = async () => {
    await primeDiscoverySound();
    onStart();
  };

  return (
    <section aria-labelledby="start-tour-heading">
      <h2 id="start-tour-heading">Explore campus</h2>
      <p>
        Campus Tour uses your precise location while this page is open to discover places as you reach them.
      </p>
      <button type="button" onClick={startTour}>
        Start Tour
      </button>
    </section>
  );
}
