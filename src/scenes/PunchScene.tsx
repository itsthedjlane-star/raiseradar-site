import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { Background } from "../components/Background";
import { RiseLine } from "../components/ui";
import { COLORS, FONT_DISPLAY, FONT_BODY } from "../theme";

// A fast full-screen statement with a wiping green accent bar. Alignment
// alternates between scenes to keep the cutting feel lively.
export const PunchScene: React.FC<{
  kicker: string;
  text: string;
  greenWords?: number[];
  align?: "left" | "right";
}> = ({ kicker, text, greenWords = [], align = "left" }) => {
  const frame = useCurrentFrame();
  const bar = interpolate(frame, [2, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const kick = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: align === "left" ? "flex-start" : "flex-end",
          padding: "0 140px",
        }}
      >
        <div style={{ maxWidth: 1300, textAlign: align }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              justifyContent: align === "left" ? "flex-start" : "flex-end",
              opacity: kick,
              marginBottom: 20,
            }}
          >
            {align === "left" && <Bar w={bar} />}
            <span
              style={{
                fontFamily: FONT_BODY,
                fontWeight: 600,
                fontSize: 24,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: COLORS.green,
              }}
            >
              {kicker}
            </span>
            {align === "right" && <Bar w={bar} />}
          </div>

          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: 128,
              lineHeight: 1.0,
              letterSpacing: -4,
              color: COLORS.white,
            }}
          >
            <RiseLine
              text={text}
              stagger={2}
              greenWords={greenWords}
              style={{ justifyContent: align === "left" ? "flex-start" : "flex-end" }}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Bar: React.FC<{ w: number }> = ({ w }) => (
  <span
    style={{
      display: "inline-block",
      width: 70 * w,
      height: 6,
      borderRadius: 3,
      background: COLORS.green,
      boxShadow: `0 0 16px ${COLORS.green}`,
    }}
  />
);
