import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { RadarBackground } from "../Background";
import { Wordmark } from "../Logo";
import { colors, fonts } from "../theme";
import { riseIn, snap } from "../anim";

export const S8CTA: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logo = snap(frame, fps, 2, { damping: 14, stiffness: 200 });
  const logoScale = interpolate(logo, [0, 1], [0.85, 1]);
  const logoOp = interpolate(logo, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
  const sweep = interpolate(frame, [0, dur], [0, 200]);

  const tag = riseIn(frame, fps, 12);
  const cta = snap(frame, fps, 20, { damping: 12, stiffness: 220 });
  const ctaScale = interpolate(cta, [0, 1], [0.7, 1]);
  const ctaOp = interpolate(cta, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
  // gentle CTA pulse
  const pulse = 1 + Math.sin(Math.max(0, frame - 30) * 0.18) * 0.02;

  const foot = interpolate(frame, [34, 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <RadarBackground intensity={1} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 30,
        }}
      >
        <div style={{ transform: `scale(${logoScale})`, opacity: logoOp }}>
          <Wordmark fontFamily={fonts.display} fontSize={86} markSize={124} sweepDeg={sweep} />
        </div>

        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 600,
            fontSize: 40,
            color: colors.white,
            opacity: tag.opacity,
            transform: `translateY(${tag.y}px)`,
          }}
        >
          Know who <span style={{ color: colors.green }}>just got funded.</span>
        </div>

        <div
          style={{
            transform: `scale(${ctaScale * pulse})`,
            opacity: ctaOp,
            background: colors.green,
            color: colors.ink,
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 38,
            padding: "20px 44px",
            borderRadius: 14,
            boxShadow: "0 20px 60px -15px rgba(22,224,163,0.6)",
            marginTop: 6,
          }}
        >
          Get this week&rsquo;s list — free →
        </div>

        <div
          style={{
            fontFamily: fonts.body,
            fontSize: 22,
            letterSpacing: 1,
            color: colors.steel,
            opacity: foot,
            marginTop: 4,
          }}
        >
          Updated every Monday · No card required · Cancel anytime
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
