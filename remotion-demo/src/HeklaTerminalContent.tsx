import React from "react";
import { theme } from "./theme";
import { HeklaCursor } from "./HeklaCursor";

const COMMAND = "hekla --status";
const TYPING_START = 20;
const TYPING_SPEED = 2; // frames per character
const TYPING_END = TYPING_START + COMMAND.length * TYPING_SPEED;
const OUTPUT_START = TYPING_END + 8;

const OUTPUT_LINES: { text: string; delay: number }[] = [
  { text: "┌  hekla v1.0 — private instance", delay: 0 },
  { text: "│", delay: 4 },
  { text: "◇  Memory: 4,218 context nodes loaded", delay: 8 },
  { text: "│", delay: 12 },
  { text: "◇  Agents: 3 active", delay: 16 },
  { text: "│   → Inbox: 12 emails triaged", delay: 22 },
  { text: "│   → Calendar: 3 meetings prepared", delay: 28 },
  { text: "│   → CRM: 5 contacts updated", delay: 34 },
  { text: "│", delay: 40 },
  { text: "└  Your brain is ready", delay: 46 },
];

interface HeklaTerminalContentProps {
  frame: number;
}

export const HeklaTerminalContent: React.FC<HeklaTerminalContentProps> = ({
  frame,
}) => {
  const charsToShow = Math.max(
    0,
    Math.floor((frame - TYPING_START) / TYPING_SPEED)
  );
  const typedText = COMMAND.slice(0, Math.min(charsToShow, COMMAND.length));
  const isTyping = charsToShow < COMMAND.length && frame >= TYPING_START;
  const typingDone = frame >= TYPING_END;

  return (
    <div
      style={{
        fontFamily: theme.mono,
        fontSize: 13,
        lineHeight: 1.7,
        color: theme.cream,
        padding: "20px 24px",
      }}
    >
      {/* Prompt line */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ color: theme.orange, marginRight: 8 }}>❯</span>
        <span>{typedText}</span>
        {!typingDone && <HeklaCursor frame={frame} isTyping={isTyping} />}
      </div>

      {/* Output lines */}
      {typingDone &&
        OUTPUT_LINES.map((line, i) => {
          const lineFrame = frame - OUTPUT_START;
          const visible = lineFrame >= line.delay;
          if (!visible) return null;

          const isStatus = line.text.startsWith("└");
          const isHeader = line.text.startsWith("┌");

          return (
            <div
              key={i}
              style={{
                color: isStatus
                  ? theme.green
                  : isHeader
                  ? theme.body
                  : line.text.includes("→")
                  ? theme.body
                  : theme.cream,
                opacity: line.text === "│" ? 0.3 : 1,
              }}
            >
              {line.text}
            </div>
          );
        })}

      {/* Trailing cursor after output */}
      {typingDone && frame - OUTPUT_START >= OUTPUT_LINES[OUTPUT_LINES.length - 1].delay + 4 && (
        <div style={{ display: "flex", alignItems: "center", marginTop: 4 }}>
          <span style={{ color: theme.orange, marginRight: 8 }}>❯</span>
          <HeklaCursor frame={frame} isTyping={false} />
        </div>
      )}
    </div>
  );
};
