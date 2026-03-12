import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { loadFont as loadInstrumentSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadDMSans } from "@remotion/google-fonts/DMSans";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import { theme } from "./theme";

loadInstrumentSerif();
loadDMSans();
loadJetBrainsMono();

const fade = (frame: number, fps: number, delay: number) =>
  spring({ frame: frame - delay, fps, from: 0, to: 1, config: { damping: 20, stiffness: 80 } });

const slideUp = (frame: number, fps: number, delay: number) => {
  const p = spring({ frame: frame - delay, fps, from: 0, to: 1, config: { damping: 15, stiffness: 70 } });
  return { opacity: p, y: interpolate(p, [0, 1], [24, 0]) };
};

const slideRight = (frame: number, fps: number, delay: number) => {
  const p = spring({ frame: frame - delay, fps, from: 0, to: 1, config: { damping: 15, stiffness: 70 } });
  return { opacity: p, x: interpolate(p, [0, 1], [-30, 0]) };
};

const pulse = (frame: number, speed = 0.04) => 0.5 + 0.5 * Math.sin(frame * speed * Math.PI * 2);

/* ── DATA ── */
const agents = [
  { id: "agent-01", name: "Email Drafter", status: "running", icon: "✉️", color: theme.green },
  { id: "agent-02", name: "Meeting Prep", status: "idle", icon: "📋", color: theme.blue },
  { id: "agent-03", name: "CRM Updater", status: "completed", icon: "🔄", color: theme.purple },
  { id: "agent-04", name: "Research Bot", status: "running", icon: "🔍", color: theme.orange },
  { id: "agent-05", name: "Report Builder", status: "queued", icon: "📊", color: theme.dim },
];

const currentTask = {
  agent: "Email Drafter",
  task: "Draft follow-up email to Nordic Ventures",
  context: "Based on strategy call (2h ago) — key topics: Q2 pipeline review, Series A timeline, co-investment structure",
  steps: [
    { label: "Analyzing call transcript", status: "done", time: "2.1s" },
    { label: "Extracting action items", status: "done", time: "1.4s" },
    { label: "Drafting email body", status: "active", time: "3.8s" },
    { label: "Reviewing tone & compliance", status: "pending", time: "" },
    { label: "Awaiting approval", status: "pending", time: "" },
  ],
};

const approvalQueue = [
  { title: "Follow-up email — Nordic Ventures", agent: "Email Drafter", priority: "high", time: "Just now" },
  { title: "Update CRM: Freya Lindqvist contact", agent: "CRM Updater", priority: "medium", time: "5m ago" },
  { title: "Weekly report — investor pipeline", agent: "Report Builder", priority: "low", time: "12m ago" },
];

const recentCompletions = [
  { task: "Meeting brief: Apex Partners sync", agent: "Meeting Prep", duration: "4.2s", time: "15m ago" },
  { task: "CRM update: 3 contact records", agent: "CRM Updater", duration: "1.8s", time: "22m ago" },
  { task: "Research: Nordic LP landscape", agent: "Research Bot", duration: "12.6s", time: "1h ago" },
  { task: "Email draft: Board deck review", agent: "Email Drafter", duration: "5.1s", time: "2h ago" },
];

const statusColors: Record<string, string> = {
  running: theme.green,
  idle: theme.dim,
  completed: theme.blue,
  queued: theme.orange,
  done: theme.green,
  active: theme.orange,
  pending: theme.dim,
  high: theme.orange,
  medium: theme.blue,
  low: theme.dim,
};

