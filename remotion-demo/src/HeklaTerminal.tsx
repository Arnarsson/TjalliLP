import React from "react";
import { theme } from "./theme";
import { HeklaTerminalContent } from "./HeklaTerminalContent";

interface HeklaTerminalProps {
  frame: number;
  width?: number;
}

const TRAFFIC_LIGHTS = [
  { color: "#FF5F57" }, // red
  { color: "#FFBD2E" }, // yellow
  { color: "#28CA41" }, // green
];

export const HeklaTerminal: React.FC<HeklaTerminalProps> = ({
  frame,
  width = 560,
}) => {
  return (
    <div
      style={{
        width,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow:
          "0 32px 80px rgba(0,0,0,0.8), 0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          background: "#1E1D1B",
          height: 44,
          display: "flex",
          alignItems: "center",
          paddingLeft: 16,
          gap: 8,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {TRAFFIC_LIGHTS.map((light, i) => (
          <div
            key={i}
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: light.color,
              opacity: 0.85,
            }}
          />
        ))}
        <div
          style={{
            flex: 1,
            textAlign: "center",
            fontFamily: theme.mono,
            fontSize: 12,
            color: theme.dim,
            marginRight: 52, // offset for traffic lights
          }}
        >
          hekla — bash
        </div>
      </div>

      {/* Content area */}
      <div
        style={{
          background: "#131110",
          minHeight: 280,
        }}
      >
        <HeklaTerminalContent frame={frame} />
      </div>
    </div>
  );
};
