import discoverySoundUrl from "../assets/discovery-sound.mp3";

let discoveryAudio: HTMLAudioElement | null = null;
let isPrimed = false;

function getDiscoveryAudio(): HTMLAudioElement | null {
  if (discoveryAudio) return discoveryAudio;
  if (typeof Audio === "undefined") return null;

  discoveryAudio = new Audio(discoverySoundUrl);
  discoveryAudio.preload = "auto";
  return discoveryAudio;
}

export async function primeDiscoverySound(): Promise<void> {
  if (isPrimed) return;

  const audio = getDiscoveryAudio();
  if (!audio) return;

  try {
    audio.muted = true;
    await audio.play();
    isPrimed = true;
  } catch {
    // Audio is an enhancement; browser policy must not block the tour.
  } finally {
    audio.pause();
    audio.currentTime = 0;
    audio.muted = false;
  }
}

export async function playDiscoverySound(): Promise<void> {
  const audio = getDiscoveryAudio();
  if (!audio) return;

  try {
    audio.pause();
    audio.currentTime = 0;
    await audio.play();
  } catch {
    // Discovery continues silently if playback is unavailable or rejected.
  }
}
