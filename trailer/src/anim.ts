import { interpolate, spring } from "remotion";

// A snappy spring (fast, slightly punchy) for "slam-in" elements.
export const snap = (
  frame: number,
  fps: number,
  delay = 0,
  config: { damping?: number; stiffness?: number; mass?: number } = {}
) =>
  spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 220, mass: 0.7, ...config },
    durationInFrames: undefined,
  });

// Punchy entrance: returns {scale, opacity, y} that slams in then settles.
export const slamIn = (frame: number, fps: number, delay = 0) => {
  const s = snap(frame, fps, delay, { damping: 12, stiffness: 200 });
  return {
    scale: interpolate(s, [0, 1], [1.18, 1]),
    opacity: interpolate(s, [0, 0.6], [0, 1], { extrapolateRight: "clamp" }),
    y: interpolate(s, [0, 1], [26, 0]),
  };
};

// Rise-up entrance (used for stacked words / list rows).
export const riseIn = (frame: number, fps: number, delay = 0) => {
  const s = snap(frame, fps, delay, { damping: 16, stiffness: 180 });
  return {
    opacity: interpolate(s, [0, 0.5], [0, 1], { extrapolateRight: "clamp" }),
    y: interpolate(s, [0, 1], [40, 0]),
  };
};

// Quick exit fade+shrink near the end of a sequence.
export const exit = (
  frame: number,
  duration: number,
  outFrames = 8
) => {
  const start = duration - outFrames;
  return {
    opacity: interpolate(frame, [start, duration], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    scale: interpolate(frame, [start, duration], [1, 0.96], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  };
};
