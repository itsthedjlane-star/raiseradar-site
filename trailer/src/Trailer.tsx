import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { colors } from "./theme";
import { S1Logo } from "./scenes/S1Logo";
import { S2Headline } from "./scenes/S2Headline";
import { S3Stat } from "./scenes/S3Stat";
import { S4Feed } from "./scenes/S4Feed";
import { S5Props } from "./scenes/S5Props";
import { S6Authority } from "./scenes/S6Authority";
import { S7Payoff } from "./scenes/S7Payoff";
import { S8CTA } from "./scenes/S8CTA";

type Scene = { from: number; dur: number; el: (dur: number) => React.ReactNode };

const SCENES: Scene[] = [
  { from: 0, dur: 48, el: (d) => <S1Logo dur={d} /> },
  { from: 48, dur: 72, el: (d) => <S2Headline dur={d} /> },
  { from: 120, dur: 66, el: (d) => <S3Stat dur={d} /> },
  { from: 186, dur: 150, el: (d) => <S4Feed dur={d} /> },
  { from: 336, dur: 75, el: (d) => <S5Props dur={d} /> },
  { from: 411, dur: 54, el: (d) => <S6Authority dur={d} /> },
  { from: 465, dur: 75, el: (d) => <S7Payoff dur={d} /> },
  { from: 540, dur: 60, el: (d) => <S8CTA dur={d} /> },
];

// Quick hard-cut flashes for snap (green tints at chosen cuts).
const CUTS = [48, 120, 186, 336];

const CutFlashes: React.FC = () => {
  const frame = useCurrentFrame();
  let op = 0;
  for (const c of CUTS) {
    // Only contribute inside the brief window right after the cut.
    if (frame >= c && frame <= c + 3) {
      op = Math.max(op, interpolate(frame, [c, c + 3], [0.18, 0]));
    }
  }
  if (op <= 0) return null;
  return <AbsoluteFill style={{ background: colors.green, opacity: op, mixBlendMode: "screen" }} />;
};

// Subtle global scanlines + vignette for a "feed terminal" feel.
const GrainOverlay: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill
      style={{
        opacity: 0.05,
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 3px)",
        mixBlendMode: "overlay",
      }}
    />
    <AbsoluteFill style={{ boxShadow: "inset 0 0 260px 60px rgba(0,0,0,0.45)" }} />
  </AbsoluteFill>
);

export const RRTrailer: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: colors.ink }}>
      <Audio src={staticFile("music.wav")} volume={0.85} />

      {SCENES.map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.dur}>
          {s.el(s.dur)}
        </Sequence>
      ))}

      <CutFlashes />
      <GrainOverlay />
    </AbsoluteFill>
  );
};
