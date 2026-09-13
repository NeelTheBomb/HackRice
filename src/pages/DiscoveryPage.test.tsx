import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StrictMode } from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import { playDiscoverySound } from "../audio/discoverySound";

vi.mock("../audio/discoverySound", () => ({
  playDiscoverySound: vi.fn(),
}));

const playDiscoverySoundMock = vi.mocked(playDiscoverySound);

function renderAt(path: string) {
  return render(
    <StrictMode>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </StrictMode>,
  );
}

beforeEach(() => {
  playDiscoverySoundMock.mockResolvedValue(undefined);
});

describe("discovery route", () => {
  it("announces a valid discovery and plays its sound once", async () => {
    renderAt("/discovered/chao-college");

    expect(screen.getByText("New location discovered!")).toBeInTheDocument();
    await waitFor(() => expect(playDiscoverySoundMock).toHaveBeenCalledOnce());
  });

  it.each([
    ["tap", async (user: ReturnType<typeof userEvent.setup>, button: HTMLElement) => user.click(button)],
    ["Enter", async (user: ReturnType<typeof userEvent.setup>, button: HTMLElement) => {
      button.focus();
      await user.keyboard("{Enter}");
    }],
    ["Space", async (user: ReturnType<typeof userEvent.setup>, button: HTMLElement) => {
      button.focus();
      await user.keyboard(" ");
    }],
  ])("opens the location after %s activation", async (_method, activate) => {
    const user = userEvent.setup();
    renderAt("/discovered/chao-college");

    const interstitial = screen.getByRole("button", { name: /new location discovered/i });
    await activate(user, interstitial);

    expect(screen.getByRole("heading", { name: "Chao College", level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
  });

  it("renders a not-found state for an invalid location ID", () => {
    renderAt("/discovered/not-in-the-catalog");

    expect(screen.getByRole("heading", { name: "Location not found" })).toBeInTheDocument();
    expect(playDiscoverySoundMock).not.toHaveBeenCalled();
  });
});
