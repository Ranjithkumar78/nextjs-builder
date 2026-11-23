import type { StyleMap, TBNode } from "../../types";
import { createNode as c } from "../../registry";

/* Mahatma Alumni Meetup 2026 — homecoming homepage template.
   Images live in /public/mahatma. Everything here is ordinary builder nodes, so every line is editable. */

// Every color below is a theme color, so editing the palette in Themes updates the whole page.
export const NAVY = "var(--tb-dark)"; // dark sections, text on gold buttons
export const GOLD = "var(--tb-primary)";
export const GOLD_DARK = "color-mix(in srgb, var(--tb-primary) 62%, #000)";
export const TEAL = "var(--tb-accent)";
export const CREAM = "var(--tb-on-dark)"; // text on dark sections
export const SURFACE = "var(--tb-surface)";
export const SOFT = "color-mix(in srgb, var(--tb-on-dark) 68%, var(--tb-dark))";
export const LINE = "var(--tb-border)";
export const mix = (a: string, pct: number, b = "transparent") => `color-mix(in srgb, ${a} ${pct}%, ${b})`;

export const HEAD = "var(--tb-heading-font)";

export const eyebrow = (text: string, color = TEAL, extra: StyleMap = {}) =>
  c(
    "text",
    { text },
    {
      fontSize: "13px",
      fontWeight: "500",
      letterSpacing: "3px",
      textTransform: "uppercase",
      color,
      paddingLeft: "40px",
      backgroundImage: "linear-gradient(currentColor, currentColor)",
      backgroundSize: "26px 1px",
      backgroundPosition: "left center",
      backgroundRepeat: "no-repeat",
      lineHeight: "1.4",
      ...extra,
    }
  );

export const display = (text: string, size: number, extra: StyleMap = {}, accent = GOLD, level = "h2", mobile = Math.round(size * 0.6)) =>
  c("heading", { text, level, accentColor: accent }, { fontSize: `${size}px`, fontWeight: "400", lineHeight: "1.08", color: "var(--tb-text)", ...extra }, undefined, {
    tablet: { fontSize: `${Math.round(size * 0.8)}px` },
    mobile: { fontSize: `${mobile}px` },
  });

export const body = (text: string, extra: StyleMap = {}) => c("text", { text }, { fontSize: "15px", lineHeight: "1.8", color: "var(--tb-muted)", ...extra });

export const section = (name: string, children: TBNode[], styles: StyleMap, htmlId?: string) =>
  c("section", htmlId ? { htmlId } : {}, { padding: "96px 24px", ...styles }, children, { name, mobile: { padding: "64px 20px" } });

export const container = (children: TBNode[], styles: StyleMap = {}) => c("container", {}, { gap: "18px", ...styles }, children);

export const row = (children: TBNode[], styles: StyleMap = {}, mobile?: StyleMap) => c("row", {}, styles, children, mobile ? { mobile } : {});
export const col = (children: TBNode[], styles: StyleMap = {}) => c("column", {}, styles, children);

export const pill = (text: string, href: string, variant: "gold" | "ghost", extra: StyleMap = {}) =>
  c(
    "button",
    { text, href },
    variant === "gold"
      ? { backgroundColor: GOLD, color: NAVY, borderRadius: "999px", padding: "16px 32px", fontWeight: "500", fontSize: "16px", ...extra }
      : {
          backgroundColor: "rgba(255,255,255,.06)",
          color: "#ffffff",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "rgba(255,255,255,.45)",
          borderRadius: "999px",
          padding: "16px 32px",
          fontWeight: "500",
          fontSize: "16px",
          ...extra,
        },
    undefined,
    { hover: variant === "gold" ? { backgroundColor: mix(GOLD, 85, "#fff"), transform: "translateY(-1px)" } : { backgroundColor: "rgba(255,255,255,.14)" } }
  );
