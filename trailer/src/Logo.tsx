import React from "react";
import { colors } from "./theme";

// The radar mark from the site, with an optional sweeping wedge + blip.
export const RadarMark: React.FC<{
  size?: number;
  sweepDeg?: number; // rotation of the sweep wedge
  glow?: number; // 0..1 glow intensity on the blip
}> = ({ size = 120, sweepDeg = 0, glow = 1 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <defs>
        <radialGradient id="sweepGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={colors.green} stopOpacity="0.0" />
          <stop offset="100%" stopColor={colors.green} stopOpacity="0.55" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="46" stroke={colors.green} strokeWidth="1.6" opacity="0.30" />
      <circle cx="50" cy="50" r="34" stroke={colors.green} strokeWidth="1.6" opacity="0.26" />
      <circle cx="50" cy="50" r="22" stroke={colors.green} strokeWidth="1.6" opacity="0.22" />
      <circle cx="50" cy="50" r="10" stroke={colors.green} strokeWidth="1.6" opacity="0.20" />
      {/* sweeping wedge */}
      <g transform={`rotate(${sweepDeg} 50 50)`}>
        <path d="M50 50 L50 4 A46 46 0 0 1 92 38 Z" fill="url(#sweepGrad)" />
      </g>
      {/* blip */}
      <circle
        cx="72"
        cy="32"
        r="6"
        fill={colors.green}
        style={{ filter: `drop-shadow(0 0 ${6 * glow}px ${colors.green})` }}
      />
    </svg>
  );
};

// Full wordmark lockup: radar + "Raise" + "Radar"
export const Wordmark: React.FC<{
  fontFamily: string;
  fontSize?: number;
  markSize?: number;
  sweepDeg?: number;
}> = ({ fontFamily, fontSize = 64, markSize, sweepDeg = 0 }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: fontSize * 0.28 }}>
      <RadarMark size={markSize ?? fontSize * 1.35} sweepDeg={sweepDeg} />
      <div
        style={{
          fontFamily,
          fontWeight: 700,
          fontSize,
          color: colors.white,
          letterSpacing: -1,
          lineHeight: 1,
        }}
      >
        Raise<span style={{ color: colors.green }}>Radar</span>
      </div>
    </div>
  );
};
