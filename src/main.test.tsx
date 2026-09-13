import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("./App", async () => {
  const { useLocation } = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );

  return {
    default: function RouteProbe() {
      const location = useLocation();
      return <p>Active route: {location.pathname}</p>;
    },
  };
});

describe("application router", () => {
  afterEach(() => {
    window.history.replaceState(null, "", "/");
    document.body.replaceChildren();
  });

  it("reads location routes from the URL hash for static hosting", async () => {
    window.history.replaceState(
      null,
      "",
      "/unknown-repository/#/locations/chao-college",
    );
    document.body.innerHTML = '<div id="root"></div>';

    await import("./main");

    expect(
      await screen.findByText("Active route: /locations/chao-college"),
    ).toBeInTheDocument();
  });
});
