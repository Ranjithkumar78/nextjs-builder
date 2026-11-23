import type { TBNode, Theme } from "../types";
import { walkNodes } from "../tree/find";

export interface FontOption {
  label: string;
  value: string;
  google?: string;
}

export const FONT_OPTIONS: FontOption[] = [
  { label: "System UI", value: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" },
  { label: "Inter", value: "'Inter', sans-serif", google: "Inter:wght@300;400;500;600;700;800" },
  { label: "Jost", value: "'Jost', sans-serif", google: "Jost:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400" },
  { label: "Poppins", value: "'Poppins', sans-serif", google: "Poppins:wght@300;400;500;600;700;800" },
  { label: "Montserrat", value: "'Montserrat', sans-serif", google: "Montserrat:wght@300;400;500;600;700;800" },
  { label: "DM Sans", value: "'DM Sans', sans-serif", google: "DM+Sans:wght@300;400;500;600;700" },
  { label: "Space Grotesk", value: "'Space Grotesk', sans-serif", google: "Space+Grotesk:wght@300;400;500;600;700" },
  { label: "Roboto", value: "'Roboto', sans-serif", google: "Roboto:wght@300;400;500;700;900" },
  { label: "Open Sans", value: "'Open Sans', sans-serif", google: "Open+Sans:wght@300;400;600;700;800" },
  { label: "Lato", value: "'Lato', sans-serif", google: "Lato:wght@300;400;700;900" },
  { label: "Nunito", value: "'Nunito', sans-serif", google: "Nunito:wght@300;400;600;700;800" },
  { label: "Playfair Display", value: "'Playfair Display', serif", google: "Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600" },
  { label: "Merriweather", value: "'Merriweather', serif", google: "Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,400" },
  { label: "Lora", value: "'Lora', serif", google: "Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500" },
  { label: "Cormorant Garamond", value: "'Cormorant Garamond', serif", google: "Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500" },
  { label: "Bodoni Moda", value: "'Bodoni Moda', serif", google: "Bodoni+Moda:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500" },
  { label: "Georgia", value: "Georgia, 'Times New Roman', serif" },
  { label: "JetBrains Mono", value: "'JetBrains Mono', monospace", google: "JetBrains+Mono:wght@400;500;700" },
  { label: "Courier", value: "'Courier New', monospace" },
];

export const THEME_FONT_VARS: FontOption[] = [
  { label: "Theme heading font", value: "var(--tb-heading-font)" },
  { label: "Theme body font", value: "var(--tb-body-font)" },
];

/** Font options for a select input. */
export const FONT_SELECT_OPTIONS = FONT_OPTIONS.map((f) => ({ label: f.label, value: f.value }));

/** Find every Google font used by the theme tokens and node styles. */
export function googleFontsUrl(theme: Theme, nodes: TBNode[]): string | null {
  const used = new Set<string>();
  const check = (v?: string) => {
    if (!v) return;
    for (const f of FONT_OPTIONS) if (f.google && v.includes(f.value.split(",")[0])) used.add(f.google);
  };
  check(theme.tokens.headingFont);
  check(theme.tokens.bodyFont);
  walkNodes(nodes, (n) => {
    check(n.styles.desktop.fontFamily);
    check(n.styles.tablet?.fontFamily);
    check(n.styles.mobile?.fontFamily);
  });
  if (used.size === 0) return null;
  return `https://fonts.googleapis.com/css2?${[...used].map((g) => `family=${g}`).join("&")}&display=swap`;
}
