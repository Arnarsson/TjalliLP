import React from "react";
import { theme } from "./theme";
import { pulseOpacity } from "./helpers";

interface HeklaCursorProps {
  frame: number;
  isTyping: boolean;
}

export const HeklaCursor: React.FC<HeklaCursorProps> = ({ frame, isTyping }) => {
  const opacity = isTyping ? 1 : pulseOpacity(frame, 0.03);

  return (
    <span
      style={{
        display: "inline-block",
        width: 9,
        height: 16,
        backgroundColor: theme.cream,
        opacity,
        verticalAlign: "middle",
        marginLeft: 2,
        borderRadius: 1,
      }}
    />
  );
};
