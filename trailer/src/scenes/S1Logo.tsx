import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { RadarBackground } from "../Background";
import { Wordmark } from "../Logo";
import { colors, fonts } from "../theme";
import { exit, snap } from "../anim";

export const S1Logo: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = snap(frame, fps, 4, { damping: 13, stiffness: 200 });
  const scale = interpolate(s, [0, 1], [1.25, 1]);
  const opacity = interpolate(s, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
  // fast radar sweep that "locks on"
  const sweep = interpolate(frame, [0, dur], [-90, 220], { extrapolateRight: "clamp" });
  const ex = exit(frame, dur, 7);

  return (
    <AbsoluteFill>
      <RadarBackground intensity={1.1} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: ex.opacity,
        }}
      >
        <div style={{ transform: `scale(${scale * ex.scale})`, opacity }}>
          <Wordmark fontFamily={fonts.display} fontSize={92} markSize={132} sweepDeg={sweep} />
        </div>
        <div
          style={{
            marginTop: 26,
            fontFamily: fonts.body,
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: colors.steel,
            opacity: interpolate(frame, [14, 26], [0, 1], { extrapolateRight: "clamp" }) * ex.opacity,
          }}
        >
          Funding intelligence
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
