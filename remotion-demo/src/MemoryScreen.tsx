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
const memoryEntries = [
  { type: "conversation", title: "Strategy call with Nordic Ventures", source: "Zoom transcript", date: "2h ago", tags: ["investor", "Q2 pipeline"], highlight: true },
  { type: "decision", title: "Approved Meridian CRM migration timeline", source: "Slack thread", date: "5h ago", tags: ["CRM", "migration"] },
  { type: "contact", title: "Freya Lindqvist — new LP introduction", source: "Email + LinkedIn", date: "Yesterday", tags: ["contact", "LP"] },
  { type: "document", title: "Board deck v3 — competitive section updated", source: "Google Docs", date: "Yesterday", tags: ["board", "competitive"] },
  { type: "conversation", title: "Weekly sync with Apex Partners", source: "Calendar notes", date: "2 days ago", tags: ["investor", "weekly"] },
  { type: "insight", title: "Pattern: 3 LPs mentioned Series A timeline", source: "Cross-reference", date: "2 days ago", tags: ["insight", "fundraising"] },
];

const importSources = [
  { name: "ChatGPT", count: "4,218", pct: 85, color: theme.green },
  { name: "Claude", count: "1,847", pct: 62, color: theme.blue },
  { name: "Email", count: "12,403", pct: 95, color: theme.orange },
  { name: "Files", count: "892", pct: 38, color: theme.purple },
];

const people = [
  { initials: "FL", name: "Freya Lindqvist", role: "LP, Nordic Ventures", interactions: 34, color: theme.green },
  { initials: "MK", name: "Marcus Keller", role: "CTO, Apex Partners", interactions: 22, color: theme.blue },
  { initials: "SN", name: "Sofia Nordström", role: "Board advisor", interactions: 18, color: theme.purple },
  { initials: "AH", name: "Anders Holm", role: "Legal counsel", interactions: 12, color: theme.orange },
];

const typeIcons: Record<string, string> = {
  conversation: "💬",
  decision: "⚡",
  contact: "👤",
  document: "📄",
  insight: "💡",
};

