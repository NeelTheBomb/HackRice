import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { TourProvider, useTour } from "./TourProvider";

function TourStateConsumer() {
  const { discoveredIds, markDiscovered, startTour, tourStarted } = useTour();

  return (
    <>
      <output data-testid="discoveries">{[...discoveredIds].join(",")}</output>
      <output data-testid="started">{String(tourStarted)}</output>
      <button type="button" onClick={startTour}>
        Start tour
      </button>
      <button type="button" onClick={() => markDiscovered("fondren-library")}>
        Discover Fondren
      </button>
    </>
  );
}

afterEach(() => {
  document.cookie = "campusTourProgress=; Max-Age=0; Path=/";
});

describe("TourProvider", () => {
  it("loads persisted discoveries while requiring a new tour start", () => {
    document.cookie =
      "campusTourProgress=%5B%22chao-college%22%5D; Path=/";

    render(
      <TourProvider>
        <TourStateConsumer />
      </TourProvider>,
    );

    expect(screen.getByTestId("discoveries")).toHaveTextContent("chao-college");
    expect(screen.getByTestId("started")).toHaveTextContent("false");
  });

  it("starts the tour and persists a newly discovered location once", async () => {
    const user = userEvent.setup();
    document.cookie =
      "campusTourProgress=%5B%22chao-college%22%5D; Path=/";

    render(
      <TourProvider>
        <TourStateConsumer />
      </TourProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Start tour" }));
    await user.click(screen.getByRole("button", { name: "Discover Fondren" }));
    await user.click(screen.getByRole("button", { name: "Discover Fondren" }));

    expect(screen.getByTestId("started")).toHaveTextContent("true");
    expect(screen.getByTestId("discoveries")).toHaveTextContent(
      "chao-college,fondren-library",
    );
    expect(document.cookie).toContain(
      "campusTourProgress=%5B%22chao-college%22%2C%22fondren-library%22%5D",
    );
  });
});
