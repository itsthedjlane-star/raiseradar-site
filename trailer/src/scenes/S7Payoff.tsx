import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { RadarBackground } from "../Background";
import { colors, fonts } from "../theme";
import { exit, snap } from "../anim";

// Lands on the impact hit: white flash resolves into a huge slam line.
export const S7Payoff: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ex = exit(frame, dur, 8);

  const s = snap(frame, fps, 0, { damping: 11, stiffness: 170 });
  const scale = interpolate(s, [0, 1], [1.4, 1]);
  const opacity = interpolate(s, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });

  // flash from S6 carrying over, fading fast
  const flash = interpolate(frame, [0, 7], [1, 0], { extrapolateRight: "clamp" });
  // impact shake
  const shakeAmt = interpolate(frame, [0, 12], [1, 0], { extrapolateRight: "clamp" });
  const sx = Math.sin(frame * 2.3) * 10 * shakeAmt;
  const sy = Math.cos(frame * 2.9) * 8 * shakeAmt;

  const subA = interpolate(frame, [10, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <RadarBackground intensity={1.1} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: ex.opacity,
          transform: `translate(${sx}px, ${sy}px)`,
        }}
      >
        <div
          style={{
            textAlign: "center",
            transform: `scale(${scale * ex.scale})`,
            opacity,
          }}
        >
          <div
            style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 150,
              letterSpacing: -4,
              lineHeight: 0.98,
              color: colors.white,
            }}
          >
            Get there <span style={{ color: colors.green, textShadow: "0 0 60px rgba(22,224,163,0.5)" }}>first.</span>
          </div>
          <div
            style={{
              marginTop: 22,
              fontFamily: fonts.body,
              fontWeight: 500,
              fontSize: 36,
              color: colors.cloud,
              opacity: subA,
            }}
          >
            Reach them the week the money lands.
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: colors.white, opacity: flash }} />
    </AbsoluteFill>
  );
};
