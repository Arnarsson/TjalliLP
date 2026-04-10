import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { LightLeak } from "@remotion/light-leaks";
import { loadFont as loadInstrumentSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadDMSans } from "@remotion/google-fonts/DMSans";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import { theme } from "./theme";

// ═══ MOOD FILM — 5 shots. 14 words. Nothing else. ═══

const { fontFamily: serif } = loadInstrumentSerif("normal", {
  weights: ["400"],
  subsets: ["latin"],
});
const { fontFamily: sans } = loadDMSans("normal", {
  weights: ["400", "500"],
  subsets: ["latin"],
});
const { fontFamily: mono } = loadJetBrainsMono("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

// ─── Utilities ───
const ease = (frame: number, start: number, end: number, from: number, to: number) =>
  interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

const spr = (frame: number, fps: number, delay: number, damping = 25, stiffness = 45) =>
  spring({ frame: frame - delay, fps, from: 0, to: 1, config: { damping, stiffness, mass: 1.2 } });

// ─── Embers ───
const Embers: React.FC<{ count?: number; seed?: number }> = ({ count = 20, seed = 0 }) => {
  const frame = useCurrentFrame();
  const particles = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const s = seed + i;
      arr.push({
        x: ((s * 7919 + 104729) % 1440),
        y: ((s * 6271 + 88651) % 900),
        size: 1.2 + (s % 4) * 0.6,
        speed: 0.12 + (s % 6) * 0.05,
        drift: ((s * 3571) % 100) / 100 - 0.5,
        phase: (s * 2137) % 628 / 100,
        brightness: 0.25 + (s % 5) * 0.12,
      });
    }
    return arr;
  }, [count, seed]);

  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none", zIndex: 5 }}>
      {particles.map((e, i) => {
        const y = (e.y - frame * e.speed * 1.8) % 960;
        const adjustedY = y < -40 ? y + 1000 : y;
        const x = e.x + Math.sin(frame * 0.007 + e.phase) * 50 * e.drift;
        const pulse = 0.3 + 0.7 * Math.sin(frame * 0.025 + e.phase);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: adjustedY,
              width: e.size,
              height: e.size,
              borderRadius: "50%",
              backgroundColor: theme.orange,
              opacity: e.brightness * pulse * 0.65,
              boxShadow: `0 0 ${e.size * 4}px ${theme.orange}50`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ─── Grain ───
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' seed='${frame % 120}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "512px 512px",
        mixBlendMode: "overlay",
        pointerEvents: "none",
        zIndex: 90,
      }}
    />
  );
};

// ─── Vignette ───
const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%)",
      pointerEvents: "none",
      zIndex: 80,
    }}
  />
);

// ─── Scanline ───
const Scanline: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)`,
        backgroundPosition: `0 ${(frame * 0.4) % 4}px`,
        pointerEvents: "none",
        zIndex: 85,
      }}
    />
  );
};

// ─── Shot wrapper with Ken Burns ───
const Shot: React.FC<{
  children: React.ReactNode;
  zoom?: [number, number];
  panX?: [number, number];
  panY?: [number, number];
}> = ({ children, zoom = [1, 1.02], panX = [0, 0], panY = [0, 0] }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s = interpolate(t, [0, 1], zoom);
  const x = interpolate(t, [0, 1], panX);
  const y = interpolate(t, [0, 1], panY);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      <AbsoluteFill
        style={{
          transform: `scale(${s}) translate(${x}px, ${y}px)`,
          transformOrigin: "center center",
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════
// SHOT 1: H E K L A — wordmark from darkness
// Long, meditative. 7 seconds.
// ═══════════════════════════════════════════════════
const ShotWordmark: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const letters = ["H", "E", "K", "L", "A"];

  const lineW = interpolate(spr(frame, fps, 80, 35, 30), [0, 1], [0, 300]);

  return (
    <Shot zoom={[1, 1.03]} panY={[3, -3]}>
      <Embers count={16} seed={42} />

      {/* Warm backlight */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 300,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${theme.orange}0D 0%, transparent 70%)`,
            filter: "blur(80px)",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 4 }}>
          {letters.map((l, i) => {
            const delay = 25 + i * 14;
            const p = spr(frame, fps, delay, 16, 35);
            const y = interpolate(p, [0, 1], [55, 0]);
            const o = interpolate(p, [0, 0.15, 1], [0, 0, 1]);
            return (
              <span
                key={i}
                style={{
                  fontFamily: serif,
                  fontSize: 150,
                  fontWeight: 400,
                  color: theme.cream,
                  letterSpacing: 30,
                  opacity: o,
                  transform: `translateY(${y}px)`,
                  textShadow: `0 0 80px ${theme.orange}12`,
                }}
              >
                {l}
              </span>
            );
          })}
        </div>

        {/* Accent line */}
        <div
          style={{
            width: lineW,
            height: 1.5,
            background: `linear-gradient(90deg, transparent, ${theme.orange}AA, transparent)`,
            marginTop: 40,
          }}
        />
      </AbsoluteFill>
    </Shot>
  );
};

