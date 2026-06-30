# RaiseRadar — 20-second trailer (Remotion)

A fast, quick-cut promo for **RaiseRadar** built with [Remotion](https://remotion.dev).
Everything is generated from code — motion graphics **and** the music — so the
whole thing renders offline and is 100% royalty-free.

**Output:** `out/raiseradar-trailer.mp4` · 1920×1080 · 30 fps · 20 s · with audio.

## What's in it (the cut)

| Time | Scene | Beat |
|------|-------|------|
| 0.0–1.6s | Logo lock-on | Radar sweep finds the blip, wordmark slams in |
| 1.6–4.0s | Hook | "Know who **just got funded.**" |
| 4.0–6.2s | The volume | `1,300+` newly-funded US companies, every week (count-up) |
| 6.2–11.2s | The feed | Real sample rows stream in — company, exec, state, **amount** |
| 11.2–13.7s | Why it works | FRESH CAPITAL · NAMED EXEC · SEC-OFFICIAL · ZERO WORK (rapid cuts) |
| 13.7–15.5s | Authority | "100% official SEC filings" — riser builds |
| 15.5–18.0s | Payoff | Impact hit → "Get there **first.**" |
| 18.0–20.0s | End card | Wordmark + CTA: "Get this week's list — free" |

The scene cuts are timed to the music: drums land on the hook, the riser builds
through the authority beat, and the impact hit drops on the payoff slam.

## Brand

Pulled straight from the site (`../index.html`): ink `#0B1F33`, green `#16E0A3`,
amber `#FFB020`; **Space Grotesk** for display + **Inter** for copy (self-hosted,
latin subset, in `public/fonts/`).

## Develop

```bash
npm install
npm run dev            # open Remotion Studio to scrub/preview
```

## Render

The repo ships a pre-rendered MP4 at `out/raiseradar-trailer.mp4`. To re-render:

```bash
npm run render
```

In a headless container without a bundled Chrome, point Remotion at a local
Chromium **headless-shell** binary and render single-threaded (software GL +
many tabs can starve font loading):

```bash
npx remotion render src/index.ts RRTrailer out/raiseradar-trailer.mp4 \
  --browser-executable="/path/to/chrome-headless-shell" \
  --concurrency=1
```

## Music

`make_music.py` synthesizes the backing track from scratch with numpy (kick,
hats, bass, arp, pad, riser, impact + a soft master bus) and writes
`public/music.wav`. Regenerate with:

```bash
python3 make_music.py
```

## Layout

```
trailer/
├── make_music.py          # numpy music synth → public/music.wav
├── public/
│   ├── music.wav          # generated soundtrack
│   └── fonts/             # self-hosted Space Grotesk + Inter (woff2)
├── src/
│   ├── index.ts           # registerRoot
│   ├── Root.tsx           # <Composition> (RRTrailer, 1920x1080, 600f)
│   ├── Trailer.tsx        # scene sequencing + audio + cut flashes
│   ├── theme.ts           # brand colors + font loading
│   ├── Background.tsx     # animated radar background
│   ├── Logo.tsx           # radar mark + wordmark
│   ├── anim.ts            # spring/slam/rise/exit helpers
│   └── scenes/            # S1Logo … S8CTA
└── out/raiseradar-trailer.mp4
```
