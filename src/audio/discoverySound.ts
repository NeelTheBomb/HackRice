let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (audioContext !== null) return audioContext;

  const AudioContextClass =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;

  audioContext = new AudioContextClass();
  return audioContext;
}

export async function primeDiscoverySound(): Promise<void> {
  try {
    const context = getAudioContext();
    if (context && context.state !== "running") {
      await context.resume();
    }
  } catch {
    // Audio is an enhancement; browser policy or missing APIs must not block the tour.
  }
}

export async function playDiscoverySound(): Promise<void> {
  try {
    await primeDiscoverySound();
    const context = getAudioContext();
    if (!context) return;

    const startTime = context.currentTime;
    const tones = [
      { frequency: 523.25, start: startTime, stop: startTime + 0.14 },
      { frequency: 659.25, start: startTime + 0.12, stop: startTime + 0.3 },
    ];

    for (const tone of tones) {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(tone.frequency, tone.start);
      gain.gain.setValueAtTime(0.045, tone.start);
      gain.gain.exponentialRampToValueAtTime(0.0001, tone.stop);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(tone.start);
      oscillator.stop(tone.stop);
    }
  } catch {
    // Discovery continues silently if playback is unavailable or rejected.
  }
}
