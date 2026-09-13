import { useState } from "react";
import owlImage from "../assets/barn-owl-garden.jpg";

const hatNames = ["Graduation cap", "Cowboy hat", "Party hat"] as const;
const jacketNames = ["Varsity jacket", "Raincoat", "Blazer"] as const;

function Hat({ index }: { index: number }) {
  if (index === 1) {
    return (
      <svg viewBox="0 0 200 110" aria-hidden="true">
        <ellipse cx="100" cy="82" rx="88" ry="20" fill="#9a5a2e" stroke="#4b2b17" strokeWidth="7" />
        <path d="M55 75 Q60 15 100 20 Q140 15 145 75Z" fill="#b96f3c" stroke="#4b2b17" strokeWidth="7" />
        <path d="M67 54 Q100 68 133 54" fill="none" stroke="#f5d0a9" strokeWidth="6" />
      </svg>
    );
  }

  if (index === 2) {
    return (
      <svg viewBox="0 0 200 120" aria-hidden="true">
        <path d="M100 10 L42 98 L158 98Z" fill="#e11d48" stroke="#881337" strokeWidth="7" />
        <path d="M67 60 L132 60" stroke="#facc15" strokeWidth="10" />
        <circle cx="100" cy="12" r="12" fill="#38bdf8" />
        <ellipse cx="100" cy="98" rx="70" ry="13" fill="#fff" stroke="#881337" strokeWidth="6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 200 110" aria-hidden="true">
      <path d="M18 42 L100 8 L182 42 L100 75Z" fill="#00205b" stroke="#071a3d" strokeWidth="7" />
      <path d="M55 58 V82 H145 V58" fill="#003b71" stroke="#071a3d" strokeWidth="7" />
      <path d="M177 43 V86" stroke="#e9b949" strokeWidth="6" />
      <circle cx="177" cy="92" r="9" fill="#e9b949" />
    </svg>
  );
}

function Jacket({ index }: { index: number }) {
  if (index === 1) {
    return (
      <svg viewBox="0 0 220 260" aria-hidden="true">
        <path d="M72 40 Q110 4 148 40 L178 68 L202 220 L154 231 L142 104 L142 246 H78 V104 L66 231 L18 220 L42 68Z" fill="#facc15" stroke="#854d0e" strokeWidth="8" />
        <path d="M78 45 Q110 76 142 45" fill="none" stroke="#fff7b2" strokeWidth="10" />
        <path d="M110 74 V244" stroke="#854d0e" strokeWidth="6" />
        <circle cx="121" cy="112" r="5" fill="#854d0e" />
        <circle cx="121" cy="146" r="5" fill="#854d0e" />
      </svg>
    );
  }

  if (index === 2) {
    return (
      <svg viewBox="0 0 220 260" aria-hidden="true">
        <path d="M72 35 L110 54 L148 35 L180 68 L204 213 L158 226 L144 108 L144 246 H76 V108 L62 226 L16 213 L40 68Z" fill="#1e3a8a" stroke="#0f172a" strokeWidth="8" />
        <path d="M72 35 L110 122 L110 54Z M148 35 L110 122 L110 54Z" fill="#e2e8f0" stroke="#0f172a" strokeWidth="6" />
        <path d="M110 122 V246" stroke="#0f172a" strokeWidth="6" />
        <circle cx="122" cy="153" r="5" fill="#e9b949" />
        <circle cx="122" cy="188" r="5" fill="#e9b949" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 220 260" aria-hidden="true">
      <path d="M70 42 L110 58 L150 42 L182 70 L204 216 L158 228 L144 110 L144 246 H76 V110 L62 228 L16 216 L38 70Z" fill="#2563eb" stroke="#172554" strokeWidth="8" />
      <path d="M72 43 V244 M148 43 V244" stroke="#fff" strokeWidth="11" />
      <path d="M76 78 H144 M76 220 H144" stroke="#e9b949" strokeWidth="9" />
      <path d="M91 132 Q110 116 129 132 V171 Q110 186 91 171Z" fill="#e9b949" stroke="#172554" strokeWidth="5" />
      <text x="110" y="159" textAnchor="middle" fontSize="36" fontWeight="800" fill="#00205b">R</text>
    </svg>
  );
}

export function OwlDressUp() {
  const [hat, setHat] = useState(0);
  const [jacket, setJacket] = useState(0);

  return (
    <section className="location-activity owl-dress-up" aria-labelledby="owl-dress-up-title">
      <p className="experience-kicker">Owl outfit studio</p>
      <h2 id="owl-dress-up-title">Dress the owl</h2>
      <p>Tap the hat or jacket to change the owl's look.</p>

      <div className="owl-dress-up__stage">
        <img src={owlImage} alt="The bronze barn owl statue ready to be dressed" />
        <button
          className="owl-dress-up__hat"
          type="button"
          aria-label={`Change hat. Current hat: ${hatNames[hat]}`}
          onClick={() => setHat((current) => (current + 1) % hatNames.length)}
        >
          <Hat index={hat} />
        </button>
        <button
          className="owl-dress-up__jacket"
          type="button"
          aria-label={`Change jacket. Current jacket: ${jacketNames[jacket]}`}
          onClick={() => setJacket((current) => (current + 1) % jacketNames.length)}
        >
          <Jacket index={jacket} />
        </button>
      </div>

      <p className="owl-dress-up__labels" aria-live="polite">
        <span>{hatNames[hat]}</span>
        <span>{jacketNames[jacket]}</span>
      </p>
    </section>
  );
}
