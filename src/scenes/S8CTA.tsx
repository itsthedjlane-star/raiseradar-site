import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "../components/Background";
import { RadarLogo } from "../components/RadarLogo";
import { COLORS, FONT_DISPLAY, FONT_BODY } from "../theme";

export const S8CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Big impact hit on entry (crash lands here).
  const hit = spring({ frame, fps, config: { damping: 11, mass: 0.8, stiffness: 120 } });
  const line = spring({ frame: frame - 8, fps, config: { damping: 16, mass: 0.6, stiffness: 150 } });
  const btn = spring({ frame: frame - 16, fps, config: { damping: 13, mass: 0.6, stiffness: 160 } });
  const sub = interpolate(frame, [22, 32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const sweep = frame * 5;
  const blip = Math.max(0, Math.sin(frame * 0.4));
  const btnGlow = 0.4 + 0.35 * (0.5 + 0.5 * Math.sin(frame * 0.28));

  return (
    <AbsoluteFill>
      <Background intensity={1} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 34 }}>
        {/* lockup */}
        <div style={{ display: "flex", alignItems: "center", gap: 26, transform: `scale(${interpolate(hit, [0, 1], [0.7, 1])})`, opacity: hit }}>
          <RadarLogo size={120} sweep={sweep} blip={blip} />
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 84, letterSpacing: -2, color: COLORS.white }}>
            Raise<span style={{ color: COLORS.green }}>Radar</span>
          </div>
        </div>

        {/* headline */}
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: 96,
            letterSpacing: -3,
            color: COLORS.white,
            textAlign: "center",
            transform: `translateY(${(1 - line) * 30}px)`,
            opacity: line,
          }}
        >
          Know who <span style={{ color: COLORS.green }}>just got funded.</span>
        </div>

        {/* button */}
        <div
          style={{
            transform: `translateY(${(1 - btn) * 26}px) scale(${interpolate(btn, [0, 1], [0.85, 1])})`,
            opacity: btn,
            background: COLORS.green,
            color: COLORS.ink,
            fontFamily: FONT_BODY,
            fontWeight: 600,
            fontSize: 34,
            padding: "22px 46px",
            borderRadius: 14,
            boxShadow: `0 0 ${30 + btnGlow * 50}px rgba(22,224,163,${btnGlow})`,
          }}
        >
          Get this week&rsquo;s list →
        </div>

        <div style={{ fontFamily: FONT_BODY, fontSize: 26, color: COLORS.steel, opacity: sub, letterSpacing: 0.5 }}>
          Start free · no card required · sourced from official SEC filings
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
