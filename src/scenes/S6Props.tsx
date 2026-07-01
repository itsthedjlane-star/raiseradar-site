import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "../components/Background";
import { COLORS, FONT_DISPLAY, FONT_BODY } from "../theme";

const CARDS = [
  { n: "01", icon: "💸", title: "Fresh capital, ready budget", sub: "Every raise closed in the last 7 days." },
  { n: "02", icon: "👤", title: "A named decision-maker", sub: "A real exec on every row — never info@." },
  { n: "03", icon: "🛡️", title: "100% official SEC data", sub: "Public Form D filings. Full provenance." },
];

const ValueCard: React.FC<{ n: string; icon: string; title: string; sub: string }> = ({ n, icon, title, sub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14, mass: 0.6, stiffness: 160 } });
  const out = interpolate(frame, [24, 30], [1, 0.86], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {/* giant ghost index */}
      <div
        style={{
          position: "absolute",
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          fontSize: 500,
          color: "rgba(22,224,163,0.055)",
          right: 130,
          bottom: 70,
          letterSpacing: -14,
          lineHeight: 1,
        }}
      >
        {n}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 48, transform: `scale(${interpolate(s, [0, 1], [0.8, 1]) * out})`, opacity: s }}>
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: 30,
            background: COLORS.greenSoft,
            border: `1px solid ${COLORS.greenLine}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 80,
            transform: `translateY(${(1 - s) * 30}px)`,
          }}
        >
          {icon}
        </div>
        <div style={{ maxWidth: 900 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 82, lineHeight: 1.02, letterSpacing: -2, color: COLORS.white }}>
            {title}
          </div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 34, color: COLORS.cloud, marginTop: 16 }}>{sub}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const S6Props: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      {CARDS.map((c, i) => (
        <Sequence key={c.n} from={i * 30} durationInFrames={30}>
          <ValueCard {...c} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
