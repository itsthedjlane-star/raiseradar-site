import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors } from "./theme";

// Deep ink gradient with a slow-rotating radar sweep, faint grid and a
// vignette. Used behind the dark scenes.
export const RadarBackground: React.FC<{
  spin?: boolean;
  intensity?: number;
}> = ({ spin = true, intensity = 1 }) => {
  const frame = useCurrentFrame();
  const sweep = spin ? (frame * 1.4) % 360 : 0;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 120% at 70% 18%, ${colors.ink2} 0%, ${colors.ink} 55%, #071421 100%)`,
      }}
    >
      {/* faint concentric radar rings, oversized + centered upper-right */}
      <AbsoluteFill style={{ opacity: 0.5 * intensity }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
          style={{ position: "absolute" }}
        >
          <g transform="translate(1500 250)">
            {[680, 540, 400, 270, 150].map((r, i) => (
              <circle
                key={r}
                cx="0"
                cy="0"
                r={r}
                fill="none"
                stroke={colors.green}
                strokeWidth="1.5"
                opacity={0.12 - i * 0.012}
              />
            ))}
            <g transform={`rotate(${sweep})`}>
              <path
                d="M0 0 L0 -680 A680 680 0 0 1 470 -490 Z"
                fill={colors.green}
                opacity={0.08 * intensity}
              />
            </g>
          </g>
        </svg>
      </AbsoluteFill>

      {/* subtle scan grid */}
      <AbsoluteFill
        style={{
          opacity: 0.06 * intensity,
          backgroundImage: `linear-gradient(${colors.green} 1px, transparent 1px), linear-gradient(90deg, ${colors.green} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(80% 80% at 50% 50%, black 30%, transparent 75%)",
        }}
      />

      {/* vignette */}
      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 320px 80px rgba(4,12,20,0.7)",
        }}
      />
    </AbsoluteFill>
  );
};
