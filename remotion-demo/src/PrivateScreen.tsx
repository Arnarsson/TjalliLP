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
const hardwareNodes = [
  { name: "Mac Mini M4 — Primary", status: "online", cpu: 12, mem: 34, disk: 67, temp: "42°C", uptime: "14d 7h" },
  { name: "Mac Mini M4 — Backup", status: "standby", cpu: 3, mem: 18, disk: 23, temp: "31°C", uptime: "14d 7h" },
];

const encryptionStatus = [
  { layer: "Storage (AES-256)", status: "active", icon: "🔐" },
  { layer: "Transit (TLS 1.3)", status: "active", icon: "🔒" },
  { layer: "Memory (Secure Enclave)", status: "active", icon: "🛡️" },
  { layer: "Backup (E2E Encrypted)", status: "active", icon: "💾" },
];

const auditLog = [
  { action: "Memory sync completed", source: "System", time: "2m ago", level: "info" },
  { action: "Agent task approved by user", source: "Email Drafter", time: "8m ago", level: "info" },
  { action: "Encryption key rotation", source: "Security", time: "1h ago", level: "security" },
  { action: "Backup verification passed", source: "System", time: "2h ago", level: "info" },
  { action: "New device auth blocked", source: "Firewall", time: "3h ago", level: "warning" },
  { action: "TLS certificate renewed", source: "Security", time: "6h ago", level: "security" },
  { action: "Storage optimization: 2.1GB freed", source: "System", time: "12h ago", level: "info" },
];

const networkPolicies = [
  { rule: "Outbound AI API calls", status: "blocked", detail: "No external LLM traffic" },
  { rule: "Local inference only", status: "enforced", detail: "On-device processing" },
  { rule: "Data residency: EU", status: "compliant", detail: "GDPR Article 44" },
  { rule: "Zero-knowledge sync", status: "active", detail: "End-to-end encrypted" },
];

const levelColors: Record<string, string> = {
  info: theme.dim,
  security: theme.green,
  warning: theme.orange,
};

