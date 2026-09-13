import type { TourLocation } from "../types/tour";
import { ChaoQuiz } from "../components/ChaoQuiz";
import { EngineeringBridgeChallenge } from "../components/EngineeringBridgeChallenge";
import { RmcExperience } from "../components/RmcExperience";
import barnOwlGardenImage from "../assets/barn-owl-garden.jpg";
import barnOwlWideImage from "../assets/barn-owl-wide.jpg";
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
    id: "barn-owl-statue",
    title: "Barn Owl Statue",
    // Placeholder near central campus. Adjust after checking the statue in person.
    coordinates: { latitude: 29.718241309717733, longitude: -95.40111414677752 },
    discoveryRadiusMeters: 20,
    media: [
      {
        type: "image",
        src: barnOwlGardenImage,
        alt: "Close view of the bronze barn owl statue in its garden setting.",
      },
      {
        type: "image",
        src: barnOwlWideImage,
        alt: "Wide view of the barn owl statue and circular flower garden beside a brick campus building.",
      },
    ],
    description: (
      <>
        <h2>A quiet campus sentinel</h2>
        <p>
          This bronze barn owl watches over a shaded garden, pairing Rice's owl
          identity with the calm character of the surrounding campus landscape.
        </p>
        <p>
          Walk around the sculpture to see how its expression and silhouette
          change from different angles.
        </p>
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
