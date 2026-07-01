import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, interpolate, useCurrentFrame } from "remotion";
import { S1Intro } from "./scenes/S1Intro";
import { S2Hook } from "./scenes/S2Hook";
import { PunchScene } from "./scenes/PunchScene";
import { S5Feed } from "./scenes/S5Feed";
import { S6Props } from "./scenes/S6Props";
import { S7Stats } from "./scenes/S7Stats";
import { S8CTA } from "./scenes/S8CTA";
import { RadarLogo } from "./components/RadarLogo";
import { Flash } from "./components/ui";
import { COLORS, FONT_DISPLAY } from "./theme";
import { ensureFonts } from "./fonts";

// Persistent brand mark shown across the content scenes for continuity.
const CornerMark: React.FC = () => {
  const frame = useCurrentFrame();
  const inOut = interpolate(frame, [0, 10, 455, 465], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ position: "absolute", top: 54, left: 66, display: "flex", alignItems: "center", gap: 14, opacity: inOut * 0.9 }}>
      <RadarLogo size={46} sweep={frame * 4} blip={Math.max(0, Math.sin(frame * 0.35))} />
      <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: -0.5, color: COLORS.white }}>
        Raise<span style={{ color: COLORS.green }}>Radar</span>
      </span>
    </div>
  );
};

export const Trailer: React.FC = () => {
  // Kick off local brand-font loading during the first render (holds the render
  // via delayRender until the faces are ready). Idempotent.
  ensureFonts();
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.inkDeep }}>
      <Audio src={staticFile("music.wav")} />

      {/* --- scenes (hard cuts) --- */}
      <Sequence durationInFrames={75}>
        <S1Intro />
      </Sequence>
      <Sequence from={75} durationInFrames={75}>
        <S2Hook />
      </Sequence>
      <Sequence from={150} durationInFrames={45}>
        <PunchScene kicker="Why RaiseRadar" text="The money just landed." align="left" greenWords={[2]} />
      </Sequence>
      <Sequence from={195} durationInFrames={45}>
        <PunchScene kicker="So move first" text="Get there first." align="right" greenWords={[2]} />
      </Sequence>
      <Sequence from={240} durationInFrames={150}>
        <S5Feed />
      </Sequence>
      <Sequence from={390} durationInFrames={90}>
        <S6Props />
      </Sequence>
      <Sequence from={480} durationInFrames={60}>
        <S7Stats />
      </Sequence>
      <Sequence from={540} durationInFrames={60}>
        <S8CTA />
      </Sequence>

      {/* persistent brand mark across content scenes */}
      <Sequence from={75} durationInFrames={465}>
        <CornerMark />
      </Sequence>

      {/* --- flash cut accents (absolute-frame overlay) --- */}
      <Flash at={150} color={COLORS.white} peak={0.16} length={6} />
      <Flash at={195} color={COLORS.white} peak={0.16} length={6} />
      <Flash at={240} color={COLORS.green} peak={0.22} length={9} />
      <Flash at={390} color={COLORS.white} peak={0.16} length={6} />
      <Flash at={480} color={COLORS.white} peak={0.18} length={6} />
      <Flash at={540} color={COLORS.green} peak={0.30} length={12} />
    </AbsoluteFill>
  );
};
