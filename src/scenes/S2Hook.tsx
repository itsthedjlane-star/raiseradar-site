import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Background } from "../components/Background";
import { RiseLine } from "../components/ui";
import { COLORS, FONT_DISPLAY } from "../theme";

export const S2Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame * 0.08) * 4;

  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: 150,
            lineHeight: 1.02,
            letterSpacing: -5,
            color: COLORS.white,
            textAlign: "center",
            transform: `translateY(${drift}px)`,
            textShadow: "0 20px 60px rgba(0,0,0,0.35)",
          }}
        >
          <RiseLine text="Know who" delay={0} />
          <RiseLine text="just got funded." delay={7} greenWords={[0, 1, 2]} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