// ═══════════════════════════════════════════════════
// SHOT 2: "40 tabs open in your head."
// Slow, deliberate. Each word lands.
// ═══════════════════════════════════════════════════
const Shot40Tabs: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = ["It's", "2026."];

  return (
    <Shot zoom={[1, 1.015]} panX={[-2, 2]}>
      <Embers count={8} seed={77} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 18px", maxWidth: 900 }}>
          {words.map((w, i) => {
            const delay = 15 + i * 10;
            const p = spr(frame, fps, delay, 20, 40);
            const y = interpolate(p, [0, 1], [40, 0]);
            const o = interpolate(p, [0, 0.15, 1], [0, 0, 1]);

            const isNumber = w === "2026.";

            return (
              <span
                key={i}
                style={{
                  fontFamily: serif,
                  fontSize: isNumber ? 90 : 80,
                  fontWeight: 400,
                  color: isNumber ? theme.orange : theme.cream,
                  opacity: o,
                  transform: `translateY(${y}px)`,
                  display: "inline-block",
                  textShadow: isNumber ? `0 0 40px ${theme.orange}30` : "none",
                }}
              >
                {w}
              </span>
            );
          })}
        </div>

        {/* Subtle question mark energy — a soft pulse */}
        <div
          style={{
            position: "absolute",
            bottom: 280,
            fontFamily: serif,
            fontSize: 24,
            color: theme.dim,
            opacity: ease(frame, 80, 110, 0, 0.3),
          }}
        >
          ?
        </div>
      </AbsoluteFill>
    </Shot>
  );
};

// ═══════════════════════════════════════════════════
// SHOT 3: "HEKLA closes 39 of them."
// The answer. Calm. Confident.
// ═══════════════════════════════════════════════════
const ShotCloses39: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "HEKLA" appears first, then the rest
  const heklaP = spr(frame, fps, 20, 22, 40);
  const restP = spr(frame, fps, 50, 20, 38);
  const lineP = spr(frame, fps, 85, 35, 30);

  return (
    <Shot zoom={[1.01, 1]} panY={[2, -2]}>
      <Embers count={10} seed={33} />

      {/* Warm glow behind */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            position: "absolute",
            width: 500,
            height: 250,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${theme.orange}0A 0%, transparent 70%)`,
            filter: "blur(60px)",
            opacity: ease(frame, 40, 80, 0, 1),
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          {/* Line 1 */}
          <div
            style={{
              fontFamily: serif,
              fontSize: 58,
              color: theme.cream,
              opacity: interpolate(heklaP, [0, 0.15, 1], [0, 0, 1]),
              transform: `translateY(${interpolate(heklaP, [0, 1], [30, 0])}px)`,
            }}
          >
            Every company needs
          </div>

          {/* Line 2 — emphasis */}
          <div
            style={{
              fontFamily: serif,
              fontSize: 62,
              color: theme.orange,
              opacity: interpolate(restP, [0, 0.15, 1], [0, 0, 1]),
              transform: `translateY(${interpolate(restP, [0, 1], [25, 0])}px)`,
              marginTop: 8,
              textShadow: `0 0 50px ${theme.orange}20`,
            }}
          >
            an agentic strategy.
          </div>

          {/* Accent line */}
          <div
            style={{
              width: interpolate(lineP, [0, 1], [0, 200]),
              height: 1.5,
              background: `linear-gradient(90deg, transparent, ${theme.orange}AA, transparent)`,
              margin: "36px auto 0",
            }}
          />
        </div>
      </AbsoluteFill>
    </Shot>
  );
};

// ═══════════════════════════════════════════════════
// SHOT 4: "This is yours."
// ═══════════════════════════════════════════════════
const ShotThisIsYours: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chars = "This is yours.".split("");
  const lineP = spr(frame, fps, 10 + chars.length * 4, 30, 35);

  return (
    <Shot zoom={[1, 1.02]}>
      <Embers count={6} seed={88} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", overflow: "hidden" }}>
            {chars.map((c, i) => {
              const p = spr(frame, fps, 12 + i * 3, 18, 40);
              const y = interpolate(p, [0, 1], [70, 0]);
              const o = interpolate(p, [0, 0.12, 1], [0, 0, 1]);
              return (
                <span
                  key={i}
                  style={{
                    fontFamily: serif,
                    fontSize: 100,
                    fontWeight: 400,
                    color: theme.cream,
                    opacity: o,
                    transform: `translateY(${y}px)`,
                    display: "inline-block",
                  }}
                >
                  {c === " " ? "\u00A0" : c}
                </span>
              );
            })}
          </div>
          <div
            style={{
              width: interpolate(lineP, [0, 1], [0, 120]),
              height: 1,
              background: `linear-gradient(90deg, transparent, ${theme.orange}80, transparent)`,
              margin: "28px auto 0",
            }}
          />
        </div>
      </AbsoluteFill>
    </Shot>
  );
};

// ═══════════════════════════════════════════════════
// SHOT 5: "20 units · Spring 2026"
// Scarcity. Weight. Inevitability.
// ═══════════════════════════════════════════════════
const ShotUnits: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const topP = spr(frame, fps, 20, 26, 38);
  const bottomP = spr(frame, fps, 45, 26, 38);
  const lineW = interpolate(spr(frame, fps, 65, 35, 28), [0, 1], [0, 180]);

  return (
    <Shot zoom={[1, 1.01]}>
      <Embers count={12} seed={20} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontFamily: serif,
            fontSize: 60,
            color: theme.cream,
            opacity: topP,
            transform: `translateY(${interpolate(topP, [0, 1], [20, 0])}px)`,
          }}>
            20 units.
          </div>
          <div style={{
            fontFamily: sans,
            fontSize: 18,
            color: theme.dim,
            letterSpacing: 8,
            textTransform: "uppercase",
            marginTop: 20,
            opacity: bottomP,
            transform: `translateY(${interpolate(bottomP, [0, 1], [14, 0])}px)`,
          }}>
            Spring 2026
          </div>
          <div style={{
            width: lineW,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${theme.orange}AA, transparent)`,
            margin: "36px auto 0",
          }} />
        </div>
      </AbsoluteFill>
    </Shot>
  );
};