export const AgentsScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.02], { extrapolateRight: "clamp" });

  // Typing animation for the draft preview
  const draftText = "Dear Freya,\n\nThank you for the productive conversation earlier today regarding the Q2 pipeline and co-investment structure. As discussed, I'd like to outline the next steps...";
  const typingStart = 80;
  const typingProgress = interpolate(frame, [typingStart, typingStart + 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const visibleChars = Math.floor(typingProgress * draftText.length);

  // Step progress animation
  const stepProgress = interpolate(frame, [40, 200], [0, 2.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.bg,
        fontFamily: theme.sans,
        fontSize: 14,
        display: "flex",
        flexDirection: "row",
        transform: `scale(${zoom})`,
        transformOrigin: "center center",
      }}
    >
      {/* ── LEFT SIDEBAR: Agent List ── */}
      <div
        style={{
          width: 220,
          background: theme.bg,
          borderRight: `1px solid ${theme.cardHi}`,
          display: "flex",
          flexDirection: "column",
          padding: "24px 0",
          flexShrink: 0,
          opacity: fade(frame, fps, 0),
        }}
      >
        {/* Brand */}
        <div style={{ padding: "0 20px 20px", display: "flex", alignItems: "center", gap: 10, ...(() => { const a = slideRight(frame, fps, 5); return { opacity: a.opacity, transform: `translateX(${a.x}px)` }; })() }}>
          <div style={{ width: 28, height: 28, background: theme.orange, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.serif, color: theme.white, fontSize: 14 }}>H</div>
          <div>
            <div style={{ fontFamily: theme.mono, fontSize: 11, color: theme.cream, letterSpacing: "0.15em", fontWeight: 600 }}>HEKLA</div>
            <div style={{ fontFamily: theme.mono, fontSize: 8, color: theme.dim, letterSpacing: "0.04em" }}>Agent Control</div>
          </div>
        </div>

        {/* Agent list */}
        <div style={{ padding: "0 12px" }}>
          <div style={{ fontFamily: theme.mono, fontSize: 9, color: theme.orange, letterSpacing: "0.12em", marginBottom: 10, padding: "0 8px", opacity: fade(frame, fps, 10) }}>ACTIVE AGENTS</div>
          {agents.map((agent, i) => {
            const a = slideRight(frame, fps, 15 + i * 4);
            const isSelected = i === 0;
            return (
              <div key={agent.id} style={{
                padding: "10px 10px",
                borderRadius: 6,
                background: isSelected ? theme.card : "transparent",
                border: isSelected ? `1px solid ${theme.cardHi}` : "1px solid transparent",
                marginBottom: 3,
                opacity: a.opacity,
                transform: `translateX(${a.x}px)`,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}>
                <span style={{ fontSize: 14 }}>{agent.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: isSelected ? theme.cream : theme.body }}>{agent.name}</div>
                </div>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: statusColors[agent.status],
                  opacity: agent.status === "running" ? pulse(frame, 0.06) : 1,
                }} />
              </div>
            );
          })}
        </div>

        {/* Agent stats */}
        <div style={{ marginTop: "auto", padding: "0 20px" }}>
          <div style={{ fontFamily: theme.mono, fontSize: 9, color: theme.orange, letterSpacing: "0.12em", marginBottom: 10, opacity: fade(frame, fps, 40) }}>TODAY'S METRICS</div>
          {[
            { label: "Tasks completed", value: "47" },
            { label: "Avg. response", value: "3.2s" },
            { label: "Tokens used", value: "124K" },
            { label: "Approvals pending", value: "3" },
          ].map((stat, i) => (
            <div key={stat.label} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", opacity: fade(frame, fps, 45 + i * 4) }}>
              <span style={{ fontFamily: theme.mono, fontSize: 9, color: theme.dim }}>{stat.label}</span>
              <span style={{ fontFamily: theme.mono, fontSize: 9, color: theme.cream }}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <div style={{ padding: "14px 28px", borderBottom: `1px solid ${theme.cardHi}`, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: fade(frame, fps, 8) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 16 }}>✉️</span>
            <div>
              <div style={{ fontSize: 14, color: theme.cream, fontWeight: 500 }}>Email Drafter</div>
              <div style={{ fontFamily: theme.mono, fontSize: 9, color: theme.green, display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: theme.green, display: "inline-block", opacity: pulse(frame) }} />
                Running
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["Pause", "Restart", "Settings"].map(btn => (
              <span key={btn} style={{ fontFamily: theme.mono, fontSize: 9, color: theme.dim, background: theme.card, border: `1px solid ${theme.cardHi}`, padding: "4px 10px", borderRadius: 4 }}>{btn}</span>
            ))}
          </div>
        </div>

        {/* Content split: Task detail + Right panel */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Task execution detail */}
          <div style={{ flex: 1, padding: "20px 28px", overflow: "hidden" }}>
            {/* Current task header */}
            <div style={{ opacity: fade(frame, fps, 15) }}>
              <div style={{ fontFamily: theme.mono, fontSize: 9, color: theme.dim, letterSpacing: "0.12em", marginBottom: 8 }}>CURRENT TASK</div>
              <div style={{ fontSize: 15, color: theme.cream, marginBottom: 4 }}>{currentTask.task}</div>
              <div style={{ fontFamily: theme.mono, fontSize: 10, color: theme.dim, marginBottom: 16, lineHeight: 1.5 }}>{currentTask.context}</div>
            </div>

            {/* Pipeline steps */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: theme.mono, fontSize: 9, color: theme.orange, letterSpacing: "0.12em", marginBottom: 10, opacity: fade(frame, fps, 25) }}>EXECUTION PIPELINE</div>
              {currentTask.steps.map((step, i) => {
                const a = slideUp(frame, fps, 30 + i * 6);
                const isActive = stepProgress >= i && stepProgress < i + 1;
                const isDone = stepProgress >= i + 1;
                const stepStatus = isDone ? "done" : isActive ? "active" : "pending";
                return (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "8px 12px", borderRadius: 6,
                    background: isActive ? "rgba(212,100,58,0.04)" : "transparent",
                    border: isActive ? `1px solid rgba(212,100,58,0.15)` : "1px solid transparent",
                    marginBottom: 4,
                    opacity: a.opacity, transform: `translateY(${a.y}px)`,
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%",
                      background: stepStatus === "done" ? `${theme.green}20` : stepStatus === "active" ? `${theme.orange}20` : theme.card,
                      border: `1.5px solid ${statusColors[stepStatus]}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 8, color: statusColors[stepStatus], flexShrink: 0,
                    }}>
                      {stepStatus === "done" ? "✓" : stepStatus === "active" ? "▶" : (i + 1)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 12, color: stepStatus === "pending" ? theme.dim : theme.cream }}>{step.label}</span>
                    </div>
                    {(isDone || isActive) && (
                      <span style={{ fontFamily: theme.mono, fontSize: 9, color: statusColors[stepStatus] }}>
                        {isDone ? step.time : isActive ? `${((stepProgress - i) * 4).toFixed(1)}s` : ""}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Draft preview */}
            <div style={{ opacity: fade(frame, fps, 65) }}>
              <div style={{ fontFamily: theme.mono, fontSize: 9, color: theme.orange, letterSpacing: "0.12em", marginBottom: 8 }}>DRAFT PREVIEW</div>
              <div style={{
                background: theme.card, border: `1px solid ${theme.cardHi}`, borderRadius: 8,
                padding: "14px 16px", minHeight: 100,
              }}>
                <div style={{ fontFamily: theme.mono, fontSize: 10, color: theme.body, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                  {draftText.substring(0, visibleChars)}
                  <span style={{ borderRight: `2px solid ${frame % 15 < 8 ? theme.orange : "transparent"}`, marginLeft: 1 }}>&nbsp;</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar: Approvals + Completions */}
          <div style={{ width: 260, borderLeft: `1px solid ${theme.cardHi}`, padding: "20px 16px", flexShrink: 0, overflow: "hidden" }}>
            {/* Approval queue */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: theme.mono, fontSize: 9, color: theme.dim, letterSpacing: "0.12em", marginBottom: 12, opacity: fade(frame, fps, 35) }}>
                APPROVAL QUEUE <span style={{ color: theme.orange }}>({approvalQueue.length})</span>
              </div>
              {approvalQueue.map((item, i) => {
                const a = slideRight(frame, fps, 45 + i * 6);
                return (
                  <div key={i} style={{
                    padding: "10px 10px", borderRadius: 6,
                    background: i === 0 ? "rgba(212,100,58,0.04)" : "transparent",
                    border: i === 0 ? `1px solid rgba(212,100,58,0.12)` : "1px solid transparent",
                    marginBottom: 4,
                    opacity: a.opacity, transform: `translateX(${a.x}px)`,
                  }}>
                    <div style={{ fontSize: 11, color: theme.cream, marginBottom: 3 }}>{item.title}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: theme.mono, fontSize: 8, color: theme.dim }}>{item.agent}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{
                          fontFamily: theme.mono, fontSize: 7,
                          color: statusColors[item.priority],
                          background: `${statusColors[item.priority]}15`,
                          padding: "1px 5px", borderRadius: 3,
                          textTransform: "uppercase",
                        }}>{item.priority}</span>
                        <span style={{ fontFamily: theme.mono, fontSize: 8, color: theme.dim }}>{item.time}</span>
                      </div>
                    </div>
                    {i === 0 && (
                      <div style={{ display: "flex", gap: 6, marginTop: 8, opacity: fade(frame, fps, 70) }}>
                        <span style={{ fontFamily: theme.mono, fontSize: 8, color: theme.green, background: `${theme.green}15`, padding: "3px 10px", borderRadius: 4, cursor: "pointer" }}>✓ Approve</span>
                        <span style={{ fontFamily: theme.mono, fontSize: 8, color: theme.dim, background: theme.cardHi, padding: "3px 10px", borderRadius: 4, cursor: "pointer" }}>Edit</span>
                        <span style={{ fontFamily: theme.mono, fontSize: 8, color: theme.dim, background: theme.cardHi, padding: "3px 10px", borderRadius: 4, cursor: "pointer" }}>Reject</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Recent completions */}
            <div>
              <div style={{ fontFamily: theme.mono, fontSize: 9, color: theme.dim, letterSpacing: "0.12em", marginBottom: 12, opacity: fade(frame, fps, 55) }}>RECENT COMPLETIONS</div>
              {recentCompletions.map((item, i) => {
                const a = slideUp(frame, fps, 65 + i * 5);
                return (
                  <div key={i} style={{
                    padding: "8px 0",
                    borderBottom: i < recentCompletions.length - 1 ? `1px solid ${theme.cardHi}` : "none",
                    opacity: a.opacity, transform: `translateY(${a.y}px)`,
                  }}>
                    <div style={{ fontSize: 11, color: theme.body, marginBottom: 2 }}>{item.task}</div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: theme.mono, fontSize: 8, color: theme.dim }}>{item.agent}</span>
                      <div style={{ display: "flex", gap: 8 }}>
                        <span style={{ fontFamily: theme.mono, fontSize: 8, color: theme.green }}>{item.duration}</span>
                        <span style={{ fontFamily: theme.mono, fontSize: 8, color: theme.dim }}>{item.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom status bar */}
        <div style={{
          padding: "8px 28px",
          borderTop: `1px solid ${theme.cardHi}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: theme.mono,
          fontSize: 9,
          color: theme.dim,
          opacity: fade(frame, fps, 80),
        }}>
          <div style={{ display: "flex", gap: 16 }}>
            <span>5 agents configured</span>
            <span>·</span>
            <span>2 running</span>
            <span>·</span>
            <span style={{ color: theme.green }}>
              <span style={{ display: "inline-block", width: 5, height: 5, background: theme.green, borderRadius: "50%", marginRight: 4, opacity: pulse(frame) }} />
              All systems nominal
            </span>
          </div>
          <span>47 tasks today · 3 pending approval</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
