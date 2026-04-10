import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Easing,
} from "remotion";
import { loadFont as loadInstrumentSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadDMSans } from "@remotion/google-fonts/DMSans";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import { theme } from "./theme";
import { HeklaPromoMain } from "./HeklaPromoMain";
import { AgentsScreen } from "./AgentsScreen";
import { MemoryScreen } from "./MemoryScreen";

loadInstrumentSerif();
loadDMSans();
loadJetBrainsMono();

/* ─────────────────────────────────────────────────────────────────────────────
   CONSTANTS
   ───────────────────────────────────────────────────────────────────────────── */

const CANVAS_W = 1440;
const CANVAS_H = 900;

const WINDOW_W = 1200;
const WINDOW_H = 750;
const WIN_X    = (CANVAS_W - WINDOW_W) / 2; // 120px margin
const WIN_Y    = (CANVAS_H - WINDOW_H) / 2; // 75px margin

const SCREEN_W  = 1440;
const SCREEN_H  = 900;
const BASE_SCALE = WINDOW_W / SCREEN_W; // 0.8333

const D_FADE_OUT: [number, number] = [220, 265];
const A_FADE_IN:  [number, number] = [220, 265];
const A_FADE_OUT: [number, number] = [345, 390];
const M_FADE_IN:  [number, number] = [345, 390];
const M_FADE_OUT: [number, number] = [455, 505];
const B_FADE_IN:  [number, number] = [455, 505];

const TOTAL_FRAMES = 750;

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────────────────────────────────────── */

const smooth = Easing.inOut(Easing.cubic);
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ipl = (frame: number, frames: number[], values: number[]) =>
  interpolate(frame, frames, values, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: smooth,
  });

const xfade = (
  frame: number,
  fadeIn: [number, number],
  fadeOut?: [number, number],
): number => {
  const inVal = interpolate(frame, fadeIn, [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: smooth,
  });
  if (!fadeOut) return inVal;
  const outVal = interpolate(frame, fadeOut, [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: smooth,
  });
  return Math.min(inVal, outVal);
};

/* ─────────────────────────────────────────────────────────────────────────────
   CAMERA  — story beats zooming into clock, activity log, agent cards
   ───────────────────────────────────────────────────────────────────────────── */

//                 0    15   55   100  145  190  230  265  315  410  455
const CAM_KF    = [0,   15,  55,  100, 145, 190, 230, 265, 315, 410, 455];
const CAM_SCALE = [1.0, 1.0, 1.2, 1.55,1.65,1.58,1.42,1.35,1.2, 1.0, 1.0];
const CAM_FX    = [50,  50,  55,  72,  70,  50,  74,  60,  50,  50,  50 ];
const CAM_FY    = [50,  50,  28,  20,  22,  38,  43,  44,  50,  50,  50 ];

/* ─────────────────────────────────────────────────────────────────────────────
   CALLOUT PILLS
   ───────────────────────────────────────────────────────────────────────────── */

const CALLOUTS = [
  { label: "Always on.",          inF: 30,  outF: 120 },
  { label: "3 agents · 0 admin",  inF: 125, outF: 215 },
  { label: "47 tasks today",      inF: 220, outF: 300 },
  { label: "19,360 memories",     inF: 305, outF: 395 },
];

/* ─────────────────────────────────────────────────────────────────────────────
   BRAND REVEAL — letter-by-letter + word reveal
   ───────────────────────────────────────────────────────────────────────────── */

const LINE1_WORDS = ["40", "tabs", "open", "in", "your", "head."];
const LINE2_WORDS = ["HEKLA", "closes", "39", "of", "them."];

