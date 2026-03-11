import { spring, interpolate } from "remotion";

export const fadeIn = (
  frame: number,
  fps: number,
  delay: number = 0
): number => {
  return spring({
    frame: frame - delay,
    fps,
    from: 0,
    to: 1,
    config: { damping: 20, stiffness: 100 },
  });
};

export const slideUp = (
  frame: number,
  fps: number,
  delay: number = 0,
  distance: number = 30
): { opacity: number; y: number } => {
  const progress = spring({
    frame: frame - delay,
    fps,
    from: 0,
    to: 1,
    config: { damping: 15, stiffness: 80 },
  });
  return {
    opacity: progress,
    y: interpolate(progress, [0, 1], [distance, 0]),
  };
};

export const slideRight = (
  frame: number,
  fps: number,
  delay: number = 0,
  distance: number = 40
): { opacity: number; x: number } => {
  const progress = spring({
    frame: frame - delay,
    fps,
    from: 0,
    to: 1,
    config: { damping: 15, stiffness: 80 },
  });
  return {
    opacity: progress,
    x: interpolate(progress, [0, 1], [-distance, 0]),
  };
};

export const scaleIn = (
  frame: number,
  fps: number,
  delay: number = 0
): { opacity: number; scale: number } => {
  const progress = spring({
    frame: frame - delay,
    fps,
    from: 0,
    to: 1,
    config: { damping: 12, stiffness: 100 },
  });
  return {
    opacity: progress,
    scale: interpolate(progress, [0, 1], [0.85, 1]),
  };
};

export const countUp = (
  frame: number,
  fps: number,
  delay: number,
  target: number,
  duration: number = 30
): number => {
  const start = delay;
  const end = delay + duration;
  const progress = interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return Math.round(progress * target);
};

export const barGrow = (
  frame: number,
  fps: number,
  delay: number,
  targetHeight: number
): number => {
  const progress = spring({
    frame: frame - delay,
    fps,
    from: 0,
    to: 1,
    config: { damping: 18, stiffness: 60 },
  });
  return progress * targetHeight;
};

export const progressFill = (
  frame: number,
  fps: number,
  delay: number,
  targetPercent: number
): number => {
  const progress = spring({
    frame: frame - delay,
    fps,
    from: 0,
    to: 1,
    config: { damping: 20, stiffness: 40 },
  });
  return progress * targetPercent;
};

export const pulseOpacity = (frame: number, speed: number = 0.05): number => {
  return 0.5 + 0.5 * Math.sin(frame * speed * Math.PI * 2);
};
