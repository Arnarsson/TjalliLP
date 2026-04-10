import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { loadFont as loadDMSans } from "@remotion/google-fonts/DMSans";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import { theme } from "./theme";

loadDMSans();
loadJetBrainsMono();

// ─── Helpers ──────────────────────────────────────────────────────────────────

const slideRight = (frame: number, fps: number, delay: number) => {
  const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 80 } });
  return {
    opacity: Math.max(0, interpolate(s, [0, 1], [0, 1])),
    transform: `translateX(${interpolate(s, [0, 1], [20, 0])}px)`,
  };
};

const slideUp = (frame: number, fps: number, delay: number) => {
  const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 80 } });
  return {
    opacity: Math.max(0, interpolate(s, [0, 1], [0, 1])),
    transform: `translateY(${interpolate(s, [0, 1], [20, 0])}px)`,
  };
};

const countUp = (frame: number, startFrame: number, targetVal: number, endFrame: number) => {
  const p = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return Math.floor(p * targetVal);
};

const progressFill = (frame: number, delay: number, maxWidth: number) => {
  return interpolate(frame, [delay, delay + 40], [0, maxWidth], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
};

// ─── Sparkline ────────────────────────────────────────────────────────────────

const Sparkline: React.FC<{
  values: number[];
  frame: number;
  delay: number;
  color: string;
  id: string;
}> = ({ values, frame, delay, color, id }) => {
  const W = 80, H = 20;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * W;
      const y = H - ((v - min) / range) * (H - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const clipW = progressFill(frame, delay, W);

  return (
    <svg width={W} height={H} style={{ overflow: "visible", display: "block" }}>
      <defs>
        <clipPath id={`sparkClip-${id}`}>
          <rect x={0} y={0} height={H} width={clipW} />
        </clipPath>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
        clipPath={`url(#sparkClip-${id})`}
        opacity={0.9}
      />
    </svg>
  );
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Today",    active: true,  badge: null },
  { label: "Inbox",   active: false, badge: "23" },
  { label: "Calendar",active: false, badge: null },
  { label: "CRM",     active: false, badge: null },
  { label: "Memory",  active: false, badge: null },
  { label: "Agents",  active: false, badge: null },
];

const LOG_LINES = [
  "Inbox triaged — 23 emails processed, 4 flagged",
  "Research: Nordic Ventures brief — 12 sources compiled",
  "Calendar: 2 conflicts resolved, prep notes ready",
  "CRM: Freya Lindqvist record enriched from LinkedIn",
  "Memory indexed: 3 new decisions stored",
  "Draft ready: follow-up to Apex Partners",
  "Pattern detected: 3 LPs mentioned Series A timeline",
  "All agents nominal — 47 tasks completed today",
];

const AGENTS_DATA = [
  {
    name: "Inbox Agent",
    color: "#D4643A",
    initials: "IA",
    task: "Triaging · flagging · categorizing",
    sparkline: [2,4,3,6,5,8,7,9,11,10,13,12],
    stat: "847 processed",
    progress: 0.87,
    delay: 30,
  },
  {
    name: "Research Agent",
    color: "#5CB06E",
    initials: "RA",
    task: "Compiling Nordic Ventures brief",
    sparkline: [1,2,3,2,4,5,4,6,5,7,8,9],
    stat: "12 sources",
    progress: 0.72,
    delay: 42,
  },
  {
    name: "Calendar Agent",
    color: "#6C87D9",
    initials: "CA",
    task: "Resolving conflicts · writing prep notes",
    sparkline: [3,3,4,5,4,6,5,6,7,6,8,7],
    stat: "6 synced",
    progress: 0.64,
    delay: 54,
  },
];

const CMD_TEXT = "summarize my week for the board meeting";

// ─── Main component ───────────────────────────────────────────────────────────

export const HeklaPromoMain: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade-in for activity log label
  const actLogLabelOpa = interpolate(frame, [18, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Memory counter value
  const memoryCount = countUp(frame, 40, 19360, 45);

  // Command typing
  const cmdLen = Math.floor(
    interpolate(frame, [95, 140], [0, CMD_TEXT.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const cursor = frame % 15 < 8 ? "█" : " ";

  return (
    <AbsoluteFill
      style={{
        background: theme.bg,
        display: "flex",
        flexDirection: "row",
        fontFamily: theme.sans,
      }}
    >
      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <div
        style={{
          width: 180,
          borderRight: `1px solid ${theme.cardHi}`,
          display: "flex",
          flexDirection: "column",
          padding: "24px 0",
          flexShrink: 0,
        }}
      >
        {/* Brand */}
        <div style={{ padding: "0 16px", marginBottom: 28, display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: theme.orange,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: theme.mono,
              fontSize: 14,
              fontWeight: 700,
              color: theme.cream,
              flexShrink: 0,
            }}
          >
            H
          </div>
          <div>
            <div style={{ fontFamily: theme.mono, fontSize: 11, color: theme.cream, fontWeight: 600, letterSpacing: "0.12em" }}>HEKLA</div>
            <div style={{ fontFamily: theme.mono, fontSize: 8, color: theme.dim, letterSpacing: "0.08em", marginTop: 1 }}>Private Assistant</div>
          </div>
        </div>

        {/* Nav items */}
        {NAV_ITEMS.map((item, i) => {
          const anim = slideRight(frame, fps, 12 + i * 3);
          return (
            <div
              key={item.label}
              style={{
                ...anim,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 16px",
                marginBottom: 2,
                borderRadius: 6,
                background: item.active ? theme.cardHi : "transparent",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  fontFamily: theme.sans,
                  fontSize: 12,
                  color: item.active ? theme.cream : theme.body,
                  fontWeight: item.active ? 500 : 400,
                }}
              >
                {item.label}
              </span>
              {item.badge && (
                <span
                  style={{
                    fontFamily: theme.mono,
                    fontSize: 9,
                    color: theme.orange,
                    background: "rgba(212,100,58,0.12)",
                    borderRadius: 10,
                    padding: "1px 5px",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Memory counter */}
        <div style={{ padding: "0 16px", marginBottom: 12 }}>
          <div style={{ fontFamily: theme.mono, fontSize: 9, color: theme.orange, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>
            MEMORIES
          </div>
          <div style={{ fontFamily: theme.mono, fontSize: 20, color: theme.cream, fontWeight: 600, lineHeight: 1.1 }}>
            {memoryCount.toLocaleString()}
          </div>
        </div>

        {/* Encryption badge */}
        <div
          style={{
            margin: "0 12px",
            padding: "6px 10px",
            background: theme.card,
            borderRadius: 6,
            border: `1px solid ${theme.cardHi}`,
          }}
        >
          <span style={{ fontFamily: theme.mono, fontSize: 9, color: theme.green, letterSpacing: "0.06em" }}>
            🔒 E2E encrypted
          </span>
        </div>
      </div>

      {/* ── Main area ─────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {/* Today header */}
        <div
          style={{
            padding: "40px 40px 0",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          {/* Left: greeting */}
          <div>
            <div style={{ fontFamily: theme.mono, fontSize: 9, color: theme.dim, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>
              12 MAR 2026 · WEDNESDAY
            </div>
            <div style={{
              ...slideUp(frame, fps, 14),
              fontFamily: theme.serif,
              fontSize: 38,
              color: theme.cream,
              lineHeight: 1.2,
              marginBottom: 8,
            }}>
              Good morning,{" "}
              <span style={{ color: theme.orange }}>Elena</span>
            </div>
            <div style={{
              ...slideUp(frame, fps, 22),
              fontFamily: theme.sans,
              fontSize: 14,
              color: theme.dim,
            }}>
              3 agents active · 47 tasks today · inbox clear
            </div>
          </div>

          {/* Right: clock */}
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontFamily: theme.mono,
                fontSize: 76,
                color: theme.cream,
                lineHeight: 1,
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              09:14
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end", marginTop: 6 }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: theme.green,
                  boxShadow: `0 0 6px ${theme.green}`,
                  opacity: 0.7 + 0.3 * Math.sin(frame * 0.15),
                }}
              />
              <span style={{ fontFamily: theme.mono, fontSize: 9, color: theme.dim, letterSpacing: "0.12em" }}>
                ALL SYSTEMS ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Activity log */}
        <div
          style={{
            position: "absolute",
            top: 200,
            left: 40,
            right: 370,
          }}
        >
          <div
            style={{
              fontFamily: theme.mono,
              fontSize: 9,
              color: theme.dim,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 12,
              opacity: actLogLabelOpa,
            }}
          >
            LIVE ACTIVITY
          </div>
          {LOG_LINES.map((line, i) => {
            const opa = interpolate(frame, [22 + i * 10, 22 + i * 10 + 8], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  marginBottom: 10,
                  opacity: opa,
                }}
              >
                <span style={{ fontFamily: theme.mono, fontSize: 11, color: theme.orange, flexShrink: 0, marginTop: 0 }}>▸</span>
                <span style={{ fontFamily: theme.mono, fontSize: 11, color: theme.cream, lineHeight: 1.4 }}>{line}</span>
              </div>
            );
          })}
        </div>

        {/* Agent panel */}
        <div
          style={{
            position: "absolute",
            right: 40,
            top: 200,
            width: 310,
          }}
        >
          <div
            style={{
              fontFamily: theme.mono,
              fontSize: 9,
              color: theme.dim,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 12,
              opacity: actLogLabelOpa,
            }}
          >
            ACTIVE AGENTS
          </div>

          {AGENTS_DATA.map((agent, i) => {
            const cardAnim = slideUp(frame, fps, 30 + i * 12);
            const barW = progressFill(frame, agent.delay + 15, 282);
            const barFill = barW * agent.progress;
            const dotOpa = 0.6 + 0.4 * Math.sin(frame * 0.12 + i * 2.1);

            return (
              <div
                key={agent.name}
                style={{
                  ...cardAnim,
                  background: theme.card,
                  borderRadius: 8,
                  padding: 14,
                  marginBottom: 10,
                  border: `1px solid ${theme.cardHi}`,
                }}
              >
                {/* Row 1: Avatar + name + status */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: agent.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: theme.mono,
                      fontSize: 9,
                      color: "#fff",
                      fontWeight: 700,
                      flexShrink: 0,
                      opacity: 0.9,
                    }}
                  >
                    {agent.initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontFamily: theme.sans, fontSize: 13, color: theme.cream, fontWeight: 500 }}>
                      {agent.name}
                    </span>
                  </div>
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: theme.green,
                      boxShadow: `0 0 4px ${theme.green}`,
                      opacity: dotOpa,
                    }}
                  />
                </div>

                {/* Row 2: Task description */}
                <div
                  style={{
                    fontFamily: theme.mono,
                    fontSize: 10,
                    color: theme.dim,
                    marginBottom: 8,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {agent.task}
                </div>

                {/* Row 3: Sparkline + stat */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Sparkline
                    values={agent.sparkline}
                    frame={frame}
                    delay={agent.delay + 10}
                    color={agent.color}
                    id={`agent-${i}`}
                  />
                  <span style={{ fontFamily: theme.mono, fontSize: 9, color: theme.orange }}>{agent.stat}</span>
                </div>

                {/* Row 4: Progress bar */}
                <div style={{ height: 3, background: theme.cardHi, borderRadius: 2, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: barFill,
                      background: agent.color,
                      borderRadius: 2,
                      opacity: 0.8,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Command bar ───────────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 180,
          right: 0,
          height: 44,
          borderTop: `1px solid ${theme.cardHi}`,
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 8,
          background: theme.bg,
        }}
      >
        <span style={{ fontFamily: theme.mono, fontSize: 14, color: theme.orange }}>~</span>
        <span style={{ fontFamily: theme.mono, fontSize: 12, color: theme.body }}>
          {CMD_TEXT.slice(0, cmdLen)}
        </span>
        <span style={{ fontFamily: theme.mono, fontSize: 12, color: theme.orange }}>{cursor}</span>
      </div>
    </AbsoluteFill>
  );
};