const BrandReveal: React.FC = () => {
  const frame = useCurrentFrame();

  const brandGlow = interpolate(frame, [0, 60, 200], [0, 0.10, 0.18], clamp);

  const dividerW = interpolate(frame, [100, 165], [0, 120], {
    ...clamp,
    easing: Easing.out(Easing.exp),
  });

  const sublineOpa = interpolate(frame, [215, 230], [0, 1], clamp);
  const badgeOpa   = interpolate(frame, [235, 250], [0, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      {/* Orange glow overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 70% 60% at 50% 50%, rgba(212,100,58,${brandGlow.toFixed(3)}) 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* H · E · K · L · A letters */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          marginBottom: 20,
        }}
      >
        {["H", "E", "K", "L", "A"].map((letter, i) => {
          const p = interpolate(frame, [20 + i * 14, 20 + i * 14 + 35], [0, 1], {
            ...clamp,
            easing: Easing.out(Easing.cubic),
          });
          const sepP = i < 4
            ? interpolate(frame, [20 + i * 14 + 7, 20 + i * 14 + 28], [0, 1], {
                ...clamp,
                easing: Easing.out(Easing.cubic),
              })
            : 0;

          return (
            <React.Fragment key={letter + i}>
              <div
                style={{
                  fontFamily: theme.serif,
                  fontSize: 96,
                  color: theme.cream,
                  lineHeight: 1,
                  letterSpacing: "0.05em",
                  opacity: p,
                  transform: `translateY(${interpolate(p, [0, 1], [50, 0])}px)`,
                  display: "inline-block",
                  width: 72,
                  textAlign: "center",
                }}
              >
                {letter}
              </div>
              {i < 4 && (
                <div
                  style={{
                    fontFamily: theme.serif,
                    fontSize: 48,
                    color: theme.orange,
                    lineHeight: 1,
                    opacity: sepP,
                    transform: `translateY(${interpolate(sepP, [0, 1], [20, 0])}px)`,
                    display: "inline-block",
                    width: 28,
                    textAlign: "center",
                    marginBottom: 8,
                  }}
                >
                  ·
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Tagline line 1 */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 8,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {LINE1_WORDS.map((word, i) => {
          const wordStart = 105 + i * 8;
          const p = interpolate(frame, [wordStart, wordStart + 12], [0, 1], {
            ...clamp,
            easing: Easing.out(Easing.cubic),
          });
          return (
            <span
              key={i}
              style={{
                fontFamily: theme.serif,
                fontSize: 40,
                color: theme.cream,
                lineHeight: 1.25,
                opacity: p,
                transform: `translateY(${interpolate(p, [0, 1], [10, 0])}px)`,
                display: "inline-block",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* Tagline line 2 */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 56,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {LINE2_WORDS.map((word, i) => {
          const wordStart = 155 + i * 8;
          const p = interpolate(frame, [wordStart, wordStart + 12], [0, 1], {
            ...clamp,
            easing: Easing.out(Easing.cubic),
          });
          const isHighlight = word === "39";
          return (
            <span
              key={i}
              style={{
                fontFamily: theme.serif,
                fontSize: 40,
                color: isHighlight ? theme.orange : theme.cream,
                lineHeight: 1.25,
                opacity: p,
                transform: `translateY(${interpolate(p, [0, 1], [10, 0])}px)`,
                display: "inline-block",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* Divider */}
      <div
        style={{
          width: dividerW,
          height: 1,
          background: `linear-gradient(90deg, transparent 0%, ${theme.cardHi} 30%, ${theme.cardHi} 70%, transparent 100%)`,
          marginBottom: 32,
        }}
      />

      {/* Sub-tagline */}
      <div
        style={{
          fontFamily: theme.sans,
          fontSize: 15,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: theme.body,
          marginBottom: 20,
          opacity: sublineOpa,
        }}
      >
        Personal AI · Encrypted · Everywhere
      </div>

      {/* Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontFamily: theme.mono,
          fontSize: 12,
          color: theme.dim,
          opacity: badgeOpa,
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: theme.orange,
            boxShadow: `0 0 6px ${theme.orange}`,
          }}
        />
        Spring 2026 · 20 units
      </div>
    </AbsoluteFill>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   MASTER COMPOSITION
   ───────────────────────────────────────────────────────────────────────────── */

export const HeklaPromo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Window intro (spring slide from below) ────────────────────────────────
  const introSpring = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 55 },
  });
  const windowY     = interpolate(introSpring, [0, 1], [50, 0]);
  const windowOpa   = interpolate(introSpring, [0, 1], [0, 1]);
  const windowScale = interpolate(introSpring, [0, 1], [0.97, 1]);

  // Window fades as brand starts
  const windowFade = interpolate(frame, [455, 505], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: smooth,
  });
  const windowOpaCombined = windowOpa * windowFade;

  // ── Camera ────────────────────────────────────────────────────────────────
  const camScale = ipl(frame, CAM_KF, CAM_SCALE);
  const focalX   = ipl(frame, CAM_KF, CAM_FX);
  const focalY   = ipl(frame, CAM_KF, CAM_FY);

  const totalScale = BASE_SCALE * camScale;

  // ── Scene opacities ───────────────────────────────────────────────────────
  const dOpa = xfade(frame, [0, 8],    D_FADE_OUT);
  const aOpa = xfade(frame, A_FADE_IN, A_FADE_OUT);
  const mOpa = xfade(frame, M_FADE_IN, M_FADE_OUT);
  const bOpa = xfade(frame, B_FADE_IN);

  // ── Scene blur ────────────────────────────────────────────────────────────
  const dBlur = interpolate(frame, D_FADE_OUT, [0, 6], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: smooth });
  const aBlur = interpolate(frame, A_FADE_OUT, [0, 6], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: smooth });
  const mBlur = interpolate(frame, M_FADE_OUT, [0, 6], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: smooth });

  // ── Background parallax glow ──────────────────────────────────────────────
  const glowX = interpolate(focalX, [30, 70], [60, 40]);
  const glowY = interpolate(focalY, [20, 60], [55, 35]);
  const glowPulse = 0.06 + 0.02 * Math.sin((frame / (TOTAL_FRAMES / 2)) * Math.PI);

  return (
    <AbsoluteFill style={{ background: "#0C0B09", overflow: "hidden" }}>
      {/* ── Gradient background ──────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: [
            `radial-gradient(ellipse 80% 70% at ${glowX}% ${glowY}%, rgba(212,100,58,${glowPulse.toFixed(3)}) 0%, transparent 70%)`,
            `radial-gradient(ellipse 60% 50% at ${100 - glowX}% ${100 - glowY}%, rgba(92,176,110,0.025) 0%, transparent 65%)`,
            `radial-gradient(ellipse 100% 100% at 50% 50%, rgba(19,17,16,0) 40%, rgba(8,7,6,0.7) 100%)`,
          ].join(", "),
        }}
      />

      {/* Noise grain overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.025,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
          pointerEvents: "none",
        }}
      />

      {/* ── Floating window ──────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          left: WIN_X,
          top: WIN_Y,
          width: WINDOW_W,
          height: WINDOW_H,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: [
            "0 0 0 1px rgba(255,255,255,0.05)",
            "0 2px 4px rgba(0,0,0,0.4)",
            "0 12px 30px rgba(0,0,0,0.55)",
            "0 40px 80px rgba(0,0,0,0.65)",
            "0 100px 200px rgba(0,0,0,0.4)",
          ].join(", "),
          transform: `translateY(${windowY}px) scale(${windowScale})`,
          opacity: windowOpaCombined,
        }}
      >
        {/* ── Camera viewport ──────────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            width: SCREEN_W,
            height: SCREEN_H,
            left: (WINDOW_W - SCREEN_W) / 2,
            top: (WINDOW_H - SCREEN_H) / 2,
            transform: `scale(${totalScale})`,
            transformOrigin: `${focalX}% ${focalY}%`,
          }}
        >
          {/* Dashboard (HeklaPromoMain) */}
          {dOpa > 0 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: dOpa,
                filter: `blur(${dBlur}px)`,
              }}
            >
              <Sequence from={0} durationInFrames={D_FADE_OUT[1] + 2}>
                <HeklaPromoMain />
              </Sequence>
            </div>
          )}

          {/* Agents */}
          {aOpa > 0 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: aOpa,
                filter: `blur(${aBlur}px)`,
              }}
            >
              <Sequence from={A_FADE_IN[0]} durationInFrames={A_FADE_OUT[1] - A_FADE_IN[0] + 2}>
                <AgentsScreen />
              </Sequence>
            </div>
          )}

          {/* Memory */}
          {mOpa > 0 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: mOpa,
                filter: `blur(${mBlur}px)`,
              }}
            >
              <Sequence from={M_FADE_IN[0]} durationInFrames={M_FADE_OUT[1] - M_FADE_IN[0] + 2}>
                <MemoryScreen />
              </Sequence>
            </div>
          )}
        </div>

        {/* Callout pills — inside window, above camera */}
        <div style={{ position: "absolute", bottom: 28, left: 28, zIndex: 10 }}>
          {CALLOUTS.map((pill, i) => {
            const pillSpring = spring({
              frame: Math.max(0, frame - pill.inF),
              fps,
              config: { damping: 18, stiffness: 90 },
            });
            const pillOpa = xfade(frame, [pill.inF, pill.inF + 10], [pill.outF - 10, pill.outF]);
            if (pillOpa <= 0) return null;
            const pillY = interpolate(pillSpring, [0, 1], [14, 0]);

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#1E1D1B",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: 100,
                  padding: "6px 14px 6px 10px",
                  fontFamily: theme.mono,
                  fontSize: 10,
                  color: theme.cream,
                  opacity: pillOpa,
                  transform: `translateY(${pillY}px)`,
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  whiteSpace: "nowrap",
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: theme.orange,
                    flexShrink: 0,
                  }}
                />
                {pill.label}
              </div>
            );
          })}
        </div>

        {/* Window top-edge specular highlight */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "15%",
            right: "15%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.12) 70%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* ── Window reflection ────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          left: WIN_X,
          top: WIN_Y + WINDOW_H,
          width: WINDOW_W,
          height: WINDOW_H * 0.28,
          transform: `scaleY(-1) translateY(${-windowY}px) scale(${windowScale})`,
          transformOrigin: "center top",
          opacity: windowOpaCombined * 0.55,
          background: "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(180deg, black 0%, transparent 75%)",
          maskImage: "linear-gradient(180deg, black 0%, transparent 75%)",
          pointerEvents: "none",
          overflow: "hidden",
          borderRadius: "0 0 12px 12px",
        }}
      />

      {/* ── Brand reveal ─────────────────────────────────────────────────── */}
      {bOpa > 0 && (
        <AbsoluteFill style={{ opacity: bOpa }}>
          <Sequence from={B_FADE_IN[0]} durationInFrames={TOTAL_FRAMES - B_FADE_IN[0]}>
            <BrandReveal />
          </Sequence>
        </AbsoluteFill>
      )}

      {/* Edge vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.4) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
