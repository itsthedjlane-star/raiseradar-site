import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { RadarBackground } from "../Background";
import { colors, fonts } from "../theme";
import { exit, riseIn, slamIn } from "../anim";

// Big count-up to 1,300+ — "new private raises, every single week."
export const S3Stat: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ex = exit(frame, dur, 7);

  const count = Math.round(
    interpolate(frame, [4, 34], [0, 1300], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    })
  );
  const big = slamIn(frame, fps, 2);
  const sub = riseIn(frame, fps, 16);

  return (
    <AbsoluteFill>
      <RadarBackground />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: ex.opacity,
          transform: `scale(${ex.scale})`,
        }}
      >
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: 24,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: colors.green,
            marginBottom: 6,
            opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          Every Monday
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontFamily: fonts.display,
            fontWeight: 700,
            color: colors.white,
            opacity: big.opacity,
            transform: `translateY(${big.y}px) scale(${big.scale})`,
            letterSpacing: -6,
          }}
        >
          <span
            style={{
              fontSize: 280,
              fontVariantNumeric: "tabular-nums",
              color: colors.green,
              textShadow: "0 0 70px rgba(22,224,163,0.4)",
            }}
          >
            {count.toLocaleString("en-US")}
          </span>
          <span style={{ fontSize: 180, color: colors.green }}>+</span>
        </div>
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 600,
            fontSize: 44,
            color: colors.white,
            opacity: sub.opacity,
            transform: `translateY(${sub.y}px)`,
            letterSpacing: -0.5,
          }}
        >
          newly-funded US companies. <span style={{ color: colors.steel }}>Every week.</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
