import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { HeklaDashboard } from "./HeklaDashboard";
import { theme } from "./theme";

/**
 * Each focused view renders the full dashboard, then uses a camera
 * transform (scale + translate) to smoothly zoom into the relevant
 * region. This keeps visual consistency while highlighting different
 * areas for each landing-page section.
 */

/* ─── MEMORY FOCUS ─── */
// Zooms into bottom-right area: Memory card + Insights card
export const HeklaDashboardMemory: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Wait for dashboard to animate in, then slowly zoom
  const zoomProgress = spring({
    frame: frame - 60,
    fps,
    from: 0,
    to: 1,
    config: { damping: 30, stiffness: 20 },
  });

  const scale = interpolate(zoomProgress, [0, 1], [1, 1.7]);
  // Target: Bottom row (Issues + Memory + Insights) with some context above
  const tx = interpolate(zoomProgress, [0, 1], [0, -140]);
  const ty = interpolate(zoomProgress, [0, 1], [0, -260]);

  // Gentle drift after zoom
  const drift = interpolate(frame, [120, durationInFrames], [0, -15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, overflow: "hidden" }}>
      <div
        style={{
          width: 1440,
          height: 900,
          transform: `scale(${scale}) translate(${tx}px, ${ty + drift}px)`,
          transformOrigin: "center center",
        }}
      >
        <HeklaDashboard />
      </div>
    </AbsoluteFill>
  );
};

/* ─── AGENTS FOCUS ─── */
// Zooms into middle-left area: Agent Activity panel
export const HeklaDashboardAgents: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const zoomProgress = spring({
    frame: frame - 60,
    fps,
    from: 0,
    to: 1,
    config: { damping: 30, stiffness: 20 },
  });

  const scale = interpolate(zoomProgress, [0, 1], [1, 1.65]);
  // Target: Agent panel + Timeline (middle area of main content)
  const tx = interpolate(zoomProgress, [0, 1], [0, -80]);
  const ty = interpolate(zoomProgress, [0, 1], [0, -155]);

  const drift = interpolate(frame, [120, durationInFrames], [0, 12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, overflow: "hidden" }}>
      <div
        style={{
          width: 1440,
          height: 900,
          transform: `scale(${scale}) translate(${tx + drift}px, ${ty}px)`,
          transformOrigin: "center center",
        }}
      >
        <HeklaDashboard />
      </div>
    </AbsoluteFill>
  );
};

/* ─── PRIVATE FOCUS ─── */
// Shows full dashboard with subtle encrypted/secure overlay
export const HeklaDashboardPrivate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Gentle zoom on entire dashboard
  const scale = interpolate(frame, [0, durationInFrames], [1.05, 1.15], {
    extrapolateRight: "clamp",
  });

  // Lock shield overlay fades in
  const overlayOpacity = spring({
    frame: frame - 90,
    fps,
    from: 0,
    to: 1,
    config: { damping: 20, stiffness: 40 },
  });

  // Scanline effect
  const scanY = interpolate(frame, [0, durationInFrames], [-100, 1000], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, overflow: "hidden" }}>
      <div
        style={{
          width: 1440,
          height: 900,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <HeklaDashboard />
      </div>

      {/* Encrypted scan line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: scanY,
          height: 2,
          background: `linear-gradient(90deg, transparent 0%, rgba(212,100,58,0.15) 30%, rgba(212,100,58,0.3) 50%, rgba(212,100,58,0.15) 70%, transparent 100%)`,
          pointerEvents: "none",
          opacity: interpolate(frame, [60, 80], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />

      {/* Shield / lock badge */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          right: 60,
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "rgba(19,17,16,0.85)",
          border: `1px solid rgba(212,100,58,0.3)`,
          borderRadius: 8,
          padding: "10px 18px",
          opacity: overlayOpacity,
          transform: `translateY(${interpolate(overlayOpacity, [0, 1], [10, 0])}px)`,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.orange} strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <div>
          <div
            style={{
              fontFamily: theme.mono,
              fontSize: 10,
              color: theme.orange,
              letterSpacing: "0.15em",
            }}
          >
            ENCRYPTED
          </div>
          <div
            style={{
              fontFamily: theme.mono,
              fontSize: 8,
              color: theme.dim,
              letterSpacing: "0.08em",
            }}
          >
            LOCAL HARDWARE ONLY
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
