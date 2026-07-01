import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

// Deep navy field with a slow-rotating radar sweep anchored to the right, a
// faint dot grid, drifting concentric rings, vignette and film grain. Shared
// across scenes for visual continuity. `frame` is absolute (video timeline) so
// the background keeps moving through hard scene cuts.
export const Background: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const frame = useCurrentFrame();
  const sweep = (frame * 1.1) % 360;

  return (
    <AbsoluteFill>
      {/* base gradient */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(155deg, ${COLORS.inkDeep} 0%, ${COLORS.ink} 45%, ${COLORS.inkMid} 100%)`,
        }}
      />

      {/* dot grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(rgba(22,224,163,0.10) 1.4px, transparent 1.4px)`,
          backgroundSize: "46px 46px",
          opacity: 0.5 * intensity,
          maskImage:
            "radial-gradient(120% 90% at 70% 40%, #000 20%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(120% 90% at 70% 40%, #000 20%, transparent 75%)",
        }}
      />

      {/* large radar off to the right */}
      <div
        style={{
          position: "absolute",
          right: -420,
          top: -260,
          width: 1500,
          height: 1500,
          opacity: 0.5 * intensity,
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="47" stroke={COLORS.green} strokeWidth="0.25" opacity="0.35" />
          <circle cx="50" cy="50" r="36" stroke={COLORS.green} strokeWidth="0.25" opacity="0.28" />
          <circle cx="50" cy="50" r="25" stroke={COLORS.green} strokeWidth="0.25" opacity="0.22" />
          <circle cx="50" cy="50" r="14" stroke={COLORS.green} strokeWidth="0.25" opacity="0.18" />
          <g transform={`rotate(${sweep} 50 50)`}>
            <defs>
              <linearGradient id="bgsweep" x1="50" y1="50" x2="50" y2="3" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor={COLORS.green} stopOpacity="0.30" />
                <stop offset="1" stopColor={COLORS.green} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M50 50 L50 3 A47 47 0 0 1 92 34 Z" fill="url(#bgsweep)" />
            <line x1="50" y1="50" x2="50" y2="3" stroke={COLORS.green} strokeWidth="0.3" opacity="0.5" />
          </g>
        </svg>
      </div>

      {/* vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 120% at 50% 45%, transparent 45%, rgba(4,10,18,0.55) 100%)",
        }}
      />

      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};

// Subtle animated film grain via SVG turbulence.
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.06 }) => {
  const frame = useCurrentFrame();
  const seed = (frame % 12) + 1;
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        <filter id={`grain${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};
