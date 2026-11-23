import type { Theme, ThemeTokens } from "./types";
import { ulid } from "./ulid";
import { deepClone } from "./lib/values";
import { newPage } from "./tree/pages";
import * as P from "./presets";

export { newPage };
export { mahatmaTheme } from "./presets";

export const TOKEN_PRESETS: { id: string; label: string; tokens: ThemeTokens }[] = [
  {
    id: "light",
    label: "Clean Light",
    tokens: {
      colors: { primary: "#4f46e5", secondary: "#7c3aed", accent: "#f59e0b", background: "#ffffff", surface: "#f8fafc", text: "#0f172a", muted: "#475569", border: "#e2e8f0", dark: "#0f172a", onDark: "#f1f5f9" },
      headingFont: "'Inter', sans-serif",
      bodyFont: "'Inter', sans-serif",
      baseFontSize: "16px",
      radius: "10px",
      containerWidth: "1180px",
    },
  },
  {
    id: "midnight",
    label: "Midnight",
    tokens: {
      colors: { primary: "#22d3ee", secondary: "#a855f7", accent: "#f472b6", background: "#0b1020", surface: "#121a33", text: "#f1f5f9", muted: "#94a3b8", border: "#1f2a48", dark: "#060a16", onDark: "#f1f5f9" },
      headingFont: "'Space Grotesk', sans-serif",
      bodyFont: "'DM Sans', sans-serif",
      baseFontSize: "16px",
      radius: "14px",
      containerWidth: "1200px",
    },
  },
  {
    id: "editorial",
    label: "Editorial",
    tokens: {
      colors: { primary: "#b45309", secondary: "#78350f", accent: "#0f766e", background: "#fffdf8", surface: "#f7f1e6", text: "#1c1917", muted: "#57534e", border: "#e7dccb", dark: "#1c1917", onDark: "#faf5ec" },
      headingFont: "'Playfair Display', serif",
      bodyFont: "'Lora', serif",
      baseFontSize: "17px",
      radius: "4px",
      containerWidth: "1100px",
    },
  },
  {
    id: "fresh",
    label: "Fresh Green",
    tokens: {
      colors: { primary: "#059669", secondary: "#0d9488", accent: "#facc15", background: "#ffffff", surface: "#f0fdf4", text: "#052e16", muted: "#3f6212", border: "#d1fae5", dark: "#052e16", onDark: "#ecfdf5" },
      headingFont: "'Poppins', sans-serif",
      bodyFont: "'Nunito', sans-serif",
      baseFontSize: "16px",
      radius: "16px",
      containerWidth: "1160px",
    },
  },
];

/** A copy of a preset's tokens (the first preset when the id is unknown). */
function presetTokens(presetId: string): ThemeTokens {
  return deepClone(TOKEN_PRESETS.find((t) => t.id === presetId)?.tokens ?? TOKEN_PRESETS[0].tokens);
}

export function starterTheme(name = "Starter", presetId = "light"): Theme {
  return {
    id: ulid(),
    name,
    tokens: presetTokens(presetId),
    header: [P.navbar()],
    footer: [P.footer()],
    pages: [
      newPage("Home", "home", [P.heroCentered(), P.features(), P.stats(), P.testimonials(), P.pricing(), P.cta()]),
      newPage("About", "about", [P.pageTitle("About us", "The story, the people and the mission behind our work."), P.aboutContent(), P.team(), P.faq()]),
      newPage("Contact", "contact", [P.pageTitle("Contact", "We would love to hear from you."), P.contact()]),
    ],
    customCss: "",
  };
}

export function blankTheme(name = "Blank theme", presetId = "light"): Theme {
  return {
    id: ulid(),
    name,
    tokens: presetTokens(presetId),
    header: [],
    footer: [],
    pages: [newPage("Home", "home")],
    customCss: "",
  };
}
