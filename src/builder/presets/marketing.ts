import type { TBNode } from "../types";
import { createNode as c } from "../registry";
import { section, container, centerHeader, grid } from "./helpers";

/* Features, stats and testimonials sections. */

const feature = (title: string, body: string, emoji: string) =>
  c("box", {}, { gap: "10px", padding: "28px" }, [
    c("text", { text: emoji }, { fontSize: "28px", lineHeight: "1" }),
    c("heading", { text: title, level: "h3" }, { fontSize: "20px" }),
    c("text", { text: body }, { fontSize: "15px" }),
  ]);

export function features(): TBNode {
  return c(
    "section",
    { htmlId: "features" },
    { padding: "96px 24px" },
    [
      container([
        ...centerHeader("Features", "Everything you need to launch", "Powerful building blocks with full design control over every single element."),
        grid(3, [
          feature("Drag & drop", "Place any component anywhere on the page and rearrange in seconds.", "🧲"),
          feature("Total style control", "Colors, fonts, padding, borders, shadows and hover states.", "🎨"),
          feature("Responsive", "Override styles separately for tablet and mobile screens.", "📱"),
          feature("Multiple themes", "Keep several complete themes side by side and switch instantly.", "🗂️"),
          feature("Global header & footer", "Edit once and it updates on every page of the theme.", "🧭"),
          feature("Clean export", "Download static HTML for the whole site as a ZIP.", "📦"),
        ]),
      ]),
    ],
    { name: "Features", mobile: { padding: "64px 20px" } }
  );
}

export function stats(): TBNode {
  const stat = (n: string, l: string) =>
    c("column", {}, { alignItems: "center", gap: "4px", minWidth: "140px" }, [
      c("heading", { text: n, level: "h3" }, { fontSize: "44px", color: "var(--tb-primary)" }),
      c("text", { text: l }, { fontSize: "15px", textAlign: "center" }),
    ]);
  return section([container([c("row", {}, { justifyContent: "space-around", gap: "32px" }, [stat("10k+", "Happy customers"), stat("99.9%", "Uptime"), stat("150+", "Countries"), stat("24/7", "Support")])])], { padding: "64px 24px", backgroundColor: "var(--tb-surface)" }, "Stats");
}

export function testimonials(): TBNode {
  const t = (q: string, who: string) =>
    c("box", {}, { gap: "16px" }, [
      c("text", { text: "★★★★★" }, { color: "#f59e0b", fontSize: "18px", letterSpacing: "2px" }),
      c("text", { text: q }, { color: "var(--tb-text)", fontSize: "16px" }),
      c("text", { text: who }, { fontWeight: "600", fontSize: "14px" }),
    ]);
  return section(
    [
      container([
        ...centerHeader("Testimonials", "Loved by teams everywhere", "Here is what our customers say about building with us."),
        grid(3, [
          t("“We rebuilt our entire marketing site in a weekend. The style controls are incredible.”", "Priya S. — Founder, Studio Nine"),
          t("“Finally a builder that does not fight me. Every pixel is exactly where I want it.”", "Marcus L. — Designer"),
          t("“Multiple themes let us test new looks without touching the live site.”", "Ana R. — Marketing Lead"),
        ]),
      ]),
    ],
    { padding: "96px 24px" },
    "Testimonials",
    { padding: "64px 20px" }
  );
}
