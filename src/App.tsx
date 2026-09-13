import { Route, Routes } from "react-router-dom";
import { DiscoveryPage } from "./pages/DiscoveryPage";
import { HomePage } from "./pages/HomePage";
import { LocationPage } from "./pages/LocationPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { TourProvider } from "./progress/TourProvider";

export default function App() {
  return (
    <TourProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/discovered/:locationId" element={<DiscoveryPage />} />
        <Route path="/locations/:locationId" element={<LocationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </TourProvider>
  );
}
