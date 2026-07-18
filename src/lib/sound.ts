export type UISound = "send" | "typing" | "seen" | "recall" | "presence" | "alert" | "calm";

let audioContext: AudioContext | null = null;

function getAudioContext() {
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return null;
  if (!audioContext) audioContext = new AudioCtor();
  return audioContext;
}

function playTone(ctx: AudioContext, frequency: number, start: number, duration: number, gain = 0.035, type: OscillatorType = "sine") {
  const oscillator = ctx.createOscillator();
  const volume = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  volume.gain.setValueAtTime(0.0001, start);
  volume.gain.exponentialRampToValueAtTime(gain, start + 0.012);
  volume.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(volume);
  volume.connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

export async function playUISound(sound: UISound) {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") await ctx.resume();

  const now = ctx.currentTime;

  switch (sound) {
    case "send":
      playTone(ctx, 640, now, 0.07, 0.028, "triangle");
      playTone(ctx, 880, now + 0.045, 0.09, 0.025, "triangle");
      break;
    case "typing":
      playTone(ctx, 360, now, 0.035, 0.018, "sine");
      playTone(ctx, 390, now + 0.075, 0.035, 0.015, "sine");
      playTone(ctx, 420, now + 0.15, 0.035, 0.013, "sine");
      break;
    case "seen":
      playTone(ctx, 920, now, 0.08, 0.026, "sine");
      playTone(ctx, 520, now + 0.07, 0.12, 0.022, "sine");
      break;
    case "recall":
      playTone(ctx, 260, now, 0.11, 0.034, "sawtooth");
      playTone(ctx, 180, now + 0.08, 0.16, 0.026, "sawtooth");
      break;
    case "presence":
      playTone(ctx, 720, now, 0.05, 0.019, "square");
      break;
    case "alert":
      playTone(ctx, 120, now, 0.16, 0.035, "sine");
      playTone(ctx, 94, now + 0.13, 0.22, 0.032, "sine");
      break;
    case "calm":
      playTone(ctx, 432, now, 0.22, 0.022, "sine");
      playTone(ctx, 540, now + 0.16, 0.24, 0.018, "sine");
      break;
  }
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
