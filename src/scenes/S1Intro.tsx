import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { Background } from "../components/Background";
import { RadarLogo } from "../components/RadarLogo";
import { Pill, Dot } from "../components/ui";
import { COLORS, FONT_DISPLAY, FONT_BODY } from "../theme";

export const S1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({ frame, fps, config: { damping: 12, mass: 0.7, stiffness: 130 } });
  const logoScale = interpolate(pop, [0, 1], [0.35, 1]);
  const sweep = frame * 9; // fast spin on the open
  const blip = Math.max(0, Math.sin((frame - 14) * 0.5)) * (frame > 14 ? 1 : 0);

  const wordS = spring({ frame: frame - 16, fps, config: { damping: 15, mass: 0.6, stiffness: 150 } });
  const pillS = spring({ frame: frame - 34, fps, config: { damping: 18, mass: 0.6, stiffness: 140 } });

  return (
    <AbsoluteFill>
      <Background intensity={0.85} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 26 }}>
        <div style={{ transform: `scale(${logoScale})`, opacity: pop, filter: "drop-shadow(0 12px 40px rgba(22,224,163,0.25))" }}>
          <RadarLogo size={230} sweep={sweep} blip={blip} />
        </div>

        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: 92,
            letterSpacing: -2,
            color: COLORS.white,
            transform: `translateY(${(1 - wordS) * 40}px)`,
            opacity: wordS,
          }}
        >
          Raise<span style={{ color: COLORS.green }}>Radar</span>
        </div>

        <div style={{ opacity: pillS, transform: `translateY(${(1 - pillS) * 20}px)` }}>
          <Pill style={{ fontFamily: FONT_BODY }}>
            <Dot /> Updated every Monday from SEC filings
          </Pill>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
