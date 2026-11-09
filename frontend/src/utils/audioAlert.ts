/**
 * Synthesizes and plays a 4-second executive notification chime alert
 * using the Web Audio API without requiring any external audio files.
 */
export function play4SecondNotificationSound(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }

    try {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (!AudioCtxClass) {
        resolve();
        return;
      }

      const audioCtx = new AudioCtxClass();

      // Ensure audio context is running (browser autoplay policies)
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;
      const totalDuration = 4.0; // Exactly 4.0 seconds as specified

      // Master gain node
      const masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.connect(audioCtx.destination);

      // Smooth master envelope spanning the 4 seconds
      masterGain.gain.linearRampToValueAtTime(0.25, now + 0.1);
      masterGain.gain.setValueAtTime(0.25, now + 3.2);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + totalDuration);

      // Chime note frequencies: D5 (587.33Hz), F#5 (739.99Hz), A5 (880.00Hz), D6 (1174.66Hz)
      const frequencies = [587.33, 739.99, 880.00, 1174.66];
      // Pulse timings across the 4 seconds: 0.0s, 0.7s, 1.4s, 2.1s, 2.8s
      const pulses = [0.0, 0.7, 1.4, 2.1, 2.8];

      pulses.forEach((pulseOffset, pulseIdx) => {
        const pulseTime = now + pulseOffset;
        // Ascending harmonic chime across pulses
        const baseFreq = frequencies[pulseIdx % frequencies.length];

        // Fundamental oscillator (warm sine wave)
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(baseFreq, pulseTime);

        // Overtone oscillator (shimmer triangle wave)
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(baseFreq * 2, pulseTime);

        // Pulse gain envelope: Quick bell-strike attack followed by soft decay
        gain1.gain.setValueAtTime(0.0001, pulseTime);
        gain1.gain.linearRampToValueAtTime(0.35, pulseTime + 0.04);
        gain1.gain.exponentialRampToValueAtTime(0.001, pulseTime + 0.65);

        gain2.gain.setValueAtTime(0.0001, pulseTime);
        gain2.gain.linearRampToValueAtTime(0.12, pulseTime + 0.03);
        gain2.gain.exponentialRampToValueAtTime(0.001, pulseTime + 0.55);

        osc1.connect(gain1);
        gain1.connect(masterGain);

        osc2.connect(gain2);
        gain2.connect(masterGain);

        osc1.start(pulseTime);
        osc1.stop(pulseTime + 0.7);

        osc2.start(pulseTime);
        osc2.stop(pulseTime + 0.7);
      });

      // Cleanup audio context after 4.1 seconds
      setTimeout(() => {
        try {
          audioCtx.close();
        } catch {
          // ignore
        }
        resolve();
      }, 4100);
    } catch {
      resolve();
    }
  });
}

