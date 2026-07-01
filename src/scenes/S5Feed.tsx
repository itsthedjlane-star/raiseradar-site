import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { Background } from "../components/Background";
import { RAISES } from "../data";
import { COLORS, FONT_DISPLAY, FONT_BODY } from "../theme";

const COLS = "3.1fr 0.7fr 2fr 1.3fr 1.7fr";
const ROW_START = 22;
const ROW_STEP = 11;

const fmtM = (n: number) => `$${(n / 1_000_000).toFixed(1)}M`;

const Row: React.FC<{ index: number; company: string; state: string; industry: string; amount: number; exec: string }> = ({
  index,
  company,
  state,
  industry,
  amount,
  exec,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = ROW_START + index * ROW_STEP;
  const s = spring({ frame: frame - appear, fps, config: { damping: 18, mass: 0.5, stiffness: 170 } });
  const count = interpolate(frame, [appear, appear + 14], [0, amount], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const flashBg = interpolate(frame, [appear, appear + 10], [0.18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: COLS,
        alignItems: "center",
        padding: "20px 34px",
        borderBottom: `1px solid ${COLORS.line}`,
        fontFamily: FONT_BODY,
        fontSize: 27,
        color: COLORS.ink,
        transform: `translateX(${(1 - s) * -60}px)`,
        opacity: s,
        background: `rgba(22,224,163,${flashBg})`,
      }}
    >
      <div style={{ fontWeight: 600 }}>{company}</div>
      <div style={{ color: COLORS.slate }}>{state}</div>
      <div style={{ color: COLORS.slate }}>{industry}</div>
      <div style={{ fontWeight: 700, color: "#0a8f66", fontVariantNumeric: "tabular-nums", textAlign: "right", paddingRight: 20 }}>
        {fmtM(count)}
      </div>
      <div style={{ color: COLORS.ink, fontWeight: 500 }}>{exec}</div>
    </div>
  );
};

export const S5Feed: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const card = spring({ frame, fps, config: { damping: 16, mass: 0.7, stiffness: 130 } });
  const total = RAISES.reduce((a, r) => a + r.amount, 0);
  const totalCount = interpolate(frame, [ROW_START, ROW_START + RAISES.length * ROW_STEP + 10], [0, total], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const lockFrame = ROW_START + RAISES.length * ROW_STEP + 4;
  const lock = spring({ frame: frame - lockFrame, fps, config: { damping: 18, mass: 0.5, stiffness: 160 } });

  return (
    <AbsoluteFill>
      <Background intensity={0.7} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: 1560,
            transform: `translateY(${(1 - card) * 50}px) scale(${interpolate(card, [0, 1], [0.96, 1])})`,
            opacity: card,
          }}
        >
          {/* eyebrow + running total */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20, padding: "0 6px" }}>
            <div>
              <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 22, letterSpacing: 3, textTransform: "uppercase", color: COLORS.green }}>
                Live sample · last 7 days
              </div>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 46, color: COLORS.white, letterSpacing: -1, marginTop: 6 }}>
                Companies that just raised
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 64, color: COLORS.green, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
                ${(totalCount / 1_000_000).toFixed(0)}M
              </div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 20, color: COLORS.steel, textTransform: "uppercase", letterSpacing: 1 }}>
                raised this week
              </div>
            </div>
          </div>

          {/* card */}
          <div style={{ background: COLORS.white, borderRadius: 20, overflow: "hidden", boxShadow: "0 40px 90px -30px rgba(0,0,0,0.6)" }}>
            {/* header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 34px", background: COLORS.ink }}>
              <b style={{ fontFamily: FONT_DISPLAY, fontSize: 26, color: COLORS.white }}>RaiseRadar — Weekly Feed</b>
              <span style={{ background: COLORS.amber, color: "#3a2600", fontFamily: FONT_BODY, fontWeight: 700, fontSize: 18, padding: "6px 14px", borderRadius: 7, textTransform: "uppercase", letterSpacing: 0.5 }}>
                New this week
              </span>
            </div>
            {/* column labels */}
            <div style={{ display: "grid", gridTemplateColumns: COLS, padding: "14px 34px", background: "#fafcfe", borderBottom: `1px solid ${COLORS.line}`, fontFamily: FONT_BODY, fontSize: 17, letterSpacing: 1, textTransform: "uppercase", color: COLORS.slate, fontWeight: 600 }}>
              <div>Company</div>
              <div>State</div>
              <div>Industry</div>
              <div style={{ textAlign: "right", paddingRight: 20 }}>Raised</div>
              <div>Exec contact</div>
            </div>
            {/* rows */}
            {RAISES.map((r, i) => (
              <Row key={r.company} index={i} {...r} />
            ))}
            {/* locked row */}
            <div
              style={{
                textAlign: "center",
                padding: "22px",
                background: "#fafcfe",
                fontFamily: FONT_BODY,
                fontWeight: 600,
                fontSize: 26,
                color: COLORS.slate,
                opacity: lock,
                transform: `translateY(${(1 - lock) * 20}px)`,
              }}
            >
              🔒 + 1,000 more companies in this week&rsquo;s full feed
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
