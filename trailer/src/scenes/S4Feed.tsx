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

type Row = {
  company: string;
  state: string;
  industry: string;
  amount: string;
  exec: string;
};

// Real rows from the RaiseRadar sample feed.
const ROWS: Row[] = [
  { company: "Star Catcher Industries", state: "FL", industry: "Space Tech", amount: "$65.0M", exec: "Andrew Rush" },
  { company: "Piston Technologies", state: "CA", industry: "Hardware", amount: "$15.0M", exec: "Vikram Sekhon" },
  { company: "Farmers State Bancshares", state: "NE", industry: "Banking", amount: "$15.0M", exec: "Richard Stull" },
  { company: "CB-Emmanuel Realty", state: "NY", industry: "Real Estate", amount: "$6.0M", exec: "Benathan Upshaw" },
  { company: "Dynamic Creatures", state: "CA", industry: "Technology", amount: "$6.0M", exec: "Marc Theermann" },
  { company: "Rely Intelligence", state: "ME", industry: "Technology", amount: "$4.5M", exec: "George Matelich" },
  { company: "Endeavor Orthopaedics", state: "OK", industry: "Health Care", amount: "$3.2M", exec: "Greg Parranto" },
];

const STEP = 8; // frames between rows landing

const FeedRow: React.FC<{ row: Row; index: number; frame: number; fps: number }> = ({
  row,
  index,
  frame,
  fps,
}) => {
  const delay = 8 + index * STEP;
  const s = snap(frame, fps, delay, { damping: 18, stiffness: 240 });
  const opacity = interpolate(s, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
  const x = interpolate(s, [0, 1], [60, 0]);
  // brief green highlight as each row lands
  const hl = interpolate(frame, [delay, delay + 6, delay + 16], [0.0, 0.5, 0.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 70px 200px 150px",
        alignItems: "center",
        gap: 18,
        padding: "20px 30px",
        borderBottom: `1px solid rgba(255,255,255,0.07)`,
        background: `rgba(22,224,163,${hl * 0.18})`,
        opacity,
        transform: `translateX(${x}px)`,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontFamily: fonts.display, fontWeight: 600, fontSize: 30, color: colors.white }}>
          {row.company}
        </span>
        <span style={{ fontFamily: fonts.body, fontSize: 17, color: colors.steel }}>
          {row.exec} · Executive Officer
        </span>
      </div>
      <span
        style={{
          fontFamily: fonts.body,
          fontWeight: 600,
          fontSize: 18,
          color: colors.cloud,
          border: `1px solid rgba(255,255,255,0.15)`,
          borderRadius: 6,
          padding: "4px 0",
          textAlign: "center",
        }}
      >
        {row.state}
      </span>
      <span style={{ fontFamily: fonts.body, fontSize: 20, color: colors.steel }}>{row.industry}</span>
      <span
        style={{
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: 34,
          color: colors.green,
          textAlign: "right",
          fontVariantNumeric: "tabular-nums",
          textShadow: `0 0 ${22 * (0.4 + hl)}px rgba(22,224,163,0.5)`,
        }}
      >
        {row.amount}
      </span>
    </div>
  );
};

export const S4Feed: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ex = exit(frame, dur, 7);

  const panelIn = snap(frame, fps, 0, { damping: 18, stiffness: 200 });
  const panelScale = interpolate(panelIn, [0, 1], [0.96, 1]);

  const lockDelay = 8 + ROWS.length * STEP;
  const lockS = snap(frame, fps, lockDelay, { damping: 18, stiffness: 220 });
  const lockOpacity = interpolate(lockS, [0, 0.6], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <RadarBackground intensity={0.7} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: 1380,
            borderRadius: 20,
            overflow: "hidden",
            border: `1px solid rgba(255,255,255,0.10)`,
            background: "rgba(8,20,33,0.72)",
            backdropFilter: "blur(6px)",
            boxShadow: "0 40px 120px -40px rgba(0,0,0,0.8)",
            transform: `scale(${panelScale * ex.scale})`,
            opacity: ex.opacity,
          }}
        >
          {/* header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 30px",
              background: "rgba(11,31,51,0.9)",
              borderBottom: `1px solid rgba(255,255,255,0.08)`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: colors.green,
                  boxShadow: `0 0 12px ${colors.green}`,
                }}
              />
              <span
                style={{
                  fontFamily: fonts.display,
                  fontWeight: 600,
                  fontSize: 22,
                  color: colors.white,
                  letterSpacing: 0.5,
                }}
              >
                RaiseRadar — Weekly Feed
              </span>
            </div>
            <span
              style={{
                fontFamily: fonts.body,
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: colors.amber,
                background: "rgba(255,176,32,0.14)",
                border: `1px solid rgba(255,176,32,0.4)`,
                padding: "5px 12px",
                borderRadius: 6,
              }}
            >
              ● Raised last week
            </span>
          </div>

          {ROWS.map((row, i) => (
            <FeedRow key={row.company} row={row} index={i} frame={frame} fps={fps} />
          ))}

          {/* locked "more" row */}
          <div
            style={{
              padding: "20px 30px",
              textAlign: "center",
              fontFamily: fonts.display,
              fontWeight: 600,
              fontSize: 24,
              color: colors.green,
              background: "rgba(22,224,163,0.07)",
              opacity: lockOpacity,
            }}
          >
            🔒 + 1,000 more companies in this week&rsquo;s full feed
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
