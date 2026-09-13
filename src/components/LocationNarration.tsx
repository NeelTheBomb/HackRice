import { useEffect, useRef, useState } from "react";
import {
  ELEVENLABS_API_KEY,
  ELEVENLABS_MODEL_ID,
  ELEVENLABS_VOICE_ID,
} from "../config/elevenLabs";

type NarrationState = "idle" | "loading" | "playing" | "error";

const audioCache = new Map<string, string>();

async function createNarration(text: string): Promise<string> {
  const cachedUrl = audioCache.get(text);
  if (cachedUrl) return cachedUrl;

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(ELEVENLABS_VOICE_ID)}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: ELEVENLABS_MODEL_ID,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`ElevenLabs request failed with status ${response.status}`);
  }

  const audioUrl = URL.createObjectURL(await response.blob());
  audioCache.set(text, audioUrl);
  return audioUrl;
}

interface LocationNarrationProps {
  text: string;
}

export function LocationNarration({ text }: LocationNarrationProps) {
  const [state, setState] = useState<NarrationState>("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(
    () => () => {
      audioRef.current?.pause();
    },
    [],
  );

  async function toggleNarration() {
    if (state === "playing") {
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0;
      setState("idle");
      return;
    }

    setState("loading");

    try {
      const audioUrl = await createNarration(text);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.addEventListener("ended", () => setState("idle"), { once: true });
      await audio.play();
      setState("playing");
    } catch {
      setState("error");
    }
  }

  const buttonText =
    state === "loading" ? "Creating audio…" : state === "playing" ? "Stop narration" : "Listen";

  return (
    <div className="location-narration">
      <button type="button" disabled={state === "loading"} onClick={toggleNarration}>
        <span aria-hidden="true">{state === "playing" ? "■" : "▶"}</span>
        {buttonText}
      </button>
      {state === "error" ? (
        <p role="status">Narration is unavailable right now. Please try again.</p>
      ) : null}
    </div>
  );
}
