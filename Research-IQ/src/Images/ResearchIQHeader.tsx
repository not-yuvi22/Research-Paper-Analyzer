import { useState } from "react";

// ── Stripe colors top→bottom (index 0 = top of bar / outermost arc) ──────────
const STRIPES = ["#97002E", "#E9440A", "#F3AB0C", "#F2E6CF", "#9DD1AF", "#2BB4A0"];
const N = STRIPES.length; // 6

type Theme = "dark" | "light";
const NAV_LINKS = ["DASHBOARD", "WATCH DEMO", "VIEW TESTIMONIALS", "FEATURES"] as const;

// ── Rainbow SVG: arc + horizontal bar in one single SVG ───────────────────────
// Strategy:
//  - Card height = H px. Arc centre = bottom-left corner (0, H).
//  - Each stripe i (0=outermost/top, 5=innermost/bottom) is drawn as:
//      • A quarter-circle arc from (0, H - Ri) sweeping to (Ri, H)
//      • Then a horizontal line from (Ri, H - Y_i) to (cardWidth, H - Y_i)
//        where Y_i is the y-offset of that stripe in the bottom bar
//  - No gaps between stripes: each stripe band = BAR_H / N pixels tall
//  - Stroke width = band height, so stripes are solid with no space
//
// The arc radius for stripe i:
//   R_outermost (i=0) must be large enough to fill the card height visually,
//   yet the arc-end x (= R_i) must match where the horizontal bar stripe lives.
//   Bar stripe i sits at y = H - (BAR_H - i*BW - BW/2) from top
//   i.e. its centre y from bottom = BW/2 + (N-1-i)*BW
//   So R_i (arc radius) = H - (centre_y_from_top of stripe i)
//              = BW/2 + (N-1-i)*BW = BW*(N - i - 0.5)
// This guarantees perfect arc→bar join with zero gap.

