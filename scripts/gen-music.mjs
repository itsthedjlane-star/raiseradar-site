// gen-music.mjs — procedural 20s soundtrack for the RaiseRadar trailer.
// Pure Node, zero dependencies. Writes public/music.wav (44.1kHz, 16-bit stereo).
//
// Style: uplifting, "snappy" electronic. 120 BPM (beat = 0.5s, bar = 2s, 10 bars).
// Energy map is aligned to the video's cut points:
//   0-2s   intro pad + arp (no drums)
//   2-8s   groove builds in (kick, bass, hats)
//   8-16s  full drop — the data-feed centerpiece lands on the downbeat at 8s
//   16-18s drums drop out, noise riser builds tension
//   18s    crash + big major stab — hits exactly on the CTA end card
//   18-20s resolve
//
// Chord progression (vi-IV-I-V in C major, one chord per bar):
//   Am  F  C  G  Am  F  C  G  Am  C

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SR = 44100;
const DURATION = 20.0;
const N = Math.floor(SR * DURATION);
const BPM = 120;
const BEAT = 60 / BPM; // 0.5s
const BAR = BEAT * 4; // 2s

const L = new Float32Array(N);
const R = new Float32Array(N);

const mtof = (m) => 440 * 2 ** ((m - 69) / 12);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

// ---- oscillators -------------------------------------------------------
const sine = (ph) => Math.sin(ph);
const saw = (ph) => {
  const f = (ph / (2 * Math.PI)) % 1;
  return (f < 0 ? f + 1 : f) * 2 - 1;
};
const tri = (ph) => 2 * Math.abs(saw(ph)) - 1;

// ---- envelopes ---------------------------------------------------------
// Percussive pluck: fast attack, exponential decay across the note.
const pluckEnv = (t, dur, atk, decay) => {
  if (t < 0 || t > dur) return 0;
  const a = t < atk ? t / atk : 1;
  return a * Math.exp(-(t) * decay);
};
// Sustained pad: soft attack, gentle release near the end.
const padEnv = (t, dur, atk, rel) => {
  if (t < 0 || t > dur) return 0;
  if (t < atk) return t / atk;
  if (t > dur - rel) return Math.max(0, (dur - t) / rel);
  return 1;
};

// ---- one-pole low-pass (for taming saws) -------------------------------
function lowpass(buf, cutoff) {
  const dt = 1 / SR;
  const rc = 1 / (2 * Math.PI * cutoff);
  const alpha = dt / (rc + dt);
  let y = 0;
  for (let i = 0; i < buf.length; i++) {
    y += alpha * (buf[i] - y);
    buf[i] = y;
  }
}

// ---- note renderers ----------------------------------------------------
// Add a fixed-frequency note to a mono buffer.
function addNote(buf, startT, dur, freq, oscMix, env, gain) {
  const s0 = Math.floor(startT * SR);
  const s1 = Math.min(N, Math.floor((startT + dur) * SR));
  for (let i = s0; i < s1; i++) {
    const t = (i - s0) / SR;
    const ph = 2 * Math.PI * freq * t;
    const v = oscMix(ph);
    buf[i] += v * env(t, dur) * gain;
  }
}

// Kick: pitch-swept sine with a click transient.
function addKick(startT, gain = 1) {
  const dur = 0.42;
  const s0 = Math.floor(startT * SR);
  const s1 = Math.min(N, Math.floor((startT + dur) * SR));
  let ph = 0;
  for (let i = s0; i < s1; i++) {
    const t = (i - s0) / SR;
    const f = 44 + 95 * Math.exp(-t * 34); // ~139Hz -> 44Hz
    ph += (2 * Math.PI * f) / SR;
    const body = Math.sin(ph) * Math.exp(-t * 7.5);
    const click = (Math.random() * 2 - 1) * Math.exp(-t * 260) * 0.25;
    const v = (body + click) * gain;
    L[i] += v;
    R[i] += v;
  }
}

// Hi-hat: differentiated white noise (bright), short decay.
function addHat(startT, gain, open = false) {
  const dur = open ? 0.18 : 0.05;
  const s0 = Math.floor(startT * SR);
  const s1 = Math.min(N, Math.floor((startT + dur) * SR));
  let prev = 0;
  for (let i = s0; i < s1; i++) {
    const t = (i - s0) / SR;
    const n = Math.random() * 2 - 1;
    const hp = n - prev; // crude high-pass -> "tss"
    prev = n;
    const v = hp * Math.exp(-t * (open ? 22 : 90)) * gain;
    L[i] += v * 0.9;
    R[i] += v; // tiny asymmetry for width
  }
}

