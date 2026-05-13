let audioCtx = null;

const getCtx = () => {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
};

const playTone = (freq, duration, type = 'sine', volume = 0.3) => {
  try {
    const ctx  = getCtx();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {}
};

export const playCompletionSound = () => {
  playTone(523.25, 0.15, 'sine', 0.25);
  setTimeout(() => playTone(659.25, 0.15, 'sine', 0.25), 150);
  setTimeout(() => playTone(783.99, 0.3,  'sine', 0.3),  300);
};

export const playClickSound = () => {
  playTone(440, 0.05, 'sine', 0.1);
};

export const playStartSound = () => {
  playTone(392, 0.1, 'sine', 0.15);
  setTimeout(() => playTone(523.25, 0.2, 'sine', 0.2), 100);
};
