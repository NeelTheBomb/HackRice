import { createContext, useCallback, useContext, useState } from "react";
import { tourLocations } from "../data/locations";
import {
  createProgressCookie,
  readDiscoveredLocationIds,
} from "./progressCookie";

interface TourContextValue {
  discoveredIds: ReadonlySet<string>;
  markDiscovered: (id: string) => void;
  tourStarted: boolean;
  startTour: () => void;
}

const validLocationIds = new Set(tourLocations.map((location) => location.id));
const TourContext = createContext<TourContextValue | undefined>(undefined);

export function TourProvider({ children }: React.PropsWithChildren) {
  const [discoveredIds, setDiscoveredIds] = useState<ReadonlySet<string>>(
    () => new Set(readDiscoveredLocationIds(document.cookie, validLocationIds)),
  );
  const [tourStarted, setTourStarted] = useState(false);

  const markDiscovered = useCallback((id: string) => {
    if (!validLocationIds.has(id)) {
      return;
    }

    setDiscoveredIds((currentIds) => {
      if (currentIds.has(id)) {
        return currentIds;
      }

      const nextIds = new Set(currentIds);
      nextIds.add(id);
      try {
        document.cookie = createProgressCookie([...nextIds]);
      } catch {
        // Keep the current session's discovery state if persistence is unavailable.
      }
      return nextIds;
    });
  }, []);

  const startTour = useCallback(() => {
    setTourStarted(true);
  }, []);

  return (
    <TourContext.Provider
      value={{ discoveredIds, markDiscovered, tourStarted, startTour }}
    >
      {children}
    </TourContext.Provider>
  );
}

// This hook belongs beside its provider so both share the private context.
// eslint-disable-next-line react-refresh/only-export-components
export function useTour(): TourContextValue {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
}