// Crash: noise burst with long decay, stereo-decorrelated.
function addCrash(startT, gain) {
  const dur = 1.6;
  const s0 = Math.floor(startT * SR);
  const s1 = Math.min(N, Math.floor((startT + dur) * SR));
  let pL = 0,
    pR = 0;
  for (let i = s0; i < s1; i++) {
    const t = (i - s0) / SR;
    const nL = Math.random() * 2 - 1;
    const nR = Math.random() * 2 - 1;
    const env = Math.exp(-t * 3.2);
    L[i] += (nL - pL) * env * gain;
    R[i] += (nR - pR) * env * gain;
    pL = nL;
    pR = nR;
  }
}

// Riser: noise whose brightness + level ramp up over its length.
function addRiser(startT, dur, gain) {
  const s0 = Math.floor(startT * SR);
  const s1 = Math.min(N, Math.floor((startT + dur) * SR));
  let prev = 0;
  for (let i = s0; i < s1; i++) {
    const t = (i - s0) / SR;
    const p = t / dur; // 0..1
    const n = Math.random() * 2 - 1;
    const bright = n - prev * (1 - p * 0.5);
    prev = n;
    const v = bright * (p * p) * gain;
    L[i] += v;
    R[i] += v * 0.95;
  }
}

// ---- arrangement -------------------------------------------------------
// Per-bar chords. Triads for arp/pad, single root for bass.
const bars = [
  { bass: 45, triad: [57, 60, 64] }, // Am
  { bass: 41, triad: [53, 57, 60] }, // F
  { bass: 48, triad: [60, 64, 67] }, // C
  { bass: 43, triad: [55, 59, 62] }, // G
  { bass: 45, triad: [57, 60, 64] }, // Am
  { bass: 41, triad: [53, 57, 60] }, // F
  { bass: 48, triad: [60, 64, 67] }, // C
  { bass: 43, triad: [55, 59, 62] }, // G
  { bass: 45, triad: [57, 60, 64] }, // Am
  { bass: 48, triad: [60, 64, 67] }, // C (final, uplifting)
];

// Dedicated buffers for instruments that need their own filtering.
const bassBuf = new Float32Array(N);
const arpL = new Float32Array(N);
const arpR = new Float32Array(N);
const padBuf = new Float32Array(N);

const bassOsc = (ph) => saw(ph) * 0.7 + sine(ph) * 0.5;
const arpOsc = (ph) => sine(ph) + 0.3 * saw(ph);
const padOsc = (ph) => sine(ph) + 0.25 * sine(ph * 2) * 0.5;

for (let b = 0; b < 10; b++) {
  const t0 = b * BAR;
  const { bass, triad } = bars[b];

  // Pad: sustained triad, whole bar. Softer during intro/build.
  const padGain = b < 1 ? 0.16 : 0.13;
  for (const m of triad) {
    addNote(padBuf, t0, BAR, mtof(m - 12), padOsc, (t, d) => padEnv(t, d, 0.25, 0.4), padGain);
  }

  // Arp: 16th-note run through the triad (ascending), full song for sparkle.
  const step = BEAT / 4; // 0.125s
  for (let s = 0; s < 16; s++) {
    const note = triad[s % triad.length] + (s >= 8 ? 12 : 0); // lift an octave in 2nd half of bar
    const st = t0 + s * step;
    const g = 0.11 * (b === 0 ? 0.7 : 1); // ease in
    // pan by alternating channel emphasis
    addNote(s % 2 === 0 ? arpL : arpR, st, step * 0.95, mtof(note), arpOsc, (t, d) => pluckEnv(t, d, 0.003, 26), g);
    addNote(s % 2 === 0 ? arpR : arpL, st, step * 0.95, mtof(note), arpOsc, (t, d) => pluckEnv(t, d, 0.003, 26), g * 0.5);
  }

  // Bass + drums only during the groove (bars 1-7, i.e. 2s-16s) and finale (bar 9).
  const groove = b >= 1 && b <= 7;
  const finale = b === 9;

  if (groove || finale) {
    // Bass: 8th-note pulse on the root with an octave accent.
    for (let e = 0; e < 8; e++) {
      const st = t0 + e * (BEAT / 2);
      const oct = e % 4 === 2 ? 12 : 0;
      addNote(bassBuf, st, BEAT / 2 * 0.9, mtof(bass + oct), bassOsc, (t, d) => pluckEnv(t, d, 0.005, 9), 0.5);
    }
    // Kick: four-on-the-floor.
    for (let bt = 0; bt < 4; bt++) addKick(t0 + bt * BEAT, finale ? 1.05 : 0.95);
    // Hats: off-beat 8ths, with an open hat on the "and" of beat 4.
    for (let h = 0; h < 8; h++) {
      const st = t0 + h * (BEAT / 2);
      if (h % 2 === 1) addHat(st, 0.16, h === 7);
      else addHat(st, 0.06);
    }
  }
}

