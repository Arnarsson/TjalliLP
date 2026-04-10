import React from "react";
import { interpolate, Easing, useCurrentFrame } from "remotion";
import { theme } from "./theme";

interface HeklaTaglineProps {
  frame?: number;
  fps?: number;
}

const scaleIn = (frame: number, delay: number): { opacity: number; scale: number; y: number } => {
  const f = Math.max(0, frame - delay);
  const progress = interpolate(f, [0, 18], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return {
    opacity: progress,
    scale: interpolate(progress, [0, 1], [0.88, 1]),
    y: interpolate(progress, [0, 1], [20, 0]),
  };
};

export const HeklaTagline: React.FC<HeklaTaglineProps> = ({ frame: frameProp }) => {
  const currentFrame = useCurrentFrame();
  const frame = frameProp ?? currentFrame;
  const line1 = scaleIn(frame, 0);
  const line2 = scaleIn(frame, 20);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        textAlign: "center",
        padding: "0 60px",
      }}
    >
      {/* Line 1 */}
      <div
        style={{
          fontFamily: theme.serif,
          fontSize: 52,
          color: theme.cream,
          lineHeight: 1.15,
          opacity: line1.opacity,
          transform: `scale(${line1.scale}) translateY(${line1.y}px)`,
        }}
      >
        "40 tabs open in your head."
      </div>

      {/* Line 2 */}
      <div
        style={{
          fontFamily: theme.serif,
          fontSize: 52,
          color: theme.cream,
          lineHeight: 1.15,
          opacity: line2.opacity,
          transform: `scale(${line2.scale}) translateY(${line2.y}px)`,
        }}
      >
        {"HEKLA closes "}
        <span style={{ color: theme.orange }}>39</span>
        {" of them."}
      </div>
    </div>
  );
};
