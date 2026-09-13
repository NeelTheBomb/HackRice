import { useState } from "react";

const ingredients = [
  { id: "espresso", label: "Espresso shot", icon: "☕" },
  { id: "milk", label: "Cup of milk", icon: "🥛" },
  { id: "ice", label: "Ice", icon: "🧊" },
  { id: "vanilla", label: "Vanilla syrup", icon: "🌼" },
  { id: "tea", label: "Tea", icon: "🍵" },
  { id: "lemon", label: "Lemon", icon: "🍋" },
] as const;

type IngredientId = (typeof ingredients)[number]["id"];
type Result = "success" | "missing" | "extra" | null;

const recipe: readonly IngredientId[] = ["espresso", "milk", "ice", "vanilla"];

export function ChausDrinkGame() {
  const [selected, setSelected] = useState<IngredientId[]>([]);
  const [result, setResult] = useState<Result>(null);

  function toggleIngredient(id: IngredientId) {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
    setResult(null);
  }

  function mixDrink() {
    const hasExtra = selected.some((item) => !recipe.includes(item));
    const hasEveryIngredient = recipe.every((item) => selected.includes(item));

    setResult(hasExtra ? "extra" : hasEveryIngredient ? "success" : "missing");
  }

  function resetDrink() {
    setSelected([]);
    setResult(null);
  }

  const feedback =
    result === "success"
      ? "Perfect! You made a vanilla frappy."
      : result === "extra"
        ? "Something in that cup does not belong. Remove it and try again."
        : result === "missing"
          ? "Almost there—your frappy is missing an ingredient."
          : `${selected.length} ingredient${selected.length === 1 ? "" : "s"} added`;

  return (
    <section className="location-activity chaus-game" aria-labelledby="chaus-game-title">
      <p className="experience-kicker">Chaüs drink lab</p>
      <h2 id="chaus-game-title">Make a vanilla frappy</h2>
      <p>Add the right ingredients to the cup, then mix your drink.</p>

      <div className="chaus-game__workspace">
        <div
          className={`chaus-cup${result === "success" ? " chaus-cup--mixing" : ""}`}
          aria-label={`Cup with ${selected.length} ingredients`}
        >
          <span className="chaus-cup__straw" aria-hidden="true" />
          <span
            className="chaus-cup__drink"
            style={{ height: `${Math.min(20 + selected.length * 14, 88)}%` }}
            aria-hidden="true"
          />
          {selected.includes("ice") ? (
            <span className="chaus-cup__ice" aria-hidden="true">◇ ◇</span>
          ) : null}
          {result === "success" ? (
            <span className="chaus-cup__swirl" aria-hidden="true">✦</span>
          ) : null}
        </div>

        <div className="chaus-ingredients" aria-label="Drink ingredients">
          {ingredients.map((ingredient) => {
            const isSelected = selected.includes(ingredient.id);
            return (
              <button
                type="button"
                aria-pressed={isSelected}
                key={ingredient.id}
                onClick={() => toggleIngredient(ingredient.id)}
              >
                <span aria-hidden="true">{ingredient.icon}</span>
                {ingredient.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="chaus-game__actions">
        <button type="button" className="chaus-game__mix" onClick={mixDrink}>
          Mix drink
        </button>
        <button type="button" className="chaus-game__reset" onClick={resetDrink}>
          Reset
        </button>
      </div>

      <p
        className={`experience-feedback${result === "success" ? " experience-feedback--success" : ""}`}
        role="status"
        aria-live="polite"
      >
        {feedback}
      </p>
    </section>
  );
}