// Build section: bars 8 (16-18s) drums drop, riser fills the gap into the drop.
addRiser(16.0, 2.0, 0.5);
// A reversed-swell arp lift already covered by the running arp. Add a snare-ish
// pickup right before the finale downbeat.
for (let i = 0; i < 4; i++) addHat(17.5 + i * 0.125, 0.12 + i * 0.05, false);

// Finale hit at 18s: crash + big Cmaj stab (C E G C) with long tail.
addCrash(18.0, 0.5);
const stab = [60, 64, 67, 72, 76];
for (const m of stab) {
  addNote(padBuf, 18.0, 2.0, mtof(m - 12), padOsc, (t, d) => padEnv(t, d, 0.01, 1.4), 0.12);
}
// Punchy pluck accent on the stab too.
for (const m of stab) {
  addNote(arpL, 18.0, 1.2, mtof(m), arpOsc, (t, d) => pluckEnv(t, d, 0.004, 3.5), 0.09);
  addNote(arpR, 18.0, 1.2, mtof(m), arpOsc, (t, d) => pluckEnv(t, d, 0.004, 3.5), 0.09);
}

// ---- filtering ---------------------------------------------------------
lowpass(bassBuf, 900);
lowpass(padBuf, 2200);

// ---- sidechain pump (four-on-floor) -----------------------------------
// Duck the sustained elements a touch on each kick for that "breathing" feel.
const kickTimes = [];
for (let b = 1; b <= 9; b++) {
  if (b === 8) continue; // no kicks during the riser bar
  for (let bt = 0; bt < 4; bt++) kickTimes.push(b * BAR + bt * BEAT);
}
function pumpAt(t) {
  let duck = 1;
  for (const kt of kickTimes) {
    if (t >= kt && t < kt + 0.35) {
      const p = (t - kt) / 0.35;
      duck = Math.min(duck, 0.45 + 0.55 * p); // dip to 0.45, recover
    }
  }
  return duck;
}

// ---- mix ---------------------------------------------------------------
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const duck = pumpAt(t);
  // width: haas delay on arpR
  const dR = i - 14 >= 0 ? arpR[i - 14] : 0;
  let l = L[i] + bassBuf[i] * duck + arpL[i] + padBuf[i] * duck;
  let r = R[i] + bassBuf[i] * duck + dR + padBuf[i] * duck;

  // gentle master saturation + level
  l = Math.tanh(l * 1.15) * 0.82;
  r = Math.tanh(r * 1.15) * 0.82;

  // global fades
  if (t < 0.04) {
    l *= t / 0.04;
    r *= t / 0.04;
  }
  if (t > DURATION - 0.6) {
    const f = clamp((DURATION - t) / 0.6, 0, 1);
    l *= f;
    r *= f;
  }
  L[i] = l;
  R[i] = r;
}

// ---- write 16-bit stereo WAV ------------------------------------------
function writeWav(path, chL, chR) {
  const numCh = 2;
  const bytesPerSample = 2;
  const dataLen = chL.length * numCh * bytesPerSample;
  const buf = Buffer.alloc(44 + dataLen);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + dataLen, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(numCh, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * numCh * bytesPerSample, 28);
  buf.writeUInt16LE(numCh * bytesPerSample, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(dataLen, 40);
  let off = 44;
  for (let i = 0; i < chL.length; i++) {
    const sL = clamp(chL[i], -1, 1);
    const sR = clamp(chR[i], -1, 1);
    buf.writeInt16LE((sL * 32767) | 0, off);
    buf.writeInt16LE((sR * 32767) | 0, off + 2);
    off += 4;
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, buf);
}

const outPath = fileURLToPath(new URL("../public/music.wav", import.meta.url));
writeWav(outPath, L, R);
console.log(`Wrote ${outPath} (${(44 + N * 4) / 1024 / 1024} MB, ${DURATION}s @ ${SR}Hz)`);
