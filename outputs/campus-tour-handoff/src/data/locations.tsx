import type { TourLocation } from "../types/tour";
import { ChaoQuiz } from "../components/ChaoQuiz";
import { EngineeringBridgeChallenge } from "../components/EngineeringBridgeChallenge";
import { RmcExperience } from "../components/RmcExperience";
import chaoCollegeImage from "../assets/chao-college.svg";
import fondrenLibraryImage from "../assets/fondren-library.svg";
import oconnorEngineeringImage from "../assets/oconnor-engineering.svg";
import riceMemorialCenterImage from "../assets/rice-memorial-center.svg";

const cc0FlowerVideo =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

export const tourLocations: readonly TourLocation[] = [
  {
    id: "chao-college",
    title: "Chao College",
    coordinates: { latitude: 29.71476, longitude: -95.39957 },
    discoveryRadiusMeters: 20,
    media: [
      {
        type: "image",
        src: chaoCollegeImage,
        alt: "Illustration of Chao College's brick buildings beside a green lawn.",
      },
    ],
    description: (
      <>
        <h2>Chao College</h2>
        <p>
          Chao College is one of Rice's residential colleges, where students
          build community through shared traditions and everyday campus life.
        </p>
        <ul>
          <li>Residential-college community</li>
          <li>Convenient access to the academic quad</li>
        </ul>
      </>
    ),
    activity: <ChaoQuiz />,
  },
  {
    id: "fondren-library",
    title: "Fondren Library",
    coordinates: { latitude: 29.71811, longitude: -95.40013 },
    discoveryRadiusMeters: 20,
    media: [
      {
        type: "image",
        src: fondrenLibraryImage,
        alt: "Illustration of Fondren Library's arched facade and plaza.",
      },
      {
        type: "video",
        src: cc0FlowerVideo,
        label: "CC0 sample flower video from MDN for mixed-media testing",
        poster: fondrenLibraryImage,
      },
    ],
    description: (
      <>
        <h2>Fondren Library</h2>
        <p>
          Fondren Library anchors research, study, and collaboration in the
          center of Rice's campus.
        </p>
        <ul>
          <li>Research collections and librarian support</li>
          <li>Quiet study and collaborative work spaces</li>
        </ul>
      </>
    ),
  },
  {
    id: "rice-memorial-center",
    title: "Rice Memorial Center",
    // Approximate starting point. Adjust this coordinate after field testing.
    coordinates: { latitude: 29.71735, longitude: -95.40202 },
    discoveryRadiusMeters: 2000,
    media: [
      {
        type: "image",
        src: riceMemorialCenterImage,
        alt: "Colorful illustration of campus-life activities gathering at the Rice Memorial Center.",
      },
    ],
    description: (
      <>
        <h2>A crossroads for campus life</h2>
        <p>
          The Rice Memorial Center brings food, student organizations, events,
          and everyday conversation into one lively gathering place.
        </p>
      </>
    ),
    activity: <RmcExperience />,
  },
  {
    id: "oconnor-engineering",
    title: "O'Connor Engineering and Science Building",
    // Approximate starting point. Adjust this coordinate after field testing.
    coordinates: { latitude: 29.72015, longitude: -95.3991 },
    discoveryRadiusMeters: 2000,
    media: [
      {
        type: "image",
        src: oconnorEngineeringImage,
        alt: "Illustration of the O'Connor Engineering and Science Building behind a glowing truss bridge.",
      },
    ],
    description: (
      <>
        <h2>Ideas under load</h2>
        <p>
          O'Connor is a home for collaborative engineering and science, where
          ideas move from sketches to experiments and working prototypes.
        </p>
      </>
    ),
    activity: <EngineeringBridgeChallenge />,
  },
];

export const tourLocationsById: ReadonlyMap<string, TourLocation> = new Map(
  tourLocations.map((location) => [location.id, location]),
);
