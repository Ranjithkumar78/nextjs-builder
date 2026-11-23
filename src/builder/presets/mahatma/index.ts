import type { Theme } from "../../types";
import { ulid } from "../../ulid";
import { newPage } from "../../tree/pages";
import { SURFACE, mix } from "./helpers";
import { header } from "./header";
import { hero } from "./hero";
import { about } from "./about";
import { rules } from "./rules";
import { bigger } from "./bigger";
import { schedule } from "./schedule";
import { announce, terms } from "./closing";
import { footer } from "./footer";

/** Mahatma Alumni Meetup 2026 — homecoming homepage template. */
export function mahatmaTheme(): Theme {
  return {
    id: ulid(),
    name: "Mahatma Alumni Meetup 2026",
    tokens: {
      colors: {
        primary: "#c5a55a",
        secondary: "#1e2a47",
        accent: "#2f6380",
        background: "#e9dfcc",
        surface: "#f3ede2",
        text: "#1e2a47",
        muted: "#5a6274",
        border: "#ddd1b9",
        dark: "#1e2a47",
        onDark: "#f3ede2",
      },
      headingFont: "'Playfair Display', serif",
      bodyFont: "'Jost', sans-serif",
      baseFontSize: "16px",
      radius: "12px",
      containerWidth: "1190px",
    },
    header: [header()],
    footer: [footer()],
    pages: [
      newPage("Home", "home", [
        hero(),
        about(),
        rules(),
        bigger(),
        schedule(),
        announce("Chief Guest", "chief-guest", { backgroundColor: SURFACE, backgroundImage: `radial-gradient(${mix("var(--tb-text)", 7)} 1px, transparent 1px)`, backgroundSize: "22px 22px" }),
        announce("Sponsors", "sponsors", { backgroundColor: "#ffffff" }),
        terms(),
      ]),
    ],
    customCss: "html{scroll-behavior:smooth}\n.tb-root [id]{scroll-margin-top:90px}\n.tb-t-list li::marker{color:var(--tb-primary)}\n.tb-t-badge em{font-style:normal}",
  };
}
