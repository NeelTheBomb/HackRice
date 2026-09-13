import { useState } from "react";

interface President {
  name: string;
  term: string;
}

const presidents: readonly President[] = [
  { name: "Edgar Odell Lovett", term: "1908–1946" },
  { name: "William Vermillion Houston", term: "1946–1960" },
  { name: "Kenneth Sanborn Pitzer", term: "1961–1968" },
  { name: "Norman Hackerman", term: "1970–1985" },
  { name: "George Erik Rupp", term: "1985–1993" },
  { name: "S. Malcolm Gillis", term: "1993–2004" },
  { name: "David W. Leebron", term: "2004–2022" },
  { name: "Reginald DesRoches", term: "2022–present" },
];

const shuffledIndexes = [4, 0, 6, 2, 7, 1, 5, 3] as const;

export function FondrenPresidentSort() {
  const [nextPresident, setNextPresident] = useState(0);
  const [incorrectIndex, setIncorrectIndex] = useState<number>();
  const isComplete = nextPresident === presidents.length;

  function choosePresident(index: number) {
    if (index === nextPresident) {
      setNextPresident((current) => current + 1);
      setIncorrectIndex(undefined);
      return;
    }

    setIncorrectIndex(index);
  }

  function reset() {
    setNextPresident(0);
    setIncorrectIndex(undefined);
  }

  return (
    <section
      className="location-activity president-sort"
      aria-labelledby="president-sort-title"
    >
      <p className="experience-kicker">Fondren archives challenge</p>
      <h2 id="president-sort-title">Shelve Rice's presidents</h2>
      <p>Tap the books in order from the earliest Rice presidency to the newest.</p>

      <div className="president-sort__books" aria-label="Unsorted president books">
        {shuffledIndexes.map((index, position) => {
          const president = presidents[index];
          const isShelved = index < nextPresident;
          const isIncorrect = incorrectIndex === index;

          return (
            <button
              className={`president-book president-book--${(position % 4) + 1}${
                isIncorrect ? " president-book--incorrect" : ""
              }`}
              disabled={isShelved || isComplete}
              key={president.name}
              onClick={() => choosePresident(index)}
              type="button"
            >
              {president.name}
            </button>
          );
        })}
      </div>

      <div className="president-sort__shelf" aria-label="Presidents placed in order">
        {presidents.slice(0, nextPresident).map((president) => (
          <span className="shelved-book" key={president.name}>
            <strong>{president.name}</strong>
            <small>{president.term}</small>
          </span>
        ))}
      </div>

      <p className="experience-feedback" role="status" aria-live="polite">
        {isComplete
          ? "Shelf complete — all eight Rice presidents are in order!"
          : incorrectIndex !== undefined
            ? "Not quite — try an earlier presidency."
            : `${nextPresident} of ${presidents.length} books shelved`}
      </p>

      {isComplete ? (
        <button className="president-sort__reset" onClick={reset} type="button">
          Play again
        </button>
      ) : null}
    </section>
  );
}
