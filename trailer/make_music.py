#!/usr/bin/env python3
"""
Generate a royalty-free, snappy electronic trailer track for RaiseRadar.

Everything here is synthesized from scratch with numpy (sine/saw/noise +
envelopes), so the output is 100% original and free to use. ~20s, A-minor,
124 BPM, with an intro build, a full-energy section, a riser and a final hit.

Output: public/music.wav  (44.1kHz, 16-bit stereo)
"""
import numpy as np
import wave
import struct
import os

SR = 44100
BPM = 124.0
BEAT = 60.0 / BPM            # seconds per quarter note
SIXTEENTH = BEAT / 4.0
DUR = 20.0                   # total seconds
N = int(SR * DUR)
t = np.arange(N) / SR

rng = np.random.default_rng(7)

# ----------------------------------------------------------------------------
# helpers
# ----------------------------------------------------------------------------
def env_adsr(length_samps, a, d, s_level, r, total=None):
    """Simple ADSR envelope of length `length_samps` (the sustain held until
    release starts)."""
    total = total if total is not None else length_samps
    out = np.zeros(total)
    a_s = max(1, int(a * SR))
    d_s = max(1, int(d * SR))
    r_s = max(1, int(r * SR))
    i = 0
    # attack
    n = min(a_s, total - i)
    if n > 0:
        out[i:i+n] = np.linspace(0, 1, n)
        i += n
    # decay
    n = min(d_s, total - i)
    if n > 0:
        out[i:i+n] = np.linspace(1, s_level, n)
        i += n
    # sustain
    sus_end = min(total, length_samps - r_s)
    if sus_end > i:
        out[i:sus_end] = s_level
        i = sus_end
    # release
    n = min(r_s, total - i)
    if n > 0:
        out[i:i+n] = np.linspace(out[i-1] if i > 0 else s_level, 0, n)
        i += n
    return out

def saw(freq, n, detune=0.0):
    ph = 2 * np.pi * freq * (np.arange(n) / SR)
    # bandlimited-ish saw via summed harmonics
    s = np.zeros(n)
    for k in range(1, 12):
        s += ((-1) ** (k + 1)) / k * np.sin(k * ph)
    s *= 2 / np.pi
    if detune:
        ph2 = 2 * np.pi * freq * (1 + detune) * (np.arange(n) / SR)
        s2 = np.zeros(n)
        for k in range(1, 12):
            s2 += ((-1) ** (k + 1)) / k * np.sin(k * ph2)
        s = 0.5 * s + 0.5 * (2 / np.pi) * s2
    return s

def sine(freq, n):
    return np.sin(2 * np.pi * freq * (np.arange(n) / SR))

def place(track, sig, start_sec):
    i = int(start_sec * SR)
    j = min(len(track), i + len(sig))
    if i < len(track):
        track[i:j] += sig[:j - i]

# note frequencies (A natural minor)
NOTE = {
    'A1': 55.00, 'A2': 110.00, 'C3': 130.81, 'D3': 146.83, 'E3': 164.81,
    'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94, 'C4': 261.63,
    'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00,
    'B4': 493.88, 'C5': 523.25, 'D5': 587.33, 'E5': 659.25,
}

# ----------------------------------------------------------------------------
# instruments
# ----------------------------------------------------------------------------
def kick():
    dur = 0.34
    n = int(dur * SR)
    f = 145 * np.exp(-np.arange(n) / SR * 26) + 48
    ph = np.cumsum(2 * np.pi * f / SR)
    body = np.sin(ph) * np.exp(-np.arange(n) / SR * 7.5)
    click = rng.standard_normal(n) * np.exp(-np.arange(n) / SR * 220) * 0.5
    return (body * 1.0 + click) * 0.95

def hat(open_=False):
    dur = 0.16 if open_ else 0.05
    n = int(dur * SR)
    noise = rng.standard_normal(n)
    # crude high-pass: difference + decay
    noise = np.diff(noise, prepend=0.0)
    decay = np.exp(-np.arange(n) / SR * (16 if open_ else 70))
    return noise * decay * 0.32

def clap():
    dur = 0.22
    n = int(dur * SR)
    noise = rng.standard_normal(n)
    noise = np.diff(noise, prepend=0.0)
    env = np.exp(-np.arange(n) / SR * 22)
    # a few quick taps for body
    for off in (0.0, 0.009, 0.018):
        k = int(off * SR)
        env[k:] += np.exp(-np.arange(n - k) / SR * 30) * 0.6
    return noise * env * 0.5

def pluck(freq, dur=0.32, gain=0.5, detune=0.004):
    n = int(dur * SR)
    sig = saw(freq, n, detune=detune)
    sig += 0.5 * sine(freq, n)
    e = env_adsr(n, a=0.002, d=0.10, s_level=0.25, r=0.12, total=n)
    return sig * e * gain

def basshit(freq, dur, gain=0.6):
    n = int(dur * SR)
    sig = 0.7 * saw(freq, n, detune=0.006) + 0.5 * sine(freq, n) + 0.25 * sine(freq / 2, n)
    e = env_adsr(n, a=0.004, d=0.06, s_level=0.85, r=0.05, total=n)
    return sig * e * gain

def pad(freqs, dur, gain=0.18):
    n = int(dur * SR)
    sig = np.zeros(n)
    for f in freqs:
        sig += saw(f, n, detune=0.008)
    e = env_adsr(n, a=0.35, d=0.3, s_level=0.7, r=0.5, total=n)
    return sig / len(freqs) * e * gain