function RainbowSVG({
  cardWidth,
  cardHeight,
  barHeight,
}: {
  cardWidth: number;
  cardHeight: number;
  barHeight: number;
}) {
  const BW = barHeight / N; // band width (height of each stripe) — no gap
  const cx = 0;
  const cy = cardHeight;

  return (
    <svg
      width={cardWidth}
      height={cardHeight}
      viewBox={`0 0 ${cardWidth} ${cardHeight}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
      preserveAspectRatio="none"
    >
      {STRIPES.map((color, i) => {
        // Radius so the arc endpoint lands exactly on this stripe's centre
        const R = BW * (N - i - 0.5);
        // Centre y of this stripe from top of card
        const stripeCY = cardHeight - barHeight + i * BW + BW / 2;

        // Arc: from top of arc (cx, cy - R) sweeping 90° CW to (cx + R, cy)
        // But cy - R might go negative if R > cardHeight — clamp arc start to 0
        const arcStartY = cy - R; // may be negative if arc is very large
        const arcStartX = cx;
        const arcEndX = cx + R;
        const arcEndY = cy; // = cardHeight (bottom edge)

        // We only draw the arc if it's visible (R ≤ cardHeight, i.e. stripe fits)
        const drawArc = R <= cardHeight + BW;

        return (
          <g key={i}>
            {drawArc && (
              <path
                d={`M ${arcStartX} ${arcStartY} A ${R} ${R} 0 0 1 ${arcEndX} ${arcEndY}`}
                stroke={color}
                strokeWidth={BW}
                strokeLinecap="butt"
                fill="none"
              />
            )}
            {/* Horizontal bar stripe — from arc endpoint x to card right edge */}
            <line
              x1={drawArc ? arcEndX : 0}
              y1={stripeCY}
              x2={cardWidth}
              y2={stripeCY}
              stroke={color}
              strokeWidth={BW}
            />
          </g>
        );
      })}
    </svg>
  );
}

// ── Theme Toggle ──────────────────────────────────────────────────────────────
function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const isDark = theme === "dark";
  return (
    <button
      onClick={onToggle}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "2px",
        borderRadius: "999px",
        border: `1.5px solid ${isDark ? "#3a3a3a" : "#aaa"}`,
        backgroundColor: isDark ? "#1a1a1a" : "#ddd",
        padding: "3px 4px",
        cursor: "pointer",
        minWidth: "76px",
        transition: "background 200ms ease",
      }}
    >
      <span style={{ fontSize: "13px", width: "22px", textAlign: "center", opacity: isDark ? 1 : 0.35 }}>🌙</span>
      <span
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: isDark ? "#F0EBE0" : "#333",
          flexShrink: 0,
          transition: "background 200ms ease",
        }}
      />
      <span style={{ fontSize: "13px", width: "22px", textAlign: "center", opacity: isDark ? 0.35 : 1 }}>☀️</span>
    </button>
  );
}

// ── Nav Link ──────────────────────────────────────────────────────────────────
function NavLink({ label, theme }: { label: string; theme: Theme }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href="#"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "'Space Mono', monospace",
        fontWeight: 700,
        fontSize: "12px",
        letterSpacing: "0.09em",
        textTransform: "uppercase",
        color: hovered ? "#F3C94B" : theme === "dark" ? "#E8E0D0" : "#222",
        textDecoration: "none",
        transition: "color 200ms ease",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </a>
  );
}

// ── Main Header ───────────────────────────────────────────────────────────────
export default function ResearchIQHeader() {
  const [theme, setTheme] = useState<Theme>("dark");
  const isDark = theme === "dark";

  // Layout constants
  const CARD_HEIGHT = 96;   // total card height px
  const BAR_HEIGHT = 18;    // total rainbow bar height (all 6 stripes combined) — thin like prototype
   // each stripe band = 3px, no gap

  // The outermost stripe (i=0, #97002E) has R = BW*(N-0-0.5) = BW*5.5
  // = 3 * 5.5 = 16.5 — a small tight arc hugging bottom-left, exactly like prototype
  // Content must be padded above the bar
  const CONTENT_PB = BAR_HEIGHT + 4; // px bottom padding for content row

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* Page background */}
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: isDark ? "#0a0a0a" : "#EDEAD E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
        }}
      >
        {/* Header card — fixed height, relative for SVG overlay */}
        <div
          id="header-card"
          style={{
            width: "100%",
            maxWidth: "1380px",
            height: `${CARD_HEIGHT}px`,
            backgroundColor: isDark ? "#131313" : "#FAFAF5",
            border: `1.5px solid ${isDark ? "#252525" : "#C5BDB0"}`,
            borderRadius: "14px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Rainbow SVG — full card size, sits at z=0 */}
          {/* Use a ResizeObserver-free approach: render at 100% width via CSS */}
          <div style={{ position: "absolute", inset: 0 }}>
            <RainbowSVG
              cardWidth={1380}
              cardHeight={CARD_HEIGHT}
              barHeight={BAR_HEIGHT}
            />
          </div>

          {/* Content row — z=1, positioned with bottom padding above bar */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: `0 28px ${CONTENT_PB}px 20px`,
            }}
          >
            {/* Logo */}
            <div style={{ display: "flex", flexDirection: "column", paddingLeft: "8px" }}>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  fontSize: "26px",
                  letterSpacing: "0.05em",
                  color: isDark ? "#F0EBE0" : "#111",
                  lineHeight: 1,
                  textTransform: "uppercase",
                }}
              >
                RESEARCH-IQ
              </span>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 400,
                  fontSize: "8px",
                  letterSpacing: "0.2em",
                  color: isDark ? "#777" : "#666",
                  textTransform: "uppercase",
                  marginTop: "5px",
                }}
              >
                SMART RESEARCH PAPER ANALYZER
              </span>
            </div>

            {/* Nav links + toggle */}
            <nav style={{ display: "flex", alignItems: "center" }}>
              {NAV_LINKS.map((link, i) => (
                <div key={link} style={{ display: "flex", alignItems: "center" }}>
                  <NavLink label={link} theme={theme} />
                  {i < NAV_LINKS.length - 1 && (
                    <span
                      style={{
                        color: isDark ? "#333" : "#ccc",
                        margin: "0 16px",
                        fontSize: "16px",
                        fontWeight: 200,
                        lineHeight: 1,
                        userSelect: "none",
                      }}
                    >
                      |
                    </span>
                  )}
                </div>
              ))}
              <span style={{ color: isDark ? "#333" : "#ccc", margin: "0 16px", fontSize: "16px", fontWeight: 200, userSelect: "none" }}>|</span>
              <ThemeToggle theme={theme} onToggle={() => setTheme(isDark ? "light" : "dark")} />
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
