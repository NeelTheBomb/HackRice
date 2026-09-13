import { useState } from "react";

const zones = [
  { id: "food", label: "Food", icon: "🍜", message: "A shared meal turns a stop into a gathering." },
  { id: "clubs", label: "Clubs", icon: "🎨", message: "Student groups give every interest a place to grow." },
  { id: "events", label: "Events", icon: "🎤", message: "Performances and programs fill the center with energy." },
  { id: "community", label: "Community", icon: "🦉", message: "Unexpected conversations are the heart of campus life." },
] as const;

export function RmcExperience() {
  const [activeZones, setActiveZones] = useState<ReadonlySet<string>>(new Set());
  const [message, setMessage] = useState("Choose a zone to bring the center to life.");
  const complete = activeZones.size === zones.length;

  function activateZone(id: string, nextMessage: string) {
    setActiveZones((current) => new Set(current).add(id));
    setMessage(nextMessage);
  }

  return (
    <section className="location-activity rmc-experience" aria-labelledby="rmc-experience-title">
      <p className="experience-kicker">Campus life challenge</p>
      <h2 id="rmc-experience-title">Light up the RMC</h2>
      <p>Tap every zone to wake up the student center.</p>

      <div className={`rmc-stage${complete ? " rmc-stage--complete" : ""}`}>
        {zones.map((zone) => {
          const active = activeZones.has(zone.id);
          return (
            <button
              type="button"
              className="rmc-zone"
              aria-label={zone.label}
              aria-pressed={active}
              key={zone.id}
              onClick={() => activateZone(zone.id, zone.message)}
            >
              <span aria-hidden="true">{zone.icon}</span>
              <strong>{zone.label}</strong>
            </button>
          );
        })}
      </div>

      <p className="experience-feedback" role="status">
        <span>{message}</span>
        {complete ? (
          <strong className="experience-celebration">
            RMC is glowing! You brought every corner of campus life together.
          </strong>
        ) : null}
      </p>
    </section>
  );
}
