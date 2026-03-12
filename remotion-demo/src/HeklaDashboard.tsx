import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";
import { loadFont as loadInstrumentSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadDMSans } from "@remotion/google-fonts/DMSans";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import { theme } from "./theme";
import {
  fadeIn,
  slideUp,
  slideRight,
  scaleIn,
  countUp,
  barGrow,
  progressFill,
  pulseOpacity,
} from "./helpers";

const { fontFamily: instrumentSerif } = loadInstrumentSerif();
const { fontFamily: dmSans } = loadDMSans();
const { fontFamily: jetBrainsMono } = loadJetBrainsMono();

/* ─────────────────────────────────────────────
   SIDEBAR
   ───────────────────────────────────────────── */
const navItems = [
  { label: "Today", active: true },
  { label: "Inbox", badge: 23 },
  { label: "Calendar" },
  { label: "CRM" },
  { label: "Issues", badge: 12 },
  { label: "Insights" },
  { label: "Transcribe" },
  { label: "Agents" },
  { label: "Memory" },
];

const Sidebar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sidebarOpacity = fadeIn(frame, fps, 0);
  const brandAnim = slideRight(frame, fps, 5);
  const logoScale = scaleIn(frame, fps, 8);

  return (
    <div
      style={{
        width: 220,
        background: theme.bg,
        borderRight: `1px solid ${theme.cardHi}`,
        display: "flex",
        flexDirection: "column",
        padding: "1.5rem 0",
        flexShrink: 0,
        opacity: sidebarOpacity,
      }}
    >
      {/* Brand */}
      <div
        style={{
          padding: "0 1.5rem 1.5rem",
          display: "flex",
          alignItems: "center",
          gap: ".6rem",
          opacity: brandAnim.opacity,
          transform: `translateX(${brandAnim.x}px)`,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            background: theme.orange,
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: theme.serif,
            color: theme.white,
            fontSize: 14,
            opacity: logoScale.opacity,
            transform: `scale(${logoScale.scale})`,
          }}
        >
          H
        </div>
        <div>
          <div
            style={{
              fontFamily: theme.mono,
              fontSize: ".75rem",
              color: theme.cream,
              letterSpacing: ".15em",
              fontWeight: 600,
            }}
          >
            HEKLA
          </div>
          <div
            style={{
              fontFamily: theme.mono,
              fontSize: ".55rem",
              color: theme.dim,
              letterSpacing: ".04em",
            }}
          >
            Private Assistant
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: ".5rem 0" }}>
        {navItems.map((item, i) => {
          const anim = slideRight(frame, fps, 12 + i * 3);
          return (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: ".75rem",
                padding: ".65rem 1.5rem",
                color: item.active ? theme.cream : theme.dim,
                fontSize: ".82rem",
                position: "relative",
                background: item.active ? theme.card : "transparent",
                opacity: anim.opacity,
                transform: `translateX(${anim.x}px)`,
              }}
            >
              {item.active && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 3,
                    background: theme.orange,
                    borderRadius: "0 2px 2px 0",
                    transform: `scaleY(${fadeIn(frame, fps, 15)})`,
                    transformOrigin: "top",
                  }}
                />
              )}
              <div
                style={{
                  width: 18,
                  height: 18,
                  opacity: item.active ? 1 : 0.6,
                  color: item.active ? theme.orange : "inherit",
                  fontSize: ".7rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.active ? "⌂" : "·"}
              </div>
              {item.label}
              {item.badge && (
                <span
                  style={{
                    marginLeft: "auto",
                    background: theme.orange,
                    color: theme.white,
                    fontFamily: theme.mono,
                    fontSize: ".55rem",
                    padding: ".15rem .45rem",
                    borderRadius: 10,
                    fontWeight: 600,
                    ...(() => {
                      const s = scaleIn(frame, fps, 40 + i * 2);
                      return {
                        opacity: s.opacity,
                        transform: `scale(${s.scale})`,
                      };
                    })(),
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Quick Actions */}
      <div
        style={{
          margin: ".75rem 1rem",
          background: "rgba(212,100,58,.08)",
          border: "1px solid rgba(212,100,58,.2)",
          borderRadius: 8,
          padding: ".75rem 1rem",
          ...(() => {
            const a = slideUp(frame, fps, 50);
            return {
              opacity: a.opacity,
              transform: `translateY(${a.y}px)`,
            };
          })(),
        }}
      >
        <div
          style={{
            fontFamily: theme.mono,
            fontSize: ".55rem",
            color: theme.orange,
            letterSpacing: ".1em",
            textTransform: "uppercase" as const,
            marginBottom: ".4rem",
          }}
        >
          QUICK ACTIONS
        </div>
        {["Draft investor update", "Prep board meeting"].map((action, i) => (
          <div
            key={action}
            style={{
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
              padding: ".25rem 0",
              fontSize: ".72rem",
              color: theme.cream,
              opacity: fadeIn(frame, fps, 55 + i * 4),
            }}
          >
            <div
              style={{
                width: 5,
                height: 5,
                background: theme.orange,
                borderRadius: "50%",
              }}
            />
            {action}
          </div>
        ))}
      </div>

      {/* Recent */}
      <div
        style={{
          padding: ".75rem 1.5rem .5rem",
          fontFamily: theme.mono,
          fontSize: ".55rem",
          color: theme.dim,
          letterSpacing: ".1em",
          opacity: fadeIn(frame, fps, 58),
        }}
      >
        RECENT
      </div>
      {["Meridian CRM", "Q1 Pipeline"].map((item, i) => (
        <div
          key={item}
          style={{
            display: "flex",
            alignItems: "center",
            gap: ".6rem",
            padding: ".45rem 1.5rem",
            color: theme.dim,
            fontSize: ".78rem",
            opacity: fadeIn(frame, fps, 62 + i * 3),
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              background: theme.cardHi,
              borderRadius: 3,
            }}
          />
          {item}
        </div>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN CONTENT
   ───────────────────────────────────────────── */

const TopBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = fadeIn(frame, fps, 8);

  return (
    <div
      style={{
        background: theme.card,
        borderBottom: `1px solid ${theme.cardHi}`,
        padding: ".6rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: theme.mono,
        fontSize: ".7rem",
        opacity,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
        <div
          style={{
            width: 8,
            height: 8,
            background: theme.orange,
            borderRadius: "50%",
            opacity: pulseOpacity(frame, 0.03),
          }}
        />
        <span style={{ color: theme.orange, fontWeight: 600 }}>P0</span>
        <span style={{ color: theme.cream }}>
          [Action] Review partnership agreement with Boreal Labs
        </span>
      </div>
      <div style={{ display: "flex", gap: "1.5rem", color: theme.dim }}>
        <span>4h</span>
        <span style={{ color: theme.green }}>Done</span>
      </div>
    </div>
  );
};

const Header: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dateAnim = fadeIn(frame, fps, 14);
  const greeting = slideUp(frame, fps, 18);
  const sub = slideUp(frame, fps, 24);
  const timeAnim = fadeIn(frame, fps, 14);

  return (
    <div style={{ padding: "2rem 2.5rem 1.5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: theme.mono,
              fontSize: ".65rem",
              color: theme.dim,
              letterSpacing: ".12em",
              marginBottom: ".5rem",
              opacity: dateAnim,
            }}
          >
            11 MAR 2026 / TUESDAY
          </div>
          <div
            style={{
              fontFamily: theme.serif,
              fontSize: "2.2rem",
              color: theme.cream,
              fontWeight: 400,
              lineHeight: 1.1,
              opacity: greeting.opacity,
              transform: `translateY(${greeting.y}px)`,
            }}
          >
            Good evening, <em style={{ color: theme.orange }}>Elena</em>
          </div>
          <div
            style={{
              fontSize: ".85rem",
              color: theme.dim,
              marginTop: ".4rem",
              opacity: sub.opacity,
              transform: `translateY(${sub.y}px)`,
            }}
          >
            3 agents running · 2 meetings today · inbox clear
          </div>
        </div>
        <div style={{ textAlign: "right" as const }}>
          <div
            style={{
              fontFamily: theme.mono,
              fontSize: "2.8rem",
              color: theme.cream,
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: "-.02em",
              opacity: timeAnim,
            }}
          >
            21:42
          </div>
          <div
            style={{
              fontFamily: theme.mono,
              fontSize: ".6rem",
              color: theme.dim,
              letterSpacing: ".15em",
              marginTop: ".4rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: ".4rem",
              opacity: fadeIn(frame, fps, 20),
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                background: theme.green,
                borderRadius: "50%",
                opacity: pulseOpacity(frame, 0.04),
              }}
            />
            ALL SYSTEMS ACTIVE
          </div>
        </div>
      </div>
    </div>
  );
};

const statsData = [
  { label: "TASKS", value: 34, change: "+3 today", up: true },
  { label: "PROCESSED", value: 847, change: "92% auto", up: true },
  { label: "MEETINGS", value: 2, change: "next: 10:00", up: false },
  { label: "CONTACTS", value: 216, change: "+8 this week", up: true },
  { label: "MEMORY", value: 1200, display: "1.2k", change: "entries", up: false },
];

const StatsBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: "flex", padding: "0 2.5rem", marginBottom: "1.5rem" }}>
      {statsData.map((stat, i) => {
        const labelOpacity = fadeIn(frame, fps, 30 + i * 2);
        const numAnim = slideUp(frame, fps, 34 + i * 3);
        const changeOpacity = fadeIn(frame, fps, 55 + i * 2);
        const value = stat.display || countUp(frame, fps, 34 + i * 3, stat.value, 25);

        return (
          <div
            key={stat.label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              padding: ".8rem 1.5rem .8rem 0",
              borderRight:
                i < statsData.length - 1
                  ? `1px solid ${theme.cardHi}`
                  : "none",
              minWidth: 120,
            }}
          >
            <div
              style={{
                fontFamily: theme.mono,
                fontSize: ".55rem",
                color: theme.dim,
                letterSpacing: ".12em",
                marginBottom: ".25rem",
                opacity: labelOpacity,
              }}
            >
              {stat.label}
            </div>
            <div
              style={{
                fontFamily: theme.mono,
                fontSize: "1.8rem",
                color: theme.cream,
                fontWeight: 600,
                lineHeight: 1,
                opacity: numAnim.opacity,
                transform: `translateY(${numAnim.y}px)`,
              }}
            >
              {stat.display || value}
            </div>
            <div
              style={{
                fontFamily: theme.mono,
                fontSize: ".6rem",
                color: stat.up ? theme.green : theme.dim,
                marginTop: ".2rem",
                opacity: changeOpacity,
              }}
            >
              {stat.change}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* Agent Panel */
const agents = [
  {
    id: "IN",
    name: "Inbox Agent",
    desc: "Triaging 23 emails · 4 flagged for review",
    status: "running" as const,
    color: theme.orange,
    bg: "rgba(212,100,58,.15)",
    time: "2m ago",
    count: "847 processed",
  },
  {
    id: "RE",
    name: "Research Agent",
    desc: "Compiling brief on Nordic Ventures fund",
    status: "running" as const,
    color: theme.green,
    bg: "rgba(92,176,110,.15)",
    time: "8m ago",
    count: "12 sources",
  },
  {
    id: "CA",
    name: "Calendar Agent",
    desc: "Optimized 2 conflicts · 3 prep notes ready",
    status: "running" as const,
    color: theme.blue,
    bg: "rgba(108,135,217,.15)",
    time: "15m ago",
    count: "6 synced",
  },
  {
    id: "CR",
    name: "CRM Agent",
    desc: "Last run: Updated 14 contact records",
    status: "idle" as const,
    color: theme.purple,
    bg: "rgba(182,130,214,.15)",
    time: "1h ago",
    count: "idle",
  },
];

const AgentPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const panelAnim = slideUp(frame, fps, 48);

  return (
    <div
      style={{
        background: theme.card,
        border: `1px solid ${theme.cardHi}`,
        borderRadius: 10,
        padding: "1.25rem 1.5rem",
        opacity: panelAnim.opacity,
        transform: `translateY(${panelAnim.y}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            fontFamily: theme.mono,
            fontSize: ".65rem",
            color: theme.dim,
            letterSpacing: ".12em",
          }}
        >
          AGENT ACTIVITY{" "}
          <span style={{ color: theme.orange }}>(3 running)</span>
        </div>
        <div
          style={{
            fontFamily: theme.mono,
            fontSize: ".6rem",
            color: theme.orange,
          }}
        >
          Manage →
        </div>
      </div>
      {agents.map((agent, i) => {
        const anim = slideRight(frame, fps, 54 + i * 6);
        return (
          <div
            key={agent.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: ".75rem",
              padding: ".65rem 0",
              borderBottom:
                i < agents.length - 1
                  ? `1px solid ${theme.cardHi}`
                  : "none",
              opacity: anim.opacity,
              transform: `translateX(${anim.x}px)`,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: theme.mono,
                fontSize: ".6rem",
                fontWeight: 600,
                background: agent.bg,
                color: agent.color,
              }}
            >
              {agent.id}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: ".82rem",
                  color: theme.cream,
                  display: "flex",
                  alignItems: "center",
                  gap: ".4rem",
                }}
              >
                {agent.name}
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background:
                      agent.status === "running" ? theme.green : theme.dim,
                    opacity:
                      agent.status === "running"
                        ? pulseOpacity(frame, 0.04)
                        : 1,
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: ".7rem",
                  color: theme.dim,
                  whiteSpace: "nowrap" as const,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {agent.desc}
              </div>
            </div>
            <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
              <div
                style={{
                  fontFamily: theme.mono,
                  fontSize: ".6rem",
                  color: theme.dim,
                }}
              >
                {agent.time}
              </div>
              <div
                style={{
                  fontFamily: theme.mono,
                  fontSize: ".55rem",
                  color: theme.orange,
                  marginTop: ".1rem",
                }}
              >
                {agent.count}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* Timeline Panel */
const timelineItems = [
  {
    title: "Investor deck v3 finalized",
    sub: "Research Agent compiled competitive analysis",
    time: "12 min ago",
    active: true,
  },
  {
    title: "Meeting with Apex Partners rescheduled",
    sub: "Calendar Agent moved to Thursday 14:00",
    time: "45 min ago",
    active: false,
  },
  {
    title: "3 follow-ups sent automatically",
    sub: "Inbox Agent drafted and sent on approval",
    time: "2h ago",
    active: false,
  },
  {
    title: "New contact: Freya Lindqvist added",
    sub: "CRM Agent enriched from LinkedIn + email",
    time: "3h ago",
    active: false,
  },
  {
    title: "Daily brief generated",
    sub: "4 priorities, 2 decisions pending",
    time: "8:00 AM",
    active: false,
  },
];

const TimelinePanel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const panelAnim = slideUp(frame, fps, 52);

  return (
    <div
      style={{
        background: theme.card,
        border: `1px solid ${theme.cardHi}`,
        borderRadius: 10,
        padding: "1.25rem 1.5rem",
        opacity: panelAnim.opacity,
        transform: `translateY(${panelAnim.y}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            fontFamily: theme.mono,
            fontSize: ".65rem",
            color: theme.dim,
            letterSpacing: ".12em",
          }}
        >
          TIMELINE
        </div>
        <div
          style={{
            fontFamily: theme.mono,
            fontSize: ".6rem",
            color: theme.orange,
          }}
        >
          All →
        </div>
      </div>
      {timelineItems.map((item, i) => {
        const anim = slideUp(frame, fps, 60 + i * 5);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              gap: ".75rem",
              padding: ".5rem 0",
              opacity: anim.opacity,
              transform: `translateY(${anim.y}px)`,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 20,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: item.active ? theme.orange : theme.cardHi,
                  border: item.active
                    ? `2px solid ${theme.orange}`
                    : `2px solid ${theme.dim}`,
                  opacity: item.active ? pulseOpacity(frame, 0.03) : 1,
                  zIndex: 1,
                }}
              />
              {i < timelineItems.length - 1 && (
                <div
                  style={{
                    width: 1,
                    flex: 1,
                    background: theme.cardHi,
                    marginTop: 4,
                  }}
                />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: ".8rem", color: theme.cream }}>
                {item.title}
              </div>
              <div
                style={{
                  fontSize: ".65rem",
                  color: theme.dim,
                  marginTop: ".1rem",
                }}
              >
                {item.sub}
              </div>
              <div
                style={{
                  fontFamily: theme.mono,
                  fontSize: ".55rem",
                  color: theme.dim,
                  marginTop: ".15rem",
                }}
              >
                {item.time}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* Bottom cards */
const IssuesCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = slideUp(frame, fps, 65);
  const issues = [
    { num: 5, label: "OPEN", active: false },
    { num: 4, label: "IN PROGRESS", active: true },
    { num: 1, label: "BLOCKED", active: false },
    { num: 2, label: "DONE TODAY", active: false },
  ];

  return (
    <div
      style={{
        background: theme.card,
        border: `1px solid ${theme.cardHi}`,
        borderRadius: 10,
        padding: "1.25rem 1.5rem",
        opacity: anim.opacity,
        transform: `translateY(${anim.y}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            fontFamily: theme.mono,
            fontSize: ".65rem",
            color: theme.dim,
            letterSpacing: ".12em",
          }}
        >
          ISSUES <span style={{ color: theme.orange }}>(12)</span>
        </div>
        <div
          style={{
            fontFamily: theme.mono,
            fontSize: ".6rem",
            color: theme.orange,
          }}
        >
          Board →
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: ".5rem",
        }}
      >
        {issues.map((issue, i) => {
          const s = scaleIn(frame, fps, 72 + i * 3);
          return (
            <div
              key={issue.label}
              style={{
                padding: ".6rem .75rem",
                borderRadius: 6,
                background: issue.active
                  ? "rgba(212,100,58,.06)"
                  : "rgba(255,255,255,.02)",
                border: `1px solid ${issue.active ? theme.orange : theme.cardHi}`,
                opacity: s.opacity,
                transform: `scale(${s.scale})`,
              }}
            >
              <div
                style={{
                  fontFamily: theme.mono,
                  fontSize: "1.2rem",
                  color: issue.active ? theme.orange : theme.cream,
                  fontWeight: 600,
                  lineHeight: 1,
                }}
              >
                {countUp(frame, fps, 72 + i * 3, issue.num, 15)}
              </div>
              <div
                style={{
                  fontFamily: theme.mono,
                  fontSize: ".5rem",
                  color: issue.active ? theme.orange : theme.dim,
                  letterSpacing: ".1em",
                  marginTop: ".2rem",
                }}
              >
                {issue.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MemoryCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = slideUp(frame, fps, 70);
  const bars = [
    { label: "Contacts & CRM", num: 216, pct: 72, color: theme.orange },
    { label: "Decisions & Notes", num: 584, pct: 48, color: theme.green },
    { label: "Research & Briefs", num: 412, pct: 34, color: theme.blue },
  ];

  return (
    <div
      style={{
        background: theme.card,
        border: `1px solid ${theme.cardHi}`,
        borderRadius: 10,
        padding: "1.25rem 1.5rem",
        opacity: anim.opacity,
        transform: `translateY(${anim.y}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: ".75rem",
        }}
      >
        <div
          style={{
            fontFamily: theme.mono,
            fontSize: ".65rem",
            color: theme.dim,
            letterSpacing: ".12em",
          }}
        >
          MEMORY
        </div>
        <div
          style={{
            fontFamily: theme.mono,
            fontSize: ".6rem",
            color: theme.orange,
          }}
        >
          Browse →
        </div>
      </div>
      {bars.map((bar, i) => {
        const fillWidth = progressFill(frame, fps, 80 + i * 6, bar.pct);
        return (
          <div key={bar.label} style={{ marginBottom: ".6rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: ".3rem",
              }}
            >
              <span
                style={{
                  fontFamily: theme.mono,
                  fontSize: ".55rem",
                  color: theme.dim,
                }}
              >
                {bar.label}
              </span>
              <span
                style={{
                  fontFamily: theme.mono,
                  fontSize: ".55rem",
                  color: theme.cream,
                }}
              >
                {countUp(frame, fps, 80 + i * 6, bar.num, 20)}
              </span>
            </div>
            <div
              style={{
                height: 4,
                background: theme.cardHi,
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 2,
                  background: bar.color,
                  width: `${fillWidth}%`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const InsightsCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = slideUp(frame, fps, 75);
  const barHeights = [25, 38, 30, 45, 52, 35, 48, 55, 42, 58, 50, 40, 46, 32];
  const barColors = [
    ...Array(5).fill(theme.orange),
    ...Array(5).fill(theme.green),
    ...Array(4).fill("rgba(108,135,217,.8)"),
  ];

  return (
    <div
      style={{
        background: theme.card,
        border: `1px solid ${theme.cardHi}`,
        borderRadius: 10,
        padding: "1.25rem 1.5rem",
        opacity: anim.opacity,
        transform: `translateY(${anim.y}px)`,
      }}
    >
      <div style={{ marginBottom: ".75rem" }}>
        <div
          style={{
            fontFamily: theme.mono,
            fontSize: ".65rem",
            color: theme.dim,
            letterSpacing: ".12em",
          }}
        >
          WEEKLY ACTIVITY
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 3,
          height: 60,
          paddingBottom: 4,
          borderBottom: `1px solid ${theme.cardHi}`,
        }}
      >
        {barHeights.map((h, i) => {
          const height = barGrow(frame, fps, 85 + i * 1.5, h);
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height,
                borderRadius: "2px 2px 0 0",
                background: barColors[i],
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: ".3rem",
        }}
      >
        {["MON", "WED", "FRI", "SUN"].map((d) => (
          <span
            key={d}
            style={{
              fontFamily: theme.mono,
              fontSize: ".45rem",
              color: theme.dim,
            }}
          >
            {d}
          </span>
        ))}
      </div>
      <div
        style={{
          marginTop: ".75rem",
          display: "flex",
          gap: "1rem",
          opacity: fadeIn(frame, fps, 100),
        }}
      >
        {[
          { color: theme.orange, val: "142", label: "actions" },
          { color: theme.green, val: "89", label: "auto" },
          { color: theme.blue, val: "53", label: "manual" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: ".4rem",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: s.color,
              }}
            />
            <span
              style={{
                fontFamily: theme.mono,
                fontSize: ".55rem",
                color: theme.dim,
              }}
            >
              <span style={{ color: theme.cream, fontWeight: 600 }}>
                {s.val}
              </span>{" "}
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* Command Bar */
const CommandBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = slideUp(frame, fps, 90);
  const text = "summarize today and draft the evening report...";
  const typingProgress = interpolate(frame, [100, 160], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const visibleChars = Math.floor(typingProgress * text.length);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 220,
        right: 0,
        background: theme.card,
        borderTop: `1px solid ${theme.cardHi}`,
        padding: ".65rem 2rem",
        display: "flex",
        alignItems: "center",
        gap: ".75rem",
        opacity: anim.opacity,
        transform: `translateY(${anim.y}px)`,
      }}
    >
      <span style={{ fontFamily: theme.mono, fontSize: ".7rem", color: theme.orange }}>
        ~
      </span>
      <div
        style={{
          fontFamily: theme.mono,
          fontSize: ".72rem",
          color: theme.dim,
          flex: 1,
        }}
      >
        {text.substring(0, visibleChars)}
        <span
          style={{
            borderRight: `2px solid ${frame % 15 < 8 ? theme.orange : "transparent"}`,
            marginLeft: 1,
          }}
        >
          &nbsp;
        </span>
      </div>
      <div style={{ display: "flex", gap: ".4rem" }}>
        {["⌘K", "ESC"].map((k) => (
          <span
            key={k}
            style={{
              fontFamily: theme.mono,
              fontSize: ".55rem",
              color: theme.dim,
              background: theme.cardHi,
              padding: ".2rem .4rem",
              borderRadius: 3,
              border: "1px solid rgba(255,255,255,.06)",
            }}
          >
            {k}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN COMPOSITION
   ───────────────────────────────────────────── */
export const HeklaDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Subtle zoom over the whole duration
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.03], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.bg,
        fontFamily: theme.sans,
        fontSize: 14,
        lineHeight: 1.5,
        display: "flex",
        flexDirection: "row",
        transform: `scale(${zoom})`,
        transformOrigin: "center center",
      }}
    >
      <Sidebar />
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Subtle glow */}
        <div
          style={{
            position: "absolute",
            top: -50,
            right: 100,
            width: 400,
            height: 400,
            background: `radial-gradient(circle, rgba(212,100,58,.04) 0%, transparent 60%)`,
            pointerEvents: "none",
            opacity: fadeIn(frame, fps, 30),
          }}
        />
        <TopBar />
        <Header />
        <StatsBar />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 1fr",
            gap: "1.25rem",
            margin: "0 2.5rem 1.5rem",
          }}
        >
          <AgentPanel />
          <TimelinePanel />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "1.25rem",
            margin: "0 2.5rem 2rem",
          }}
        >
          <IssuesCard />
          <MemoryCard />
          <InsightsCard />
        </div>
        <CommandBar />
      </div>
    </AbsoluteFill>
  );
};
