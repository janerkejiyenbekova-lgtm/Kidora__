// Sound engine (WebAudio, synthesized — no audio files needed) and confetti.
let ctx = null;
let enabled = true;

export function setSfx(on) {
  enabled = on;
}

function audio() {
  if (typeof window === 'undefined') return null;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone({ f = 440, slide = null, dur = 0.12, type = 'sine', vol = 0.18, delay = 0 } = {}) {
  if (!enabled) return;
  const c = audio();
  if (!c) return;
  const t0 = c.currentTime + delay;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f, t0);
  if (slide) o.frequency.exponentialRampToValueAtTime(slide, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(c.destination);
  o.start(t0);
  o.stop(t0 + dur + 0.02);
}

export const sfx = {
  click: () => tone({ f: 880, slide: 660, dur: 0.07, type: 'triangle', vol: 0.12 }),
  hover: () => tone({ f: 1400, dur: 0.03, vol: 0.035 }),
  pop: () => tone({ f: 520, slide: 980, dur: 0.14, vol: 0.18 }),
  flip: () => tone({ f: 300, slide: 620, dur: 0.12, vol: 0.12 }),
  match: () => {
    tone({ f: 660, dur: 0.12, type: 'triangle', vol: 0.15 });
    tone({ f: 990, dur: 0.18, type: 'triangle', vol: 0.15, delay: 0.1 });
  },
  success: () => [523, 659, 784, 1047].forEach((f, i) => tone({ f, dur: 0.18, type: 'triangle', vol: 0.16, delay: i * 0.09 })),
  levelUp: () => [392, 523, 659, 784, 1047, 1319].forEach((f, i) => tone({ f, dur: 0.14, type: 'triangle', vol: 0.14, delay: i * 0.07 })),
  coin: () => {
    tone({ f: 988, dur: 0.08, type: 'square', vol: 0.07 });
    tone({ f: 1319, dur: 0.22, type: 'square', vol: 0.07, delay: 0.08 });
  },
  ding: () => tone({ f: 1200, dur: 0.25, vol: 0.14 }),
  wrong: () => tone({ f: 220, slide: 150, dur: 0.25, type: 'sawtooth', vol: 0.09 }),
  mole: () => tone({ f: 700, slide: 1200, dur: 0.1, type: 'triangle', vol: 0.16 }),
  whoosh: () => tone({ f: 200, slide: 900, dur: 0.25, vol: 0.05 }),
  tick: () => tone({ f: 1000, dur: 0.04, type: 'square', vol: 0.05 }),
};

export function burst(n = 70) {
  if (typeof document === 'undefined') return;
  const colors = ['#FFC93C', '#ff6b6b', '#4dabf7', '#51cf66', '#cc5de8', '#ff922b'];
  for (let i = 0; i < n; i++) {
    const el = document.createElement('i');
    el.className = 'confetti';
    el.style.left = Math.random() * 100 + 'vw';
    el.style.background = colors[i % colors.length];
    el.style.animationDelay = Math.random() * 0.4 + 's';
    el.style.animationDuration = 1.6 + Math.random() * 1.2 + 's';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }
}