export const MemoryScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.02], { extrapolateRight: "clamp" });

  // Typing animation for search bar
  const searchText = "strategy call nordic ventures...";
  const typingProgress = interpolate(frame, [30, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const visibleChars = Math.floor(typingProgress * searchText.length);

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
      {/* ── LEFT SIDEBAR ── */}
      <div
        style={{
          width: 240,
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
        <div style={{ padding: "0 24px 20px", display: "flex", alignItems: "center", gap: 10, ...(() => { const a = slideRight(frame, fps, 5); return { opacity: a.opacity, transform: `translateX(${a.x}px)` }; })() }}>
          <div style={{ width: 28, height: 28, background: theme.orange, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.serif, color: theme.white, fontSize: 14 }}>H</div>
          <div>
            <div style={{ fontFamily: theme.mono, fontSize: 11, color: theme.cream, letterSpacing: "0.15em", fontWeight: 600 }}>HEKLA</div>
            <div style={{ fontFamily: theme.mono, fontSize: 8, color: theme.dim, letterSpacing: "0.04em" }}>Memory Browser</div>
          </div>
        </div>

        {/* Categories */}
        <div style={{ padding: "0 12px" }}>
          {["All Memories", "Conversations", "People", "Decisions", "Documents", "Insights"].map((cat, i) => {
            const a = slideRight(frame, fps, 12 + i * 3);
            const active = i === 0;
            return (
              <div key={cat} style={{ padding: "8px 12px", borderRadius: 6, fontSize: 13, color: active ? theme.cream : theme.dim, background: active ? theme.card : "transparent", marginBottom: 2, opacity: a.opacity, transform: `translateX(${a.x}px)`, display: "flex", justifyContent: "space-between" }}>
                {cat}
                {active && <span style={{ fontFamily: theme.mono, fontSize: 10, color: theme.orange }}>19.4k</span>}
              </div>
            );
          })}
        </div>

        {/* Import Sources */}
        <div style={{ marginTop: "auto", padding: "0 16px" }}>
          <div style={{ fontFamily: theme.mono, fontSize: 9, color: theme.orange, letterSpacing: "0.12em", marginBottom: 10, opacity: fade(frame, fps, 45) }}>IMPORT SOURCES</div>
          {importSources.map((src, i) => {
            const barProgress = spring({ frame: frame - (55 + i * 6), fps, from: 0, to: 1, config: { damping: 18, stiffness: 40 } });
            return (
              <div key={src.name} style={{ marginBottom: 10, opacity: fade(frame, fps, 50 + i * 5) }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontFamily: theme.mono, fontSize: 9, color: theme.dim }}>{src.name}</span>
                  <span style={{ fontFamily: theme.mono, fontSize: 9, color: theme.cream }}>{src.count}</span>
                </div>
                <div style={{ height: 3, background: theme.cardHi, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 2, background: src.color, width: `${barProgress * src.pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
        {/* Search Bar */}
        <div style={{ padding: "16px 32px", borderBottom: `1px solid ${theme.cardHi}`, opacity: fade(frame, fps, 8) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: theme.card, border: `1px solid ${theme.cardHi}`, borderRadius: 8, padding: "10px 16px" }}>
            <span style={{ fontSize: 14, opacity: 0.5 }}>🔍</span>
            <div style={{ fontFamily: theme.mono, fontSize: 13, color: theme.dim, flex: 1 }}>
              {searchText.substring(0, visibleChars)}
              <span style={{ borderRight: `2px solid ${frame % 15 < 8 ? theme.orange : "transparent"}`, marginLeft: 1 }}>&nbsp;</span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["⌘K", "Filters"].map(k => (
                <span key={k} style={{ fontFamily: theme.mono, fontSize: 9, color: theme.dim, background: theme.cardHi, padding: "3px 8px", borderRadius: 4 }}>{k}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Content area: entries + people sidebar */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Entry list */}
          <div style={{ flex: 1, padding: "20px 32px", overflow: "hidden" }}>
            <div style={{ fontFamily: theme.mono, fontSize: 9, color: theme.dim, letterSpacing: "0.12em", marginBottom: 16, opacity: fade(frame, fps, 25) }}>
              RECENT MEMORIES <span style={{ color: theme.orange }}>({memoryEntries.length} results)</span>
            </div>
            {memoryEntries.map((entry, i) => {
              const a = slideUp(frame, fps, 35 + i * 7);
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: "12px 14px",
                    borderRadius: 8,
                    background: entry.highlight ? "rgba(212,100,58,0.04)" : "transparent",
                    border: entry.highlight ? `1px solid rgba(212,100,58,0.15)` : "1px solid transparent",
                    marginBottom: 6,
                    opacity: a.opacity,
                    transform: `translateY(${a.y}px)`,
                  }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: theme.card, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                    {typeIcons[entry.type] || "📝"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: theme.cream, marginBottom: 3 }}>{entry.title}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: theme.mono, fontSize: 9, color: theme.dim }}>{entry.source}</span>
                      <span style={{ fontFamily: theme.mono, fontSize: 9, color: theme.dim }}>·</span>
                      <span style={{ fontFamily: theme.mono, fontSize: 9, color: theme.dim }}>{entry.date}</span>
                    </div>
                    <div style={{ display: "flex", gap: 5, marginTop: 6 }}>
                      {entry.tags.map(tag => (
                        <span key={tag} style={{ fontFamily: theme.mono, fontSize: 8, color: theme.orange, background: "rgba(212,100,58,0.08)", padding: "2px 7px", borderRadius: 3 }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* People sidebar */}
          <div style={{ width: 240, borderLeft: `1px solid ${theme.cardHi}`, padding: "20px 16px", flexShrink: 0 }}>
            <div style={{ fontFamily: theme.mono, fontSize: 9, color: theme.dim, letterSpacing: "0.12em", marginBottom: 14, opacity: fade(frame, fps, 40) }}>PEOPLE IN CONTEXT</div>
            {people.map((person, i) => {
              const a = slideRight(frame, fps, 50 + i * 6);
              return (
                <div key={person.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < people.length - 1 ? `1px solid ${theme.cardHi}` : "none", opacity: a.opacity, transform: `translateX(${a.x}px)` }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: `${person.color}20`, color: person.color, fontFamily: theme.mono, fontSize: 9, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {person.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: theme.cream }}>{person.name}</div>
                    <div style={{ fontFamily: theme.mono, fontSize: 8, color: theme.dim }}>{person.role}</div>
                  </div>
                  <div style={{ fontFamily: theme.mono, fontSize: 9, color: theme.orange }}>{person.interactions}</div>
                </div>
              );
            })}

            {/* Knowledge graph mini */}
            <div style={{ marginTop: 20, opacity: fade(frame, fps, 70) }}>
              <div style={{ fontFamily: theme.mono, fontSize: 9, color: theme.dim, letterSpacing: "0.12em", marginBottom: 10 }}>KNOWLEDGE GRAPH</div>
              <div style={{ background: theme.card, borderRadius: 8, height: 120, position: "relative", overflow: "hidden", border: `1px solid ${theme.cardHi}` }}>
                {/* Animated connection nodes */}
                {[
                  { cx: 60, cy: 40, r: 12, color: theme.orange, label: "You" },
                  { cx: 150, cy: 30, r: 8, color: theme.green, label: "FL" },
                  { cx: 170, cy: 80, r: 7, color: theme.blue, label: "MK" },
                  { cx: 40, cy: 90, r: 6, color: theme.purple, label: "SN" },
                  { cx: 120, cy: 95, r: 5, color: theme.orange, label: "AH" },
                ].map((node, i) => {
                  const nodeOpacity = fade(frame, fps, 75 + i * 4);
                  return (
                    <React.Fragment key={i}>
                      {i > 0 && (
                        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                          <line x1={60} y1={40} x2={node.cx} y2={node.cy} stroke={node.color} strokeWidth={1} opacity={nodeOpacity * 0.3} />
                        </svg>
                      )}
                      <div style={{
                        position: "absolute",
                        left: node.cx - node.r,
                        top: node.cy - node.r,
                        width: node.r * 2,
                        height: node.r * 2,
                        borderRadius: "50%",
                        background: `${node.color}30`,
                        border: `1.5px solid ${node.color}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: theme.mono,
                        fontSize: node.r > 8 ? 8 : 6,
                        color: node.color,
                        fontWeight: 600,
                        opacity: nodeOpacity,
                      }}>
                        {node.label}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom status bar */}
        <div style={{
          padding: "8px 32px",
          borderTop: `1px solid ${theme.cardHi}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: theme.mono,
          fontSize: 9,
          color: theme.dim,
          opacity: fade(frame, fps, 85),
        }}>
          <div style={{ display: "flex", gap: 16 }}>
            <span>19,360 memories</span>
            <span>·</span>
            <span>4 sources connected</span>
            <span>·</span>
            <span style={{ color: theme.green }}>
              <span style={{ display: "inline-block", width: 5, height: 5, background: theme.green, borderRadius: "50%", marginRight: 4, opacity: pulse(frame) }} />
              Syncing
            </span>
          </div>
          <span>Last import: 12 min ago</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
