import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "../App";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe("location and fallback routes", () => {
  it("renders the location title, carousel, and rich React description", () => {
    renderAt("/locations/fondren-library");

    expect(screen.getByRole("heading", { name: "Fondren Library", level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Fondren Library media" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /fondren library's arched facade/i })).toBeInTheDocument();
    expect(screen.getByText(/anchors research, study, and collaboration/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
  });

  it("returns home from the location page", async () => {
    const user = userEvent.setup();
    renderAt("/locations/chao-college");

    await user.click(screen.getByRole("button", { name: /back/i }));

    expect(screen.getByRole("heading", { name: "Campus Tour" })).toBeInTheDocument();
  });

  it("renders Chao's optional three-question activity", () => {
    renderAt("/locations/chao-college");

    expect(
      screen.getByRole("heading", { name: "Chao quick quiz" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("group")).toHaveLength(3);
  });

  it("gives immediate feedback for Chao quiz answers", async () => {
    const user = userEvent.setup();
    renderAt("/locations/chao-college");

    const collegeNumberQuestion = screen.getByRole("group", {
      name: /rice's 12th residential college/i,
    });
    await user.click(
      within(collegeNumberQuestion).getByRole("button", { name: "Yes" }),
    );
    expect(within(collegeNumberQuestion).getByRole("status")).toHaveTextContent(
      /correct/i,
    );

    const towerQuestion = screen.getByRole("group", {
      name: /only one residential tower/i,
    });
    await user.click(within(towerQuestion).getByRole("button", { name: "Yes" }));
    expect(within(towerQuestion).getByRole("status")).toHaveTextContent(
      /not quite.*two towers/i,
    );
  });

  it("lights up the RMC experience after visitors activate every zone", async () => {
    const user = userEvent.setup();
    renderAt("/locations/rice-memorial-center");

    const zones = [
      ["Food", /shared meal/i],
      ["Clubs", /student groups/i],
      ["Events", /performances and programs/i],
      ["Community", /unexpected conversations/i],
    ] as const;

    for (const [zone, message] of zones) {
      await user.click(screen.getByRole("button", { name: zone }));
      expect(screen.getByRole("status")).toHaveTextContent(message);
    }

    expect(screen.getByRole("status")).toHaveTextContent(/rmc is glowing/i);
  });

  it("lets visitors test and improve an O'Connor bridge design", async () => {
    const user = userEvent.setup();
    renderAt("/locations/oconnor-engineering");

    expect(screen.getByRole("status")).toBeEmptyDOMElement();

    await user.click(screen.getByRole("button", { name: /beam blueprint/i }));
    await user.click(screen.getByRole("button", { name: /test load/i }));
    expect(screen.getByRole("status")).toHaveTextContent(/buckled/i);

    await user.click(screen.getByRole("button", { name: /truss blueprint/i }));
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
    await user.click(screen.getByRole("button", { name: /test load/i }));
    expect(screen.getByRole("status")).toHaveTextContent(/load held/i);
  });

  it.each([
    "/locations/not-in-the-catalog",
    "/a-route-that-does-not-exist",
  ])("renders the not-found state for %s", (path) => {
    renderAt(path);

    expect(screen.getByRole("heading", { name: "Location not found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /return home/i })).toHaveAttribute("href", "/");
  });
});
