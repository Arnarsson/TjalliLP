import React from "react";
import { interpolate, Easing, useCurrentFrame } from "remotion";
import { theme } from "./theme";

interface HeklaBrandRevealProps {
  frame?: number;
}

const fadeSlide = (frame: number, delay: number): { opacity: number; y: number } => {
  const f = Math.max(0, frame - delay);
  const progress = interpolate(f, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return {
    opacity: progress,
    y: interpolate(progress, [0, 1], [24, 0]),
  };
};

export const HeklaBrandReveal: React.FC<HeklaBrandRevealProps> = ({ frame: frameProp }) => {
  const currentFrame = useCurrentFrame();
  const frame = frameProp ?? currentFrame;
  const wordmark = fadeSlide(frame, 0);
  const subtagline = fadeSlide(frame, 12);
  const statusLine = fadeSlide(frame, 22);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        textAlign: "center",
      }}
    >
      {/* HEKLA wordmark */}
      <div
        style={{
          fontFamily: theme.serif,
          fontSize: 96,
          letterSpacing: "0.12em",
          color: theme.cream,
          opacity: wordmark.opacity,
          transform: `translateY(${wordmark.y}px)`,
          lineHeight: 1,
        }}
      >
        HEKLA
      </div>

      {/* Sub-tagline */}
      <div
        style={{
          fontFamily: theme.sans,
          fontSize: 18,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: theme.body,
          opacity: subtagline.opacity,
          transform: `translateY(${subtagline.y}px)`,
        }}
      >
        Personal AI · Encrypted · Everywhere
      </div>

      {/* Status line */}
      <div
        style={{
          fontFamily: theme.mono,
          fontSize: 13,
          color: theme.dim,
          display: "flex",
          alignItems: "center",
          gap: 8,
          opacity: statusLine.opacity,
          transform: `translateY(${statusLine.y}px)`,
          marginTop: 8,
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: theme.orange,
          }}
        />
        Spring 2026 · 20 units
      </div>
    </div>
  );
};
