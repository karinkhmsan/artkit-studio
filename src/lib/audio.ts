let audioContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    audioContext = new Ctor();
  }
  return audioContext;
}

function tone(
  context: AudioContext,
  frequency: number,
  start: number,
  duration: number,
  gainValue: number,
  type: OscillatorType = "sine",
): void {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, context.currentTime + start);
  gain.gain.setValueAtTime(0.0001, context.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(gainValue, context.currentTime + start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + start + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(context.currentTime + start);
  oscillator.stop(context.currentTime + start + duration + 0.05);
}

/**
 * Play a short, pleasant chime generated entirely with the Web Audio API.
 * `warn` is a single soft ping for the 5-second warning; `end` is a two-note
 * resolve for when a session finishes. No external audio files are required.
 */
export function playChime(kind: "warn" | "end"): void {
  const context = getContext();
  if (!context) return;
  if (context.state === "suspended") void context.resume();
  if (kind === "warn") {
    tone(context, 880, 0, 0.16, 0.05, "sine");
  } else {
    tone(context, 659.25, 0, 0.16, 0.07, "sine");
    tone(context, 987.77, 0.16, 0.26, 0.06, "sine");
  }
}

/** Call this inside a click handler so the browser allows sound later. */
export function primeAudio(): void {
  const context = getContext();
  if (context && context.state === "suspended") void context.resume();
}
