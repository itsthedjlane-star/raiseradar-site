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
import { slamIn } from "../anim";

// Builds energy with the riser: "100% OFFICIAL SEC DATA", expanding ring,
// brightening to a flash that carries into the impact cut.
export const S6Authority: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const a = slamIn(frame, fps, 2);
  // rising build
  const build = interpolate(frame, [0, dur], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const ringR = interpolate(build, [0, 1], [120, 900]);
  const ringOp = interpolate(build, [0, 0.7, 1], [0.5, 0.25, 0]);
  // brighten to white at the very end (into the drop)
  const flash = interpolate(frame, [dur - 6, dur], [0, 1], { extrapolateLeft: "clamp" });
  const zoom = interpolate(build, [0, 1], [1, 1.12]);

  return (
    <AbsoluteFill>
      <RadarBackground intensity={1.2} spin />
      {/* expanding ring */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: ringR,
            height: ringR,
            borderRadius: "50%",
            border: `2px solid ${colors.green}`,
            opacity: ringOp,
            boxShadow: `0 0 80px rgba(22,224,163,${0.4 * build})`,
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${zoom})`,
        }}
      >
        <div
          style={{
            textAlign: "center",
            opacity: a.opacity,
            transform: `translateY(${a.y}px) scale(${a.scale})`,
          }}
        >
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: colors.steel,
              marginBottom: 10,
            }}
          >
            No scraping. No grey-area data.
          </div>
          <div
            style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 116,
              letterSpacing: -2,
              color: colors.white,
              lineHeight: 1.02,
            }}
          >
            100% <span style={{ color: colors.green }}>official</span>
            <br />
            SEC filings
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ background: colors.white, opacity: flash }} />
    </AbsoluteFill>
  );
};
