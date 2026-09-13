import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrackingStatus } from "../discovery/useTourTracking";
import { primeDiscoverySound } from "../audio/discoverySound";
import { StartTourPanel } from "./StartTourPanel";

vi.mock("../audio/discoverySound", () => ({
  primeDiscoverySound: vi.fn(),
}));

const primeSoundMock = vi.mocked(primeDiscoverySound);

beforeEach(() => {
  primeSoundMock.mockResolvedValue(undefined);
});

describe("StartTourPanel", () => {
  it("explains precise foreground location use before starting", () => {
    render(<StartTourPanel tourStarted={false} status="idle" onStart={vi.fn()} />);

    expect(screen.getByText(/precise location/i)).toHaveTextContent(/while this page is open/i);
    expect(screen.getByRole("button", { name: "Start Tour" })).toBeEnabled();
  });

  it("finishes priming discovery sound before starting the tour", async () => {
    let finishPriming: (() => void) | undefined;
    primeSoundMock.mockImplementation(
      () => new Promise<void>((resolve) => { finishPriming = resolve; }),
    );
    const onStart = vi.fn();
    render(<StartTourPanel tourStarted={false} status="idle" onStart={onStart} />);

    fireEvent.click(screen.getByRole("button", { name: "Start Tour" }));

    expect(primeSoundMock).toHaveBeenCalledOnce();
    expect(onStart).not.toHaveBeenCalled();

    await act(async () => finishPriming?.());
    await waitFor(() => expect(onStart).toHaveBeenCalledOnce());
  });

  it.each([
    ["idle", /ready to start location tracking/i],
    ["locating", /finding your location/i],
    ["tracking", /tracking your location/i],
    ["inaccurate", /improving location accuracy/i],
    ["denied", /location permission was denied/i],
    ["unavailable", /location is currently unavailable/i],
    ["timed-out", /location request timed out/i],
    ["unsupported", /browser does not support location tracking/i],
  ] satisfies ReadonlyArray<readonly [TrackingStatus, RegExp]>) (
    "renders the %s tracking status",
    (status, message) => {
      render(<StartTourPanel tourStarted status={status} onStart={vi.fn()} />);

      expect(screen.getByRole("status")).toHaveTextContent(message);
    },
  );
});
