import type { TourLocation } from "../types/tour";
import { ChausDrinkGame } from "../components/ChausDrinkGame";
import { ChaoQuiz } from "../components/ChaoQuiz";
import { EngineeringBridgeChallenge } from "../components/EngineeringBridgeChallenge";
import { FondrenPresidentSort } from "../components/FondrenPresidentSort";
import { OwlDressUp } from "../components/OwlDressUp";
import barnOwlGardenImage from "../assets/barn-owl-garden.jpg";
import barnOwlWideImage from "../assets/barn-owl-wide.jpg";
import centralPlantCogenerationImage from "../assets/central-plant-cogeneration.png";
import centralPlantDrawingImage from "../assets/central-plant-drawing.jpg";
import centralPlantInteriorImage from "../assets/central-plant-interior.jpg";
import centralPlantTurbineImage from "../assets/central-plant-turbine.jpg";
import chaoCollegeImage from "../assets/chao-college.svg";
import fondrenLibraryImage from "../assets/fondren-library.jpg";
import fondrenLibraryBlackImage from "../assets/fondren-black.png"
import frogWallImage from "../assets/frog-wall.jpg";
import frogWallVideo from "../assets/frog-wall.mp4";
import oconnorEngineeringImage from "../assets/oconnor-engineering.svg";
import rmcChausImage from "../assets/rmc-chaus.png";
import rmcPubImage from "../assets/rmc-pub.jpg";
import rmcWalkwayImage from "../assets/rmc-walkway.jpg";

function createResidentialCollege(
  id: string,
  title: string,
  latitude: number,
  longitude: number,
): TourLocation {
  return {
    id,
    title,
    // Approximate location. Adjust these coordinates after field testing.
    coordinates: { latitude, longitude },
    discoveryRadiusMeters: 5,
    media: [],
    description: (
      <>
        <h2>{title}</h2>
        <p>
          {title} is one of Rice's residential communities, bringing students
          together through shared spaces, college traditions, and self-government.
        </p>
      </>
    ),
  };
}

const additionalResidentialColleges: readonly TourLocation[] = [
  createResidentialCollege("baker-college", "Baker College", 29.71607, -95.40319),
  createResidentialCollege("will-rice-college", "Will Rice College", 29.71584, -95.40246),
  createResidentialCollege("hanszen-college", "Hanszen College", 29.71563, -95.40141),
  createResidentialCollege("wiess-college", "Wiess College", 29.71548, -95.40038),
  createResidentialCollege("lovett-college", "Lovett College", 29.71493, -95.40153),
  createResidentialCollege(
    "sid-richardson-college",
    "Sid Richardson College",
    29.71455,
    -95.40066,
  ),
  createResidentialCollege("jones-college", "Jones College", 29.72109, -95.39869),
  createResidentialCollege("brown-college", "Brown College", 29.72178, -95.39794),
  createResidentialCollege("martel-college", "Martel College", 29.72175, -95.39943),
  createResidentialCollege("mcmurtry-college", "McMurtry College", 29.72082, -95.39965),
  createResidentialCollege("duncan-college", "Duncan College", 29.72063, -95.39877),
];

const additionalCampusLocations: readonly TourLocation[] = [
  {
    id: "rice-stadium",
    title: "Rice Stadium",
    // Approximate location. Adjust this coordinate after field testing.
    coordinates: { latitude: 29.7165, longitude: -95.4092 },
    discoveryRadiusMeters: 5,
    media: [],
    description: (
      <>
        <h2>Rice Stadium</h2>
        <p>
          Rice Stadium is a landmark athletics venue and the home field of Rice
          Owls football.
        </p>
      </>
    ),
  },
  {
    id: "shepherd-school-of-music",
    title: "The Shepherd School of Music",
    // Approximate location. Adjust this coordinate after field testing.
    coordinates: { latitude: 29.7174, longitude: -95.4058 },
    discoveryRadiusMeters: 5,
    media: [],
    description: (
      <>
        <h2>The Shepherd School of Music</h2>
        <p>
          The Shepherd School brings musicians and audiences together through
          study, rehearsal, and performances across its campus venues.
        </p>
      </>
    ),
  },
  {
    id: "gibbs-recreation-center",
    title: "Gibbs Recreation and Wellness Center",
    // Approximate location. Adjust this coordinate after field testing.
    coordinates: { latitude: 29.7191, longitude: -95.4034 },
    discoveryRadiusMeters: 5,
    media: [],
    description: (
      <>
        <h2>Gibbs Recreation and Wellness Center</h2>
        <p>
          The recreation center supports campus fitness and well-being through
          exercise spaces, aquatics, classes, and recreational programs.
        </p>
      </>
    ),
  },
  {
    id: "twilight-epiphany-skyspace",
    title: "Twilight Epiphany Skyspace",
    // Approximate location. Adjust this coordinate after field testing.
    coordinates: { latitude: 29.7165, longitude: -95.4051 },
    discoveryRadiusMeters: 5,
    media: [],
    description: (
      <>
        <h2>James Turrell's Twilight Epiphany</h2>
        <p>
          This site-specific Skyspace frames the changing sky and uses light to
          transform how visitors perceive its colors at dawn and dusk.
        </p>
      </>
    ),
  },
];

