import { afterEach, describe, expect, it, vi } from "vitest";

interface AudioHarness {
  AudioContext: ReturnType<typeof vi.fn>;
  context: {
    state: AudioContextState;
    currentTime: number;
    destination: object;
    resume: ReturnType<typeof vi.fn>;
    createOscillator: ReturnType<typeof vi.fn>;
    createGain: ReturnType<typeof vi.fn>;
  };
  oscillators: Array<{
    frequency: { setValueAtTime: ReturnType<typeof vi.fn> };
    connect: ReturnType<typeof vi.fn>;
    start: ReturnType<typeof vi.fn>;
    stop: ReturnType<typeof vi.fn>;
  }>;
  gains: Array<{
    gain: {
      setValueAtTime: ReturnType<typeof vi.fn>;
      exponentialRampToValueAtTime: ReturnType<typeof vi.fn>;
    };
    connect: ReturnType<typeof vi.fn>;
  }>;
}

function installAudioContext(state: AudioContextState = "suspended"): AudioHarness {
  const oscillators: AudioHarness["oscillators"] = [];
  const gains: AudioHarness["gains"] = [];
  const context: AudioHarness["context"] = {
    state,
    currentTime: 10,
    destination: {},
    resume: vi.fn().mockResolvedValue(undefined),
    createOscillator: vi.fn(() => {
      const oscillator = {
        frequency: { setValueAtTime: vi.fn() },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      };
      oscillators.push(oscillator);
      return oscillator;
    }),
    createGain: vi.fn(() => {
      const gain = {
        gain: {
          setValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
      };
      gains.push(gain);
      return gain;
    }),
  };
  const AudioContext = vi.fn(function AudioContextMock() {
    return context;
  });
  Object.defineProperty(window, "AudioContext", {
    configurable: true,
    value: AudioContext,
  });
  return { AudioContext, context, oscillators, gains };
}

afterEach(() => {
  vi.resetModules();
  Object.defineProperty(window, "AudioContext", {
    configurable: true,
    value: undefined,
  });
});

describe("discovery sound", () => {
  it("primes one module-level audio context and resumes it", async () => {
    const audio = installAudioContext();
    const { primeDiscoverySound } = await import("./discoverySound");

    await primeDiscoverySound();
    await primeDiscoverySound();

    expect(audio.AudioContext).toHaveBeenCalledTimes(1);
    expect(audio.context.resume).toHaveBeenCalledTimes(2);
  });

  it("plays a brief low-volume two-tone oscillator chime", async () => {
    const audio = installAudioContext("running");
    const { playDiscoverySound } = await import("./discoverySound");

    await playDiscoverySound();

    expect(audio.context.createOscillator).toHaveBeenCalledTimes(2);
    expect(audio.oscillators[0].frequency.setValueAtTime).toHaveBeenCalledWith(
      expect.any(Number),
      10,
    );
    expect(audio.oscillators[1].frequency.setValueAtTime).toHaveBeenCalledWith(
      expect.any(Number),
      expect.any(Number),
    );
    const firstStart = audio.oscillators[0].start.mock.calls[0][0] as number;
    const secondStart = audio.oscillators[1].start.mock.calls[0][0] as number;
    const finalStop = audio.oscillators[1].stop.mock.calls[0][0] as number;
    expect(secondStart).toBeGreaterThan(firstStart);
    expect(finalStop - firstStart).toBeLessThanOrEqual(0.5);
    expect(audio.gains[0].gain.setValueAtTime).toHaveBeenCalledWith(
      expect.toSatisfy((volume: number) => volume > 0 && volume <= 0.1),
      firstStart,
    );
  });

  it("resolves when Web Audio is unavailable", async () => {
    const { playDiscoverySound, primeDiscoverySound } = await import("./discoverySound");

    await expect(primeDiscoverySound()).resolves.toBeUndefined();
    await expect(playDiscoverySound()).resolves.toBeUndefined();
  });

  it("resolves when an audio operation rejects", async () => {
    const audio = installAudioContext();
    audio.context.resume.mockRejectedValue(new Error("audio blocked"));
    const { playDiscoverySound, primeDiscoverySound } = await import("./discoverySound");

    await expect(primeDiscoverySound()).resolves.toBeUndefined();
    await expect(playDiscoverySound()).resolves.toBeUndefined();
  });
});
