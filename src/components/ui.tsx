import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { COLORS, FONT_BODY, FONT_DISPLAY } from "../theme";

// Snappy overshoot spring for entrances.
export function useSnap(delay = 0, config = { damping: 14, mass: 0.6, stiffness: 140 }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config });
}

// A line whose words rise up + fade in with a stagger. Great for headlines.
export const RiseLine: React.FC<{
  text: string;
  delay?: number;
  stagger?: number;
  style?: React.CSSProperties;
  greenWords?: number[]; // indices of words to paint green
}> = ({ text, delay = 0, stagger = 3, style, greenWords = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0 0.28em", justifyContent: "center", ...style }}>
      {words.map((w, i) => {
        const s = spring({
          frame: frame - delay - i * stagger,
          fps,
          config: { damping: 16, mass: 0.7, stiffness: 150 },
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `translateY(${(1 - s) * 46}px)`,
              opacity: s,
              color: greenWords.includes(i) ? COLORS.green : undefined,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

// Quick full-frame flash — a hard, punchy cut accent on downbeats.
export const Flash: React.FC<{ at: number; color?: string; length?: number; peak?: number }> = ({
  at,
  color = COLORS.white,
  length = 8,
  peak = 0.5,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 1, at + length], [0, peak, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  if (o <= 0.001) return null;
  return <AbsoluteFill style={{ background: color, opacity: o, pointerEvents: "none" }} />;
};

// Brand pill (mirrors the site's status pill).
export const Pill: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      background: COLORS.greenSoft,
      color: COLORS.green,
      border: `1px solid ${COLORS.greenLine}`,
      padding: "10px 22px",
      borderRadius: 999,
      fontFamily: FONT_BODY,
      fontWeight: 600,
      fontSize: 22,
      letterSpacing: 0.2,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Dot: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.35);
  return (
    <span
      style={{
        width: 11,
        height: 11,
        borderRadius: "50%",
        background: COLORS.green,
        boxShadow: `0 0 ${6 + pulse * 12}px ${COLORS.green}`,
        display: "inline-block",
      }}
    />
  );
};

// Format a dollar amount compactly ($64,999,966 -> $65.0M).
export function formatUSD(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${Math.round(n)}`;
}

export { COLORS, FONT_BODY, FONT_DISPLAY };
