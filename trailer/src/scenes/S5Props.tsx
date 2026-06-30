import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { RadarBackground } from "../Background";
import { colors, fonts } from "../theme";
import { exit, snap } from "../anim";

const CARDS = [
  { icon: "💸", title: "FRESH CAPITAL", sub: "New money, a budget ready to spend" },
  { icon: "👤", title: "A NAMED EXEC", sub: "A real decision-maker — not info@" },
  { icon: "🛡️", title: "SEC-OFFICIAL", sub: "100% public filings. Full provenance." },
  { icon: "📥", title: "ZERO WORK", sub: "Filtered to your niche, in your inbox" },
];

const CARD_LEN = 18;

export const S5Props: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ex = exit(frame, dur, 6);

  const idx = Math.min(CARDS.length - 1, Math.floor(frame / CARD_LEN));
  const local = frame - idx * CARD_LEN;
  const card = CARDS[idx];

  const s = snap(local, fps, 0, { damping: 13, stiffness: 260 });
  const scale = interpolate(s, [0, 1], [1.22, 1]);
  const opacity = interpolate(s, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  // quick flash at each card start
  const flash = interpolate(local, [0, 4], [0.35, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <RadarBackground intensity={0.8} />
      <AbsoluteFill style={{ background: colors.green, opacity: flash }} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: ex.opacity,
        }}
      >
        <div
          style={{
            transform: `scale(${scale * ex.scale})`,
            opacity,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              width: 130,
              height: 130,
              borderRadius: 28,
              background: "rgba(22,224,163,0.14)",
              border: `1px solid rgba(22,224,163,0.35)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 64,
            }}
          >
            {card.icon}
          </div>
          <div
            style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 110,
              letterSpacing: -2,
              color: colors.white,
              lineHeight: 1,
            }}
          >
            {card.title}
          </div>
          <div
            style={{
              fontFamily: fonts.body,
              fontWeight: 500,
              fontSize: 32,
              color: colors.cloud,
            }}
          >
            {card.sub}
          </div>
        </div>
      </AbsoluteFill>

      {/* progress pips */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 80 }}>
        <div style={{ display: "flex", gap: 12 }}>
          {CARDS.map((_, i) => (
            <span
              key={i}
              style={{
                width: i === idx ? 38 : 12,
                height: 8,
                borderRadius: 4,
                background: i === idx ? colors.green : "rgba(255,255,255,0.22)",
                transition: "all 0.2s",
              }}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