export const PrivateScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.02], { extrapolateRight: "clamp" });

  // Animated CPU/mem gauges
  const gaugeProgress = (delay: number, target: number) => {
    const p = spring({ frame: frame - delay, fps, from: 0, to: 1, config: { damping: 18, stiffness: 40 } });
    return p * target;
  };

  // Scanline
  const scanY = interpolate(frame, [0, durationInFrames], [-20, 920], { extrapolateRight: "clamp" });

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
      {/* Scanline overlay */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: scanY, height: 1,
        background: `linear-gradient(90deg, transparent 0%, rgba(92,176,110,0.1) 30%, rgba(92,176,110,0.2) 50%, rgba(92,176,110,0.1) 70%, transparent 100%)`,
        pointerEvents: "none", zIndex: 10,
        opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }} />

      {/* ── LEFT SIDEBAR ── */}
      <div
        style={{
          width: 230,
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
          <div style={{ width: 28, height: 28, background: theme.green, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.serif, color: theme.white, fontSize: 14 }}>H</div>
          <div>
            <div style={{ fontFamily: theme.mono, fontSize: 11, color: theme.cream, letterSpacing: "0.15em", fontWeight: 600 }}>HEKLA</div>
            <div style={{ fontFamily: theme.mono, fontSize: 8, color: theme.green, letterSpacing: "0.04em" }}>Private Infrastructure</div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ padding: "0 12px" }}>
          {["Hardware", "Encryption", "Network", "Audit Log", "Compliance", "Backups"].map((item, i) => {
            const a = slideRight(frame, fps, 12 + i * 3);
            const active = i === 0;
            return (
              <div key={item} style={{
                padding: "8px 12px", borderRadius: 6, fontSize: 13,
                color: active ? theme.cream : theme.dim,
                background: active ? theme.card : "transparent",
                marginBottom: 2,
                opacity: a.opacity, transform: `translateX(${a.x}px)`,
              }}>{item}</div>
            );
          })}
        </div>

        {/* Sovereignty badge */}
        <div style={{ marginTop: "auto", padding: "0 16px", opacity: fade(frame, fps, 50) }}>
          <div style={{
            background: theme.card, border: `1px solid ${theme.cardHi}`, borderRadius: 8,
            padding: "14px 14px", textAlign: "center",
          }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>🇪🇺</div>
            <div style={{ fontFamily: theme.mono, fontSize: 9, color: theme.green, letterSpacing: "0.12em", marginBottom: 4 }}>EU DATA SOVEREIGN</div>
            <div style={{ fontFamily: theme.mono, fontSize: 8, color: theme.dim, lineHeight: 1.5 }}>All data processed and stored within EU jurisdiction. GDPR compliant.</div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <div style={{ padding: "14px 28px", borderBottom: `1px solid ${theme.cardHi}`, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: fade(frame, fps, 8) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.green} strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <div>
              <div style={{ fontSize: 14, color: theme.cream, fontWeight: 500 }}>Private Infrastructure</div>
              <div style={{ fontFamily: theme.mono, fontSize: 9, color: theme.green }}>All systems secured · Zero external dependencies</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ fontFamily: theme.mono, fontSize: 8, color: theme.green, background: `${theme.green}15`, padding: "4px 10px", borderRadius: 4 }}>🔒 ENCRYPTED</span>
            <span style={{ fontFamily: theme.mono, fontSize: 8, color: theme.green, background: `${theme.green}15`, padding: "4px 10px", borderRadius: 4 }}>🛡️ LOCAL ONLY</span>
          </div>
        </div>

        {/* Content grid */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Left column: Hardware + Network */}
          <div style={{ flex: 1, padding: "20px 28px", overflow: "hidden" }}>
            {/* Hardware nodes */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: theme.mono, fontSize: 9, color: theme.dim, letterSpacing: "0.12em", marginBottom: 12, opacity: fade(frame, fps, 15) }}>HARDWARE NODES</div>
              {hardwareNodes.map((node, i) => {
                const a = slideUp(frame, fps, 20 + i * 8);
                const isOnline = node.status === "online";
                return (
                  <div key={node.name} style={{
                    background: theme.card, border: `1px solid ${theme.cardHi}`, borderRadius: 8,
                    padding: "14px 16px", marginBottom: 8,
                    opacity: a.opacity, transform: `translateY(${a.y}px)`,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 14 }}>🖥️</span>
                        <span style={{ fontSize: 12, color: theme.cream }}>{node.name}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: isOnline ? theme.green : theme.dim, display: "inline-block", opacity: isOnline ? pulse(frame, 0.05) : 0.5 }} />
                        <span style={{ fontFamily: theme.mono, fontSize: 8, color: isOnline ? theme.green : theme.dim, textTransform: "uppercase" }}>{node.status}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 16 }}>
                      {[
                        { label: "CPU", value: node.cpu, color: theme.green },
                        { label: "MEM", value: node.mem, color: theme.blue },
                        { label: "DISK", value: node.disk, color: theme.orange },
                      ].map(metric => (
                        <div key={metric.label} style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                            <span style={{ fontFamily: theme.mono, fontSize: 8, color: theme.dim }}>{metric.label}</span>
                            <span style={{ fontFamily: theme.mono, fontSize: 8, color: metric.color }}>{Math.round(gaugeProgress(25 + i * 8, metric.value))}%</span>
                          </div>
                          <div style={{ height: 3, background: theme.cardHi, borderRadius: 2, overflow: "hidden" }}>
                            <div style={{ height: "100%", borderRadius: 2, background: metric.color, width: `${gaugeProgress(25 + i * 8, metric.value)}%`, transition: "width 0.1s" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                      <span style={{ fontFamily: theme.mono, fontSize: 8, color: theme.dim }}>Temp: {node.temp}</span>
                      <span style={{ fontFamily: theme.mono, fontSize: 8, color: theme.dim }}>Uptime: {node.uptime}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Network policies */}
            <div>
              <div style={{ fontFamily: theme.mono, fontSize: 9, color: theme.dim, letterSpacing: "0.12em", marginBottom: 10, opacity: fade(frame, fps, 40) }}>NETWORK POLICIES</div>
              {networkPolicies.map((policy, i) => {
                const a = slideUp(frame, fps, 48 + i * 5);
                const statusColor = policy.status === "blocked" ? theme.orange : theme.green;
                return (
                  <div key={policy.rule} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "8px 12px", borderRadius: 6,
                    marginBottom: 4,
                    opacity: a.opacity, transform: `translateY(${a.y}px)`,
                  }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: statusColor,
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: theme.cream }}>{policy.rule}</div>
                      <div style={{ fontFamily: theme.mono, fontSize: 8, color: theme.dim }}>{policy.detail}</div>
                    </div>
                    <span style={{
                      fontFamily: theme.mono, fontSize: 7,
                      color: statusColor,
                      background: `${statusColor}15`,
                      padding: "2px 7px", borderRadius: 3,
                      textTransform: "uppercase",
                    }}>{policy.status}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right column: Encryption + Audit */}
          <div style={{ width: 280, borderLeft: `1px solid ${theme.cardHi}`, padding: "20px 16px", flexShrink: 0, overflow: "hidden" }}>
            {/* Encryption status */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: theme.mono, fontSize: 9, color: theme.dim, letterSpacing: "0.12em", marginBottom: 12, opacity: fade(frame, fps, 25) }}>ENCRYPTION LAYERS</div>
              {encryptionStatus.map((layer, i) => {
                const a = slideRight(frame, fps, 30 + i * 5);
                return (
                  <div key={layer.layer} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "8px 10px", borderRadius: 6,
                    background: theme.card, marginBottom: 4,
                    opacity: a.opacity, transform: `translateX(${a.x}px)`,
                  }}>
                    <span style={{ fontSize: 12 }}>{layer.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: theme.cream }}>{layer.layer}</div>
                    </div>
                    <span style={{ fontFamily: theme.mono, fontSize: 8, color: theme.green, textTransform: "uppercase" }}>{layer.status}</span>
                  </div>
                );
              })}
            </div>

            {/* Audit log */}
            <div>
              <div style={{ fontFamily: theme.mono, fontSize: 9, color: theme.dim, letterSpacing: "0.12em", marginBottom: 12, opacity: fade(frame, fps, 45) }}>AUDIT LOG</div>
              {auditLog.map((entry, i) => {
                const a = slideUp(frame, fps, 55 + i * 4);
                return (
                  <div key={i} style={{
                    padding: "7px 0",
                    borderBottom: i < auditLog.length - 1 ? `1px solid ${theme.cardHi}` : "none",
                    opacity: a.opacity, transform: `translateY(${a.y}px)`,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: levelColors[entry.level], flexShrink: 0 }} />
                      <div style={{ fontSize: 10, color: theme.body, flex: 1 }}>{entry.action}</div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: 10 }}>
                      <span style={{ fontFamily: theme.mono, fontSize: 8, color: theme.dim }}>{entry.source}</span>
                      <span style={{ fontFamily: theme.mono, fontSize: 8, color: theme.dim }}>{entry.time}</span>
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
            <span>2 nodes active</span>
            <span>·</span>
            <span>4 encryption layers</span>
            <span>·</span>
            <span style={{ color: theme.green }}>
              <span style={{ display: "inline-block", width: 5, height: 5, background: theme.green, borderRadius: "50%", marginRight: 4, opacity: pulse(frame) }} />
              Fully secured
            </span>
          </div>
          <span>Last audit: 2m ago · Uptime: 14d 7h</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
