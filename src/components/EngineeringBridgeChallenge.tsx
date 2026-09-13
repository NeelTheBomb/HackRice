import { useState } from "react";

type Blueprint = "beam" | "arch" | "truss";

const blueprints: readonly { id: Blueprint; label: string; symbol: string }[] = [
  { id: "beam", label: "Beam", symbol: "━" },
  { id: "arch", label: "Arch", symbol: "⌒" },
  { id: "truss", label: "Truss", symbol: "△△△" },
];

const results: Record<Blueprint, string> = {
  beam: "The beam buckled under the surprise load. Try redirecting the force.",
  arch: "The arch held briefly, but the deck shifted. One design is even more stable.",
  truss: "Load held! The triangles spread the force through the structure.",
};

export function EngineeringBridgeChallenge() {
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [testedBlueprint, setTestedBlueprint] = useState<Blueprint | null>(null);
  const result = testedBlueprint ? results[testedBlueprint] : "";
  const successful = testedBlueprint === "truss";

  function chooseBlueprint(nextBlueprint: Blueprint) {
    setBlueprint(nextBlueprint);
    setTestedBlueprint(null);
  }

  return (
    <section className="location-activity bridge-challenge" aria-labelledby="bridge-title">
      <p className="experience-kicker">Engineering challenge</p>
      <h2 id="bridge-title">Build it. Test it.</h2>
      <p>Choose a blueprint, then send a heavy load across your bridge.</p>

      <div
        className={`bridge-preview${successful ? " bridge-preview--success" : ""}`}
        data-blueprint={blueprint ?? "none"}
        aria-hidden="true"
      >
        <span className="bridge-preview__load">● ● ●</span>
        <span className="bridge-preview__structure">
          {blueprints.find((item) => item.id === blueprint)?.symbol ?? "· · ·"}
        </span>
        <span className="bridge-preview__ground">
          <span>▰</span>
          <span>▰</span>
        </span>
      </div>

      <div className="blueprint-picker" aria-label="Bridge blueprints">
        {blueprints.map((item) => (
          <button
            type="button"
            aria-label={`${item.label} blueprint`}
            aria-pressed={blueprint === item.id}
            key={item.id}
            onClick={() => chooseBlueprint(item.id)}
          >
            <span aria-hidden="true">{item.symbol}</span>
            {item.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="test-load-button"
        disabled={blueprint === null}
        onClick={() => blueprint && setTestedBlueprint(blueprint)}
      >
        Test load
      </button>

      <p
        aria-atomic="true"
        className={`experience-feedback${successful ? " experience-feedback--success" : ""}`}
        role="status"
      >
        {result}
      </p>
    </section>
  );
}
