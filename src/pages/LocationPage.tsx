import { useNavigate, useParams } from "react-router-dom";
import { MediaCarousel } from "../components/MediaCarousel";
import { LocationNarration } from "../components/LocationNarration";
import { tourLocationsById } from "../data/locations";
import { NotFoundPage } from "./NotFoundPage";

export function LocationPage() {
  const navigate = useNavigate();
  const { locationId } = useParams();
  const location = locationId ? tourLocationsById.get(locationId) : undefined;

  if (!location) {
    return <NotFoundPage />;
  }

  return (
    <main>
      <button type="button" onClick={() => navigate("/")}>
        Back to tour
      </button>
      <h1>{location.title}</h1>
      <MediaCarousel media={location.media} title={location.title} />
      {location.narrationText ? (
        <LocationNarration text={location.narrationText} />
      ) : null}
      <section className="location-description">{location.description}</section>
      {location.activity}
    </main>
  );
}
