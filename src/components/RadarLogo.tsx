import React from "react";
import { COLORS } from "../theme";

// The RaiseRadar mark: concentric rings, a rotating sweep wedge, and a pinging
// blip. `sweep` is the wedge rotation in degrees; `blip` (0..1) pulses the dot.
export const RadarLogo: React.FC<{
  size: number;
  sweep?: number;
  blip?: number;
  ringOpacity?: number;
}> = ({ size, sweep = 0, blip = 0, ringOpacity = 1 }) => {
  const blipR = 7 + blip * 3;
  const blipGlow = 0.4 + blip * 0.6;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="44" stroke={COLORS.green} strokeWidth="3" opacity={0.35 * ringOpacity} />
      <circle cx="50" cy="50" r="32" stroke={COLORS.green} strokeWidth="2.5" opacity={0.45 * ringOpacity} />
      <circle cx="50" cy="50" r="20" stroke={COLORS.green} strokeWidth="2" opacity={0.5 * ringOpacity} />
      <circle cx="50" cy="50" r="2.5" fill={COLORS.green} opacity={0.8 * ringOpacity} />
      {/* rotating sweep wedge */}
      <g transform={`rotate(${sweep} 50 50)`}>
        <path d="M50 50 L50 6 A44 44 0 0 1 88 42 Z" fill={COLORS.green} opacity={0.28 * ringOpacity} />
        <line x1="50" y1="50" x2="50" y2="6" stroke={COLORS.green} strokeWidth="1.5" opacity={0.7 * ringOpacity} />
      </g>
      {/* pinging blip */}
      <circle cx="72" cy="32" r={blipR} fill={COLORS.green} opacity={blipGlow} />
      <circle cx="72" cy="32" r={3.5} fill={COLORS.white} opacity={0.9} />
    </svg>
  );
};
