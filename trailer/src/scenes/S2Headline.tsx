import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { RadarBackground } from "../Background";
import { colors, fonts } from "../theme";
import { exit, slamIn } from "../anim";

// "Know who just got funded." — word-by-word slam, "funded." in green.
const WORDS: { text: string; green?: boolean }[] = [
  { text: "Know" },
  { text: "who" },
  { text: "just got" },
  { text: "funded.", green: true },
];

export const S2Headline: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ex = exit(frame, dur, 7);

  return (
    <AbsoluteFill>
      <RadarBackground />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: ex.opacity,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0 26px",
            maxWidth: 1400,
            padding: "0 80px",
            transform: `scale(${ex.scale})`,
          }}
        >
          {WORDS.map((w, i) => {
            const a = slamIn(frame, fps, 6 + i * 7);
            return (
              <span
                key={i}
                style={{
                  fontFamily: fonts.display,
                  fontWeight: 700,
                  fontSize: 132,
                  lineHeight: 1.02,
                  letterSpacing: -3,
                  color: w.green ? colors.green : colors.white,
                  opacity: a.opacity,
                  transform: `translateY(${a.y}px) scale(${a.scale})`,
                  textShadow: w.green ? `0 0 50px rgba(22,224,163,0.45)` : "none",
                }}
              >
                {w.text}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