// ═══════════════════════════════════════════════════
// SHOT 5: hekla.cc — final, quiet
// ═══════════════════════════════════════════════════
const ShotURL: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spr(frame, fps, 30, 28, 32);
  const breathe = 0.6 + 0.4 * Math.sin(frame * 0.03);

  return (
    <Shot zoom={[1, 1.005]}>
      <Embers count={18} seed={0} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 200,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${theme.orange}14 0%, transparent 70%)`,
            filter: "blur(50px)",
            opacity: breathe,
          }}
        />
        <span style={{
          fontFamily: mono,
          fontSize: 36,
          color: theme.orange,
          letterSpacing: 8,
          opacity: p,
          transform: `translateY(${interpolate(p, [0, 1], [10, 0])}px)`,
          textShadow: `0 0 60px ${theme.orange}20`,
        }}>
          hekla.cc
        </span>
      </AbsoluteFill>
    </Shot>
  );
};

// ═══════════════════════════════════════════════════
// MAIN — 5 shots, ~30 seconds
// ═══════════════════════════════════════════════════
export const HeklaMoodFilm: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      <TransitionSeries>
        {/* Shot 1: H E K L A (7s) */}
        <TransitionSeries.Sequence durationInFrames={210} premountFor={30}>
          <ShotWordmark />
        </TransitionSeries.Sequence>

        <TransitionSeries.Overlay durationInFrames={35}>
          <LightLeak seed={1} hueShift={25} />
        </TransitionSeries.Overlay>

        {/* Shot 2: "40 tabs open in your head." (5s) */}
        <TransitionSeries.Sequence durationInFrames={150} premountFor={25}>
          <Shot40Tabs />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 18 })}
        />

        {/* Shot 3: "HEKLA closes 39 of them." (5s) */}
        <TransitionSeries.Sequence durationInFrames={150} premountFor={25}>
          <ShotCloses39 />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 18 })}
        />

        {/* Shot 4: "This is yours." (4s) */}
        <TransitionSeries.Sequence durationInFrames={120} premountFor={20}>
          <ShotThisIsYours />
        </TransitionSeries.Sequence>

        <TransitionSeries.Overlay durationInFrames={30}>
          <LightLeak seed={3} hueShift={20} />
        </TransitionSeries.Overlay>

        {/* Shot 5: "20 units · Spring 2026" (5s) */}
        <TransitionSeries.Sequence durationInFrames={150} premountFor={25}>
          <ShotUnits />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 18 })}
        />

        {/* Shot 5: hekla.cc (5s) */}
        <TransitionSeries.Sequence durationInFrames={150} premountFor={25}>
          <ShotURL />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Global atmosphere */}
      <Grain />
      <Vignette />
      <Scanline />
    </AbsoluteFill>
  );
};