export const tourLocations: readonly TourLocation[] = [
  {
    id: "chao-college",
    title: "Chao College",
    coordinates: { latitude: 29.71476, longitude: -95.39957 },
    discoveryRadiusMeters: 5,
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
    narrationText:
      "Chao College is one of Rice's residential colleges, where students build community through shared traditions and everyday campus life. It offers a residential college community with convenient access to the academic quad.",
    activity: <ChaoQuiz />,
  },
  ...additionalResidentialColleges,
  ...additionalCampusLocations,
  {
    id: "fondren-library",
    title: "Fondren Library",
    coordinates: { latitude: 29.718173692767593, longitude: -95.40010017487674 },
    discoveryRadiusMeters: 40,
    media: [
      {
        type: "image",
        src: fondrenLibraryImage,
        alt: "Fondren Library's arched facade viewed across the lawn.",
      },
      {
        type: "image",
        src: fondrenLibraryBlackImage,
        alt: "Fondren Library's initial construction.",
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
        <p>
          <strong>Hint:</strong> on fourth floor on Fondren their may be a helpful
          room
        </p>
      </>
    ),
    narrationText:
      "Fondren Library anchors research, study, and collaboration in the center of Rice's campus. It offers research collections, librarian support, quiet study, and collaborative work spaces. Hint: on fourth floor on Fondren their may be a helpful room.",
    activity: <FondrenPresidentSort />,
  },
  {
    id: "barn-owl-statue",
    title: "Barn Owl Statue",
    // Placeholder near central campus. Adjust after checking the statue in person.
    coordinates: { latitude: 29.718241309717733, longitude: -95.40111414677752 },
    discoveryRadiusMeters: 10,
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
    narrationText:
      "This bronze barn owl watches over a shaded garden, pairing Rice's owl identity with the calm character of the surrounding campus landscape. Walk around the sculpture to see how its expression and silhouette change from different angles.",
    activity: <OwlDressUp />,
  },
  {
    id: "frog-wall",
    title: "Frog Wall",
    // Placeholder near central campus. Adjust this coordinate after field testing.
    coordinates: { latitude: 29.71885019145559,  longitude:-95.39933794482525 },
    discoveryRadiusMeters: 10,
    media: [
      {
        type: "video",
        src: frogWallVideo,
        label: "Close-up video of the Frog Wall",
        poster: frogWallImage,
      },
      {
        type: "image",
        src: frogWallImage,
        alt: "Close view of the Frog Wall's textured surface and repeating circular openings.",
      },
    ],
    description: (
      <>
        <h2>Look closely</h2>
        <p>
          The Frog Wall rewards a closer look. Notice the textured surface and
          repeating openings, then move around it to see how the pattern changes
          with your perspective.
        </p>
      </>
    ),
    narrationText:
      "The Frog Wall rewards a closer look. Notice the textured surface and repeating openings, then move around it to see how the pattern changes with your perspective.",
  },
  {
    id: "central-plant",
    title: "Rice Central Plant",
    // Approximate placeholder. Adjust this coordinate after checking it in person.
    coordinates: { latitude: 29.720986965702316, longitude: -95.40011810448163 },
    discoveryRadiusMeters: 40,
    media: [
      {
        type: "image",
        src: centralPlantInteriorImage,
        alt: "A network of insulated pipes, valves, and gauges inside Rice's Central Plant.",
      },
      {
        type: "image",
        src: centralPlantTurbineImage,
        alt: "Close view of turbine equipment and connected lines inside the Central Plant.",
      },
      {
        type: "image",
        src: centralPlantDrawingImage,
        alt: "A technical turbine drawing displayed inside the Central Plant.",
      },
      {
        type: "image",
        src: centralPlantCogenerationImage,
        alt: "Diagram showing generators, gas and steam turbines, heat recovery, and cooling water in a cogeneration system.",
      },
    ],
    description: (
      <>
        <h2>Behind the scenes of campus</h2>
        <p>
          Rice's Central Plant houses part of the utility infrastructure that
          supports campus buildings. Its pipes, valves, turbines, and technical
          plans reveal the engineering systems working behind the scenes.
        </p>
        <p>
          Compare the machinery in the photographs with the drawing and
          cogeneration diagram to follow how large components form one system.
        </p>
      </>
    ),
    narrationText:
      "Rice's Central Plant houses part of the utility infrastructure that supports campus buildings. Its pipes, valves, turbines, and technical plans reveal the engineering systems working behind the scenes. Compare the machinery in the photographs with the drawing and cogeneration diagram to follow how large components form one system.",
  },
  {
    id: "rice-memorial-center",
    title: "Rice Memorial Center",
    // Approximate starting point. Adjust this coordinate after field testing.
    coordinates: { latitude: 29.717976659122446, longitude: -95.40205914364314 },
    discoveryRadiusMeters: 30,
    media: [
      {
        type: "image",
        src: rmcChausImage,
        alt: "Students gathering around tables inside Chaüs at the Rice Memorial Center.",
      },
      {
        type: "image",
        src: rmcPubImage,
        alt: "The Pub at Rice with tables, chairs, and illuminated signs.",
      },
      {
        type: "image",
        src: rmcWalkwayImage,
        alt: "Sunlit brick arches along a Rice Memorial Center walkway.",
      },
    ],
    description: (
      <>
        <h2>A hub for campus life</h2>
        <p>
          The Rice Memorial Center brings together gathering spaces, student
          traditions, and favorite stops such as Chaüs and the Pub at Rice.
        </p>
      </>
    ),
    narrationText:
      "The Rice Memorial Center brings together gathering spaces, student traditions, and favorite stops such as Chaus and the Pub at Rice.",
    activity: <ChausDrinkGame />,
  },
  {
    id: "oconnor-engineering",
    title: "O'Connor Engineering and Science Building",
    // Approximate starting point. Adjust this coordinate after field testing.
    coordinates: { latitude: 29.72015, longitude: -95.3991 },
    discoveryRadiusMeters: 20,
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
    narrationText:
      "O'Connor is a home for collaborative engineering and science, where ideas move from sketches to experiments and working prototypes.",
    activity: <EngineeringBridgeChallenge />,
  },
];

export const tourLocationsById: ReadonlyMap<string, TourLocation> = new Map(
  tourLocations.map((location) => [location.id, location]),
);
