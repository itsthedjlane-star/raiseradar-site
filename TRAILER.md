# RaiseRadar — 20s Trailer (Remotion)

A quick-cut, snappy 20-second brand trailer for **RaiseRadar**, built with
[Remotion](https://remotion.dev). Everything (motion **and** the soundtrack) is
generated from code — no external stock footage or licensed music.

## What's in it

20 seconds @ 1920×1080, 30fps, with a procedurally generated soundtrack. Cuts
are timed to the beat (120 BPM), and the big musical moments line up with the
on-screen ones — the data drop at 0:08 and the crash on the end card at 0:18.

| Time | Scene | |
|------|-------|--|
| 0:00 | **Logo sting** — radar mark sweeps in, wordmark + "Updated every Monday from SEC filings" |
| 0:02 | **Hook** — "Know who just got funded." |
| 0:05 | **Punch** — "The money just landed." |
| 0:06 | **Punch** — "Get there first." |
| 0:08 | **Live feed** — the weekly table cascades in with real sample rows, amounts count up, running total ticks to the week's total |
| 0:13 | **Value props** — fresh capital · named decision-maker · 100% SEC data |
| 0:16 | **Stats** — 1,300+ raises/week · 100% official data · Mondays |
| 0:18 | **CTA** — "Know who just got funded." + Get this week's list → |

Brand is pulled straight from the marketing site: ink `#0B1F33`, green
`#16E0A3`, amber `#FFB020`, Space Grotesk + Inter (bundled locally in
`public/fonts` so renders are deterministic and offline).

## Commands

```bash
npm install          # install Remotion + React
npm run gen:music    # (re)generate public/music.wav
npm run dev          # open Remotion Studio to preview/scrub
npm run render       # render out/raiseradar-trailer.mp4
npm run build        # gen:music + render in one shot
```

### Rendering in a headless / CI box

Point Remotion at a `chrome-headless-shell` binary (the full Chrome build has
removed old-headless mode):

```bash
npx remotion render Trailer out/raiseradar-trailer.mp4 \
  --browser-executable=/path/to/chrome-headless-shell
```

## How the music works

`scripts/gen-music.mjs` is a dependency-free WAV synthesizer. It builds an
uplifting electronic bed (vi–IV–I–V progression, four-on-the-floor kick,
sidechain "pump", arp, riser and a final major stab) at 120 BPM so the video's
cut grid and the beat grid are the same grid. Output: `public/music.wav`.

## Structure

```
src/
  Root.tsx            # registers the <Composition>
  Trailer.tsx         # scene timeline, audio, flash accents, corner mark
  theme.ts            # brand tokens
  fonts.ts            # local @font-face + delayRender until fonts ready
  data.ts             # sample feed rows
  components/         # RadarLogo, Background/grain, UI helpers
  scenes/            # one file per scene
scripts/gen-music.mjs # procedural soundtrack
public/fonts/         # Space Grotesk + Inter (woff2)
public/music.wav      # generated soundtrack
```
