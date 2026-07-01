import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { Background } from "../components/Background";
import { RiseLine } from "../components/ui";
import { COLORS, FONT_DISPLAY, FONT_BODY } from "../theme";

const Stat: React.FC<{ delay: number; value: React.ReactNode; label: string }> = ({ delay, value, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 13, mass: 0.6, stiffness: 170 } });
  return (
    <div style={{ textAlign: "center", transform: `translateY(${(1 - s) * 40}px) scale(${interpolate(s, [0, 1], [0.7, 1])})`, opacity: s, flex: 1 }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 120, color: COLORS.green, letterSpacing: -3, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
        {value}
      </div>
      <div style={{ fontFamily: FONT_BODY, fontWeight: 500, fontSize: 26, color: COLORS.steel, textTransform: "uppercase", letterSpacing: 2, marginTop: 16 }}>
        {label}
      </div>
    </div>
  );
};

export const S7Stats: React.FC = () => {
  const frame = useCurrentFrame();
  const raises = Math.round(
    interpolate(frame, [4, 26], [0, 1300], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
  );
  const pct = Math.round(
    interpolate(frame, [10, 30], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
  );

  return (
    <AbsoluteFill>
      <Background intensity={0.85} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 58, color: COLORS.white, letterSpacing: -1.5, marginBottom: 64 }}>
          <RiseLine text="The whole market, every Monday." greenWords={[2, 3]} />
        </div>
        <div style={{ display: "flex", width: 1500, alignItems: "flex-start", justifyContent: "space-between", gap: 40 }}>
          <Stat delay={2} value={`${raises.toLocaleString()}+`} label="New raises / week" />
          <Divider />
          <Stat delay={8} value={`${pct}%`} label="Official SEC data" />
          <Divider />
          <Stat delay={14} value="Mon" label="In your inbox" />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Divider: React.FC = () => (
  <div style={{ width: 1, alignSelf: "stretch", background: "rgba(255,255,255,0.12)", margin: "10px 0" }} />
);