def riser(dur=2.0, gain=0.4):
    n = int(dur * SR)
    noise = rng.standard_normal(n)
    # rising pitch + rising amplitude
    amp = np.linspace(0, 1, n) ** 2
    # sweep a resonant tone up
    f = np.linspace(220, 1800, n)
    ph = np.cumsum(2 * np.pi * f / SR)
    tone = np.sin(ph)
    sig = (0.5 * noise + 0.6 * tone) * amp
    return sig * gain

def impact(gain=0.9):
    dur = 1.6
    n = int(dur * SR)
    f = 90 * np.exp(-np.arange(n) / SR * 4) + 40
    ph = np.cumsum(2 * np.pi * f / SR)
    boom = np.sin(ph) * np.exp(-np.arange(n) / SR * 2.4)
    crash = rng.standard_normal(n) * np.exp(-np.arange(n) / SR * 3.0) * 0.35
    return (boom + crash) * gain

# ----------------------------------------------------------------------------
# arrangement
# ----------------------------------------------------------------------------
track = np.zeros(N)

# chord progression: Am - F - C - G (each one bar = 4 beats)
prog = [
    (['A3', 'C4', 'E4'], 'A2'),
    (['F3', 'A3', 'C4'], 'F3'),
    (['C4', 'E4', 'G4'], 'C3'),
    (['G3', 'B3', 'D4'], 'G3'),
]
arp_patterns = [
    ['A4', 'E4', 'C5', 'E4'],
    ['C5', 'A4', 'F4', 'A4'],
    ['C5', 'G4', 'E4', 'G4'],
    ['D5', 'B4', 'G4', 'B4'],
]
BAR = 4 * BEAT

# Pads through the whole thing (soft bed), starts immediately
seg = 0.0
bar_i = 0
while seg < DUR:
    chord, _ = prog[bar_i % 4]
    place(track, pad([NOTE[c] for c in chord], BAR + 0.4,
                     gain=0.16 if seg < 4 else 0.12), seg)
    seg += BAR
    bar_i += 1

# Drums: enter at bar 2 (~3.9s). Build density.
drum_start_bar = 2
n_bars = int(DUR / BAR) + 1
for b in range(n_bars):
    bar_t = b * BAR
    if bar_t >= DUR:
        break
    active = b >= drum_start_bar
    if not active:
        continue
    # four-on-the-floor kick (skip during the riser bar right before drop)
    is_riser_bar = abs(bar_t - 7 * BAR) < 0.01  # bar index 7 ~ 13.5s build
    for beat in range(4):
        bt = bar_t + beat * BEAT
        if bt >= DUR:
            break
        if not is_riser_bar:
            place(track, kick(), bt)
        # hats on offbeats / 8ths
        place(track, hat(open_=(beat == 3)), bt + BEAT / 2)
        if b >= drum_start_bar + 1:
            place(track, hat(), bt)
    # clap on beats 2 & 4
    if not is_riser_bar:
        place(track, clap(), bar_t + BEAT)
        place(track, clap(), bar_t + 3 * BEAT)

# Bassline: root note pulses (8ths), from bar 2
for b in range(drum_start_bar, n_bars):
    bar_t = b * BAR
    if bar_t >= DUR:
        break
    _, bass = prog[b % 4]
    f = NOTE[bass]
    for s in range(8):
        st = bar_t + s * (BEAT / 2)
        if st >= DUR:
            break
        place(track, basshit(f, BEAT / 2 * 0.9, gain=0.55), st)

# Arp plucks: from bar 3, 16th-note driving arpeggio
arp_start_bar = 3
for b in range(arp_start_bar, n_bars):
    bar_t = b * BAR
    if bar_t >= DUR:
        break
    pat = arp_patterns[b % 4]
    for s in range(16):
        st = bar_t + s * SIXTEENTH
        if st >= DUR:
            break
        note = pat[s % len(pat)]
        oct_shift = 1.0
        f = NOTE[note] * oct_shift
        place(track, pluck(f, dur=SIXTEENTH * 2.2, gain=0.32), st)

# Riser into the final section (~13.5s -> 15.5s)
place(track, riser(dur=2.0, gain=0.42), 13.5)

# Big impact / drop at ~15.5s
place(track, impact(gain=0.85), 15.5)

# Final ring-out chord (Am) sustaining to the end
place(track, pad([NOTE['A3'], NOTE['C4'], NOTE['E4'], NOTE['A4']], 5.0, gain=0.22), 15.5)

# ----------------------------------------------------------------------------
# master bus: gentle drive, simple stereo, soft limiter, fades
# ----------------------------------------------------------------------------
# light saturation
track = np.tanh(track * 1.15)

# stereo widen: small delay on arp/highs via a comb-ish offset
delay = int(0.011 * SR)
left = track.copy()
right = track.copy()
right[delay:] += 0.15 * track[:-delay]
left[delay // 2:] += 0.10 * track[:-(delay // 2)]

stereo = np.stack([left, right], axis=1)

# normalize
peak = np.max(np.abs(stereo))
if peak > 0:
    stereo = stereo / peak * 0.92

# soft limiter
stereo = np.tanh(stereo * 1.05) * 0.95

# fade in/out
fi = int(0.05 * SR)
fo = int(0.8 * SR)
stereo[:fi] *= np.linspace(0, 1, fi)[:, None]
stereo[-fo:] *= np.linspace(1, 0, fo)[:, None]

# ----------------------------------------------------------------------------
# write WAV
# ----------------------------------------------------------------------------
out_path = os.path.join(os.path.dirname(__file__), 'public', 'music.wav')
os.makedirs(os.path.dirname(out_path), exist_ok=True)
data = np.clip(stereo, -1, 1)
data16 = (data * 32767).astype('<i2')

with wave.open(out_path, 'w') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(data16.tobytes())

print(f"wrote {out_path}  ({len(data16)} frames, {DUR:.1f}s)")
